import "@/app/utils/ArrayExtensions"
import { MutableRefObject, RefObject } from "react"

export type Action = (cancelled: RefObject<boolean>) => Promise<void>
type Operation = {
  action: Action
  cancelled: MutableRefObject<boolean>
}
/**
 * Configuration of the AsyncQueue. Serial will ensure operations are executed
 * one after the other. Concurrent will execute tasks as they are received.
 */
type QueueType = "serial" | "concurrent"
/**
 * A simple execution queue. Useful for ensuring tasks are executed in
 * an expected manner.
 */
export default class AsyncQueue {
  private pending: Operation[] = []
  private running: Operation[] = []
  private type: QueueType

  constructor(type: QueueType) {
    this.type = type
  }

  private startSerialRun = async () => {
    if (this.running.length > 0) {
      return
    }
    while (this.pending.length > 0) {
      this.running = this.pending
      this.pending = []
      const currentRun = this.running
      for (const op of currentRun) {
        if (!op.cancelled.current) {
          if (this.type === "serial") {
            await op.action(op.cancelled)
          } else {
            op.action(op.cancelled)
          }
        }
      }
      this.running = []
    }
  }

  private runActions = async (ops: Operation[]) => {
    ops.forEach((op) => this.running.push(op))
    for (const op of ops) {
      await op.action(op.cancelled)
      this.running.remove(op)
    }
  }

  /**
   * This queues up actions to run serially.
   * If the queue is already serial, this has the same effect as calling `queue` repeatedly.
   * If the queue is concurrent, this provided actions will be run serially for themselves, but
   * concurrently with any other actions that were called.
   * @param actions
   */
  queueSerial = (actions: Action[]) => {
    if (this.type === "serial") {
      for (const action of actions) {
        this.pending.push({
          action,
          cancelled: { current: false },
        })
      }
      this.startSerialRun()
    } else {
      this.runActions(
        actions.map((action) => ({
          action,
          cancelled: { current: false },
        }))
      )
    }
  }

  /**
   * Queue an action. If the queue is serial, the action will be run after any pending actions have finished.
   * If the queue is concurrent, the action is run immediately.
   * @param action
   */
  queue = (action: Action) => {
    if (this.type === "serial") {
      this.pending.push({
        action,
        cancelled: { current: false },
      })
      this.startSerialRun()
    } else {
      this.runActions([
        {
          action,
          cancelled: { current: false },
        },
      ])
    }
  }

  cancelAll = () => {
    const ops = [...this.pending, ...this.running]
    this.pending = []
    this.running = []
    ops.forEach((op) => (op.cancelled.current = true))
  }
}
