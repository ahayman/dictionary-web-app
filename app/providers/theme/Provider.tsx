"use client"
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react"
import { Context, Theme } from "./types"
import { Storage } from "@/app/utils/Storage"

export const ThemeContext = createContext<Context>([] as any)

export type Props = {
  children: ReactNode
}

const isTheme = (value: any): value is Theme => {
  if (typeof value !== "string") return false
  if (["dark", "light"].contains(value)) return true
  return false
}

const getSetInitial = (): Theme => {
  let value = Storage.get("data-theme")
  if (!isTheme(value)) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    const theme = prefersDark ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", theme)
    return theme
  } else {
    document.documentElement.setAttribute("data-theme", value)
    return value
  }
}

export default function Provider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === "undefined" ? "dark" : getSetInitial()
  )

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark"
    Storage.set("data-theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    setTheme(newTheme)
  }, [theme])

  // There's probably a better way to do this.
  useEffect(() => document.documentElement.setAttribute("data-theme", theme))

  return (
    <ThemeContext.Provider value={[{ theme }, { toggleTheme }]}>
      {children}
    </ThemeContext.Provider>
  )
}
