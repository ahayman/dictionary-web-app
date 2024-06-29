export type StorageKey =
  | "api-key"
  | "recent-words"
  | "favorite-words"
  | "current-word"
  | "data-theme"

export type Actions = {
  /**
   * Will return the stored value, if present.
   * Will return undefined if the component is run on the server
   */
  get(key: StorageKey): string | undefined
  /**
   * Will return the stored value if present, or default value if it's not.
   * Will store default value is `storeDefault` is true.
   * If the component is run on the server, will return "".  Default value function
   * will not be run on the server.
   */
  getSet(
    key: StorageKey,
    defaultValue: () => string,
    storeDefault?: boolean
  ): string
  /**
   * Stores the value under the key provided
   */
  set(key: StorageKey, value: string): void
  /**
   * Clears the value for the provided key
   */
  clear(key: StorageKey): void
}

export type Context = [Actions]
