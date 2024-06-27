export type State = {
  apiKey?: string
}

export type Actions = {
  setAPIKey: (key: string) => void
  clearApiKey: () => void
}

export type Context = [State, Actions]
