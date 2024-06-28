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
  State,
  WordDefMeta,
  WordDefinition,
  WordMetaCache,
  WordSearchResult,
} from "./types"
import { Storage } from "@/app/utils/Storage"
import { Reducer } from "./Reducer"
import { APIContext } from "../api/Provider"
import { AuthContext } from "../auth/Provider"

export const DefinitionsContext = createContext<Context>([] as any)

export type Props = {
  children: ReactNode
}

export const GetStoredFavorites = (): WordDefMeta[] => {
  const json = Storage.get("favorite-words")
  if (json === undefined) return []
  const meta: WordDefMeta[] = JSON.parse(json)
  return meta
}

export const GetStoredRecent = (): string[] => {
  const json = Storage.get("recent-words")
  if (json === undefined) return []
  let data = JSON.parse(json) as any[]
  if (data.length > 0 && typeof data[0] === "object") {
    data = data.map((d) => d.word)
  }
  return data
}

const InitialState: State = {
  recent: [],
  favorites: [],
  popular: [],
  cache: {},
  metaCache: {},
}

const getInitialStateFromStorage = (): State => {
  const recent = GetStoredRecent()
  const favorites = GetStoredFavorites()
  const metaCache: WordMetaCache = {}
  favorites.forEach((m) => (metaCache[m.word] = m))
  return {
    recent,
    favorites,
    currentWord: Storage.get("current-word"),
    popular: [],
    cache: {},
    metaCache,
  }
}

export default function Provider({ children }: Props) {
  const { getWordDefinition } = useContext(APIContext)
  const [{ apiKey }] = useContext(AuthContext)
  const [state, dispatch] = useReducer(
    Reducer,
    typeof window === "undefined",
    (isServer) => (isServer ? InitialState : getInitialStateFromStorage())
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

  const setCurrentWord = useCallback((word?: string) => {
    dispatch({ type: "set-current-word", word })
    Storage.set("current-word", word)
  }, [])

  const removeRecentWord = useCallback((word: string) => {
    dispatch({ type: "remove-recent-word", word })
  }, [])

  useEffect(() => {
    Storage.set("favorite-words", JSON.stringify(state.favorites))
  }, [state.favorites])

  useEffect(() => {
    Storage.set("recent-words", JSON.stringify(state.recent))
  }, [state.recent])

  useEffect(() => {
    if (apiKey === undefined) {
      Storage.set("recent-words")
      Storage.set("favorite-words")
      Storage.set("current-word")
    }
  }, [apiKey])

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
