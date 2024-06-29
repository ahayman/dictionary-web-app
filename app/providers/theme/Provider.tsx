"use client"
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Context, Theme } from "./types"
import { StorageContext } from "../storage/Provider"
import {} from "@/app/utils/ArrayExtensions"

export const ThemeContext = createContext<Context>([] as any)

export type Props = {
  children: ReactNode
}

const isTheme = (value: any): value is Theme => {
  if (typeof value !== "string") return false
  if (["dark", "light"].contains(value)) return true
  return false
}

export default function Provider({ children }: Props) {
  const [{ getSet, set }] = useContext(StorageContext)
  const [theme, setTheme] = useState<Theme>(() => {
    const theme = getSet("data-theme", () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    )
    if (isTheme(theme)) return theme
    else return "dark"
  })

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark"
    set("data-theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    setTheme(newTheme)
  }, [theme, set])

  // There's probably a better way to do this.
  useEffect(() => document.documentElement.setAttribute("data-theme", theme))

  return (
    <ThemeContext.Provider value={[{ theme }, { toggleTheme }]}>
      {children}
    </ThemeContext.Provider>
  )
}
