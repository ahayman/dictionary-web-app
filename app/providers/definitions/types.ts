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
  /**
   * A list of recent words, ordered by when they were searched.
   */
  recent: string[]
  /**
   * A list of favorite words, including their short defs.
   */
  favorites: WordDefMeta[]
  /**
   * A cache of word definitions.
   */
  cache: WordDefinitionCache
  /**
   * The meta cache is needed to maintain meta when a user is favoriting/unfavoriting
   * words from the favorites page.  Otherwise, words removed from the favorite list
   * would not be able to be re-favorited.
   */
  metaCache: WordMetaCache
  /**
   * The "current" word, or the last word searched for, maintained independently from the
   * recent list because that list can be manipulated by the user.
   */
  currentWord?: string
}

export type Actions = {
  /// Search for a word. Return a WordSearchResult
  searchWordDefinition: (word: string) => Promise<WordSearchResult>
  /// Favorite or unfavorite a word
  setFavorite: (word: string, isFavorite: boolean) => void
  /// Sets the current word (done in the definition page)
  setCurrentWord: (word?: string) => void
  /// Removes a word from the recent list
  removeRecentWord: (word: string) => void
}

export type Context = [State, Actions]

/**
 * Searching for a word will result in either:
 * - a full definition
 * - a list of alternative words
 * - an error
 */
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
