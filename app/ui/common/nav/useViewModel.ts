import { Icon } from "../types"
import { NavRoute } from "../../navigation/types"
import {
  MagnifyingGlassIcon,
  ClockIcon,
  StarIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline"
import { isNotEmpty } from "@/app/utils/isNotEmpty"
import { useCallback, useContext, useMemo, useState } from "react"
import { AuthContext } from "@/app/providers/auth/Provider"
import { DefinitionsContext } from "@/app/providers/definitions/Provider"
import { ThemeContext } from "@/app/providers/theme/Provider"
import { Theme } from "@/app/providers/theme/types"

export type NavItem = {
  title: string
  icon: Icon
  route: NavRoute
}

export type ViewState = {
  confirmSignout: boolean
  navItems: NavItem[]
  theme: Theme
}

export type ViewActions = {
  signout: () => void
  confirmedSignout: () => void
  cancelSignout: () => void
  toggleTheme: () => void
}

export default function useViewModel(): [ViewState, ViewActions] {
  const [{ theme }, { toggleTheme }] = useContext(ThemeContext)
  const [, { clearApiKey }] = useContext(AuthContext)
  const [{ currentWord, favorites, recent }] = useContext(DefinitionsContext)
  const [confirmSignout, setConfirmSignout] = useState(false)
  const navItems: NavItem[] = useMemo(
    () =>
      [
        {
          title: "Search",
          icon: MagnifyingGlassIcon,
          route: { route: "search" },
        },
        favorites.length > 0
          ? {
              title: "Favorites",
              icon: StarIcon,
              route: { route: "favorites" },
            }
          : undefined,
        recent.length > 0
          ? {
              title: "Recent",
              icon: ClockIcon,
              route: { route: "recent" },
            }
          : undefined,
        currentWord
          ? {
              title:
                currentWord.length <= 15
                  ? currentWord
                  : `...${currentWord.slice(0, 12)}`,
              icon: BookOpenIcon,
              route: {
                route: "definition",
                word: currentWord,
              },
            }
          : undefined,
      ].filter(isNotEmpty) as NavItem[],
    [currentWord, favorites, recent]
  )

  const signout = useCallback(() => setConfirmSignout(true), [])
  const cancelSignout = useCallback(() => setConfirmSignout(false), [])
  const confirmedSignout = useCallback(() => {
    setConfirmSignout(false)
    clearApiKey()
  }, [clearApiKey])

  return [
    { navItems, confirmSignout, theme },
    { signout, confirmedSignout, cancelSignout, toggleTheme },
  ]
}
