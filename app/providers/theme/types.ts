export type Theme = "light" | "dark"

export type State = {
  theme: Theme
}

export type Actions = {
  toggleTheme: () => void
}

export type Context = [State, Actions]
