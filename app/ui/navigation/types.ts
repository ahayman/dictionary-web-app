export type NavRoute =
  | {
      route: "search"
    }
  | {
      route: "auth"
    }
  | {
      route: "definition"
      word: string
    }
  | {
      route: "recent"
    }
  | {
      route: "favorites"
    }

export interface NavInstance {
  /**
   * Navigate to the previous history entry.
   */
  back(): void
  /**
   * Navigate to the next history entry.
   */
  forward(): void
  /**
   * Refresh the current page.
   */
  refresh(): void
  /**
   * Navigate to the provided href.
   * Pushes a new history entry.
   */
  push(route: NavRoute): void
  /**
   * Navigate to the provided href.
   * Replaces the current history entry.
   */
  replace(route: NavRoute): void

  /**
   * Generate a href string from a provided route.
   */
  routeHref(route: NavRoute): string
}
