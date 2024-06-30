export type State = {
  /// The currently stored api key.
  apiKey?: string
}

export type Actions = {
  ///Set a new api key. (Only set by the auth page)
  setAPIKey: (key: string) => void
  /// Clears the api key when the user logs out.
  clearApiKey: () => void
}

export type Context = [State, Actions]
