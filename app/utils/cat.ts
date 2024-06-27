import { isNotEmpty } from "./isNotEmpty"

export const cat = (...names: (string | undefined | null)[]) =>
  names.filter(isNotEmpty).join(" ")
