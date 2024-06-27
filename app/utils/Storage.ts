export type StorageKey =
  | "api-key"
  | "recent-words"
  | "favorite-words"
  | "current-word"
  | "data-theme"

export const Storage = {
  get: (name: StorageKey) => {
    return localStorage.getItem(name) ?? undefined
  },
  set: (name: StorageKey, value?: string) => {
    if (value) {
      localStorage.setItem(name, value)
    } else {
      localStorage.removeItem(name)
    }
  },
  getValue: (name: StorageKey, defaultValue: number = 1) => {
    let variable = localStorage.getItem(name) ?? undefined
    return extractValue(variable, defaultValue)
  },
  setValue: (name: StorageKey, value: number) => {
    localStorage.setItem(name, `${value}`)
  },
}

export const extractValue = (
  variable: string | undefined,
  defaultValue: number
): number => {
  if (!variable) {
    return defaultValue
  }
  const match = variable.match(/^\d+\.\d+|^\d+|^\.\d+/)?.[0]
  if (!match) {
    return defaultValue
  }
  const value = Number.parseFloat(match)
  if (isNaN(value)) {
    return defaultValue
  }
  return value
}
