import { createContext, ReactNode, useCallback, useMemo } from "react"
import { Context, StorageKey } from "./types"

export const StorageContext = createContext<Context>([] as any)

export type Props = {
  children: ReactNode
}

export default function Provider({ children }: Props) {
  const isServer = useMemo(() => typeof window === "undefined", [])

  const get = useCallback(
    (key: StorageKey): string | undefined => {
      if (isServer) return undefined
      return localStorage.getItem(key) ?? undefined
    },
    [isServer]
  )

  const getSet = useCallback(
    (
      key: StorageKey,
      defaultValue: () => string,
      storeDefault?: boolean
    ): string => {
      if (isServer) return ""
      let value = localStorage.getItem(key)
      if (value === null) {
        value = defaultValue()
        if (storeDefault) {
          localStorage.setItem(key, value)
        }
      }
      return value
    },
    [isServer]
  )

  const set = useCallback(
    (key: StorageKey, value: string): void => {
      if (isServer) return
      localStorage.setItem(key, value)
    },
    [isServer]
  )

  const clear = useCallback(
    (key: StorageKey): void => {
      if (isServer) return
      localStorage.removeItem(key)
    },
    [isServer]
  )

  return (
    <StorageContext.Provider value={[{ get, getSet, set, clear }]}>
      {children}
    </StorageContext.Provider>
  )
}
