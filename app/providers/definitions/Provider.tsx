import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react"
import {
  Context,
  WordDefMeta,
  WordDefinition,
  WordMetaCache,
  WordSearchResult,
} from "./types"
import { Reducer } from "./Reducer"
import { APIContext } from "../api/Provider"
import { AuthContext } from "../auth/Provider"
import { StorageContext } from "../storage/Provider"

export const DefinitionsContext = createContext<Context>([] as any)

export type Props = {
  children: ReactNode
}

//Convenience function pure for typing
export const favoritesFromString = (json?: string): WordDefMeta[] =>
  json ? JSON.parse(json) : []

//Convenience function pure for typing
export const recentFromString = (json?: string): string[] =>
  json ? JSON.parse(json) : []

/**
 * The Definitions Provider is responsible for managing all the cached definition,
 * favorited words, recent word, and the last selected word.
 * It also provides the primary method of searching for a word definition. While it's
 * technically possible for view models to directly access the api, this is preferred as
 * this provider will maintain a cache of definitions.
 */
export default function Provider({ children }: Props) {
  const [{ get, set, clear }] = useContext(StorageContext)
  const { getWordDefinition } = useContext(APIContext)
  const [{ apiKey }] = useContext(AuthContext)
  const [state, dispatch] = useReducer(
    Reducer,
    typeof window === "undefined",
    () => {
      const recent = recentFromString(get("recent-words"))
      const favorites = favoritesFromString(get("favorite-words"))
      const metaCache: WordMetaCache = {}
      favorites.forEach((m) => (metaCache[m.word] = m))
      return {
        recent,
        favorites,
        currentWord: get("current-word"),
        cache: {},
        metaCache,
      }
    }
  )

  const searchWordDefinition = useCallback(
    async (word: string): Promise<WordSearchResult> => {
      if (word.length > 100) {
        return {
          result: "error",
          message:
            "To many characters: Please search for a word less than 100 characters long.",
        }
      }

      const cached = state.cache[word]
      if (cached !== undefined) {
        dispatch({ type: "add-recent-word", word })
        return {
          result: "definition",
          definition: cached,
        }
      }

      const result = await getWordDefinition(word)
      switch (result.status) {
        case "success": {
          const definition: WordDefinition = {
            word,
            definitions: result.data,
          }
          dispatch({
            type: "update-cache",
            definition,
          })
          dispatch({ type: "add-recent-word", word })
          return {
            result: "definition",
            definition,
          }
        }
        case "failure": {
          return {
            result: "alternatives",
            altWords: result.data,
          }
        }
        case "error": {
          return {
            result: "error",
            message: result.message,
          }
        }
      }
    },
    [getWordDefinition, state.cache]
  )

  const setFavorite = useCallback((word: string, isFavorite: boolean) => {
    dispatch({
      type: isFavorite ? "favorite-word" : "unfavorite-word",
      word,
    })
  }, [])

  const setCurrentWord = useCallback(
    (word?: string) => {
      dispatch({ type: "set-current-word", word })
      if (word) {
        set("current-word", word)
      } else {
        clear("current-word")
      }
    },
    [set, clear]
  )

  const removeRecentWord = useCallback((word: string) => {
    dispatch({ type: "remove-recent-word", word })
  }, [])

  useEffect(() => {
    set("favorite-words", JSON.stringify(state.favorites))
  }, [state.favorites, set])

  useEffect(() => {
    set("recent-words", JSON.stringify(state.recent))
  }, [state.recent, set])

  useEffect(() => {
    if (apiKey === undefined) {
      clear("recent-words")
      clear("favorite-words")
      clear("current-word")
    }
  }, [apiKey, clear])

  return (
    <DefinitionsContext.Provider
      value={[
        state,
        {
          searchWordDefinition,
          setFavorite,
          setCurrentWord,
          removeRecentWord,
        },
      ]}
    >
      {children}
    </DefinitionsContext.Provider>
  )
}
