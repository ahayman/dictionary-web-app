import { useCallback, useState } from "react"

export type Cache = {
  [k: string]: boolean | undefined
}

export type Actions = {
  select: (key: string) => void
  unSelect: (key: string) => void
  clearCache: () => void
}

export default function useSelectionCache(
  initial: Cache = {}
): [Cache, Actions] {
  const [cache, setCache] = useState(initial)

  const select = useCallback(
    (key: string) => setCache((c) => ({ ...c, [key]: true })),
    []
  )
  const unSelect = useCallback(
    (key: string) => setCache((c) => ({ ...c, [key]: false })),
    []
  )
  const clearCache = useCallback(() => setCache({}), [])

  return [
    cache,
    {
      select,
      unSelect,
      clearCache,
    },
  ]
}
