import { ReactNode, Context } from "react"

export type Props<T> = {
  state: T
  context: Context<T>
  children: ReactNode
}

export default function MockProvider<State>({
  state,
  context,
  children,
}: Props<State>) {
  return <context.Provider value={state}>{children}</context.Provider>
}
