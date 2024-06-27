import { useCallback, useRef, useState } from "react"
import AsyncQueue from "@/app/utils/AsyncQueue"

/**
 * The AsyncReducer function takes state and action and returns a promise of the _partial_ state (changed portions).
 * The returned partial state will be merged with the current state as of the time the reducer function completes.
 */
export type AsyncReducer<State, Action> = (
  state: State,
  action: Action
) => Promise<Partial<State>>

/**
 * The SerialAsyncReducer takes state and an action, and returns the promise of a new state. The new state will
 * be updated in the useSerialAsyncReducer serially along with any other actions.
 */
export type SerialAsyncReducer<State, Action> = (
  state: State,
  action: Action
) => Promise<State>

/**
 * A completion handler to be called after an action(s) has completed. Since actions can be cancelled, the completion
 * handler can possibly be called with 'cancelled' instead of an updated state.
 */
export type AsyncCompletionHandler<State> = (state: State | "cancelled") => void

/**
 * The dispatcher function use to dispatch an action to either a Async or SerialAsync Reducer. Is returned when calling
 * useAsyncReducer or useSerialAsyncReducer.
 *
 * Generally, an action is passed in. But also an onComplete handler can be passed in to run once the action(s) has completed.
 */
export type AsynDispatcher<Action, State> = (
  action: Action,
  onComplete?: AsyncCompletionHandler<State>
) => void

/**
 * A special type of action that will cancel all current actions.
 * Note: Client Actions defined for an asyncReducer probably should include this action.
 */
export type CancelAsyncAction = { type: "cancelAsyncOps" }

/**
 * A special state reserved for when an async reducer function throws an error.
 * If this happens, the asyncError value is set with the error returned.
 */
type ErrorState = {
  asyncError?: any
}

/**
 * A way to determine whether an action is a cancel action, which needs to be handled
 * differently from "normal" actions.
 */
const isCancelAsyncAction = (value: any): value is CancelAsyncAction => {
  if (
    typeof value === "object" &&
    value.type &&
    value.type === "cancelAsyncOps"
  ) {
    return true
  }
  return false
}

/**
 * This is an async reducer that runs all dispatches concurrently in a non-deterministic order.
 * The returned reducer value will be **merged** into the state (instead of replacing it.)
 * This allow multiple concurrent requests to run without overriding each other's state, so long as the
 * state updates don't interfere with each other.
 *
 * All Pending Operations can be cancelled by passing in the `cancelAsyncOps` action. This is **highly**
 * recommended to do when a component unmounts. Once operations are cancelled, they will not result in a state update.
 *
 * Dispatcher can also include a completion handler. If an array of actions are provided, the completion handler will run after the last one.
 * If a single action is provided, the completion will run after it has completed. Completion handler is provided the latest state or 'cancelled'.
 * If an array of actions are cancelled mid-run, the completion handler will be called with 'cancelled', even though state change may have resulted
 * from those action that had completed.
 *
 * @param reducer Takes the State and an Action and should return Partial<State> asynchronously. The state will be merged.
 * @param initialState The initial state.
 * @returns current state and dispatcher
 */
export const useAsyncReducer = <State extends ErrorState, Action>(
  reducer: AsyncReducer<State, Action>,
  initialState: State
): [
  State & ErrorState,
  AsynDispatcher<Action | Action[] | CancelAsyncAction, State & ErrorState>
] => {
  const [state, setState] = useState<State & ErrorState>(initialState)
  const queue = useRef(new AsyncQueue("concurrent"))
  const stateRef = useRef(state)
  const dispatcher = useCallback(
    (
      action: Action | CancelAsyncAction | Action[],
      onComplete?: AsyncCompletionHandler<State & ErrorState>
    ) => {
      if (isCancelAsyncAction(action)) {
        queue.current.cancelAll()
        onComplete?.("cancelled")
      } else {
        const actions = action instanceof Array ? action : [action]
        const lastIndex = actions.length - 1
        // This will queue a group or single action in serial.
        queue.current.queueSerial(
          actions.map((action, index) => async (cancelled) => {
            // Only call completion when this is the last action
            const complete = index === lastIndex ? onComplete : undefined
            if (cancelled.current) {
              return complete?.("cancelled")
            }
            const ref = stateRef
            try {
              const state = await reducer(ref.current, action)
              if (cancelled.current) {
                return complete?.("cancelled")
              }
              const newState = { ...stateRef.current, ...state }
              ref.current = newState
              setState(newState)
              return complete?.(newState)
            } catch (error: any) {
              if (cancelled.current) {
                return complete?.("cancelled")
              }
              const newState = { ...ref.current, asyncError: error }
              ref.current = newState
              setState(newState)
              return complete?.(newState)
            }
          })
        )
      }
    },
    [reducer]
  )
  return [state, dispatcher]
}

/**
 * This is a serial async reducer pattern that executes all dispatches asynchronously in a serial manner.
 * The order the reducers are run are _deterministic_, FIFO, and sequential. The state returned by prior
 * operations will be passed into the next operation. State is not automatically merged (as it is in asynReducer)
 * but fully replaced from the result of each action.
 *
 * **Warning:** A hung async operation will block any further dispatch.
 *
 * All Pending Operations can be cancelled by passing in the `cancelAsyncOps` action. This is **highly**
 * recommended to do when a component unmounts. Once operations are cancelled, they will not result in a state update.
 *
 * Dispatcher can also include a completion handler, which will be run after the action has completed.
 * Completion handler is provided the latest state or 'cancelled'.
 *
 * @param reducer Takes the State and an Action and should return State asynchronously.
 * @param initialState The initial state.
 * @returns current state and dispatcher
 */
export const useSerialAsyncReducer = <State extends ErrorState, Action>(
  reducer: SerialAsyncReducer<State, Action>,
  initialState: State
): [
  State & ErrorState,
  AsynDispatcher<Action | CancelAsyncAction, State & ErrorState>
] => {
  const [state, setState] = useState<State & ErrorState>(initialState)
  const queue = useRef(new AsyncQueue("serial"))
  const stateRef = useRef(state)
  const dispatcher = useCallback(
    (
      action: Action | CancelAsyncAction,
      onComplete?: AsyncCompletionHandler<State & ErrorState>
    ) => {
      if (isCancelAsyncAction(action)) {
        queue.current.cancelAll()
        onComplete?.("cancelled")
      } else {
        queue.current.queue(async (cancelled) => {
          if (cancelled.current) {
            return
          }
          const sRef = stateRef
          try {
            const state = await reducer(stateRef.current, action)
            if (cancelled.current) {
              return
            }
            sRef.current = state
            setState(state)
          } catch (error: any) {
            if (cancelled.current) {
              return
            }
            const newState = { ...sRef.current, asyncError: error }
            sRef.current = newState
            setState(newState)
          }
        })
      }
    },
    [reducer]
  )
  return [state, dispatcher]
}
