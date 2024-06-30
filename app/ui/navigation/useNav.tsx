import { useRouter } from "next/navigation"
import { NavInstance, NavRoute } from "./types"
import { useCallback, useMemo } from "react"

/**
 * A wrapper around `useRouter()` that allows for type-safe
 * routing.
 */
export default function useNav(): NavInstance {
  const router = useRouter()

  const routeHref = useCallback((route: NavRoute): string => {
    switch (route.route) {
      case "auth":
        return "/auth"
      case "favorites":
        return "/dashboard/favorites"
      case "recent":
        return "/dashboard/recent"
      case "search":
        return "/dashboard"
      case "definition":
        return `/dashboard/definition/${route.word}`
    }
  }, [])

  const back = useCallback(() => router.back(), [router])
  const forward = useCallback(() => router.forward(), [router])
  const refresh = useCallback(() => router.refresh(), [router])
  const push = useCallback(
    (route: NavRoute) => router.push(routeHref(route)),
    [router, routeHref]
  )
  const replace = useCallback(
    (route: NavRoute) => router.replace(routeHref(route)),
    [router, routeHref]
  )

  return useMemo(
    () => ({
      back,
      forward,
      refresh,
      push,
      replace,
      routeHref,
    }),
    [back, forward, refresh, push, replace, routeHref]
  )
}
