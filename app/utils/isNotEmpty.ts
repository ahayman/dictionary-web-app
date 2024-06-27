export const isNotEmpty = <T>(item: T | undefined | null): item is T => {
  return item !== undefined && item !== null
}
