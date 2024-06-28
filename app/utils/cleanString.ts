/**
  Cleans the string of all the api formatting marks (which we're not using).
  Note: this could be named better.
 */
export default function cleanString<T extends String | undefined>(str: T): T {
  return str
    ?.replaceAll("{sx|", "(")
    ?.replaceAll("||}", ")")
    ?.replaceAll(/\{.*?\}/g, "") as T
}
