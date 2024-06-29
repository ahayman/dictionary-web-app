import { DefinitionResponse } from "@/app/api/schema/DefinitionResponseSchema"

export type WordDefMeta = {
  word: string
  shortDefs: string[]
}

export type WordDefinition = {
  /**
   * The word in question
   */
  word: string
  /**
   * All of the definitions for the word.
   * Note: It is not ideal to use the direct API response. In a normal app,
   * I wouldn't do this. But in this case, I'm cheating for the sake of time.
   */
  definitions: DefinitionResponse[]
}

export type WordDefinitionCache = { [word: string]: WordDefinition | undefined }
export type WordMetaCache = { [word: string]: WordDefMeta | undefined }

export type State = {
  recent: string[]
  favorites: WordDefMeta[]
  cache: WordDefinitionCache
  metaCache: WordMetaCache
  currentWord?: string
}

export type Actions = {
  searchWordDefinition: (word: string) => Promise<WordSearchResult>
  setFavorite: (word: string, isFavorite: boolean) => void
  setCurrentWord: (word?: string) => void
  removeRecentWord: (word: string) => void
}

export type Context = [State, Actions]

export type WordSearchResult =
  | {
      result: "definition"
      definition: WordDefinition
    }
  | {
      result: "alternatives"
      altWords: string[]
    }
  | {
      result: "error"
      message: string
    }
