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
  WordSearchResult,
} from "./types"
import { Storage } from "@/app/utils/Storage"
import { Reducer } from "./Reducer"
import { APIContext } from "../api/Provider"

export const DefinitionsContext = createContext<Context>([] as any)

export type Props = {
  children: ReactNode
}

export const GetStoredMeta = (
  type: "recent-words" | "favorite-words"
): WordDefMeta[] => {
  const json = Storage.get(type)
  if (json === undefined) return []
  const meta: WordDefMeta[] = JSON.parse(json)
  return meta
}

const InitialState: State = {
  recent: [],
  favorites: [],
  popular: [],
  cache: {},
}

export default function Provider({ children }: Props) {
  const { getWordDefinition } = useContext(APIContext)
  const [state, dispatch] = useReducer(
    Reducer,
    typeof window === "undefined",
    (isServer) =>
      isServer
        ? InitialState
        : {
            recent: GetStoredMeta("recent-words"),
            favorites: GetStoredMeta("favorite-words"),
            currentWord: Storage.get("current-word"),
            popular: [],
            cache: {},
          }
  )

  const searchWordDefinition = useCallback(
    async (word: string): Promise<WordSearchResult> => {
      const cached = state.cache[word]
      if (cached !== undefined)
        return {
          result: "definition",
          definition: cached,
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
