import useNav from "@/app/ui/navigation/useNav"
import { DefinitionsContext } from "@/app/providers/definitions/Provider"
import { WordDefinition } from "@/app/providers/definitions/types"
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"
import { useParams } from "next/navigation"

/**
 * When retrieving a definition, we can get back the definition or
 * a list of alternatives. Alternatives should only be returned if a user
 * manually navigates to this page.  In-app navigations should only occur for
 * known words.
 */
export type DefinitionResponse =
  | {
      type: "definition"
      definition: WordDefinition
    }
  | {
      type: "alternatives"
      altWords: string[]
      word: string
    }

//There should only be one word. This is the way
const wordFromParams = (word: string | string[]) =>
  decodeURIComponent(word instanceof Array ? word.join("_") : word)

export type ViewState = {
  /**
   * `word`: The word in question, retrieved from the page params.
   */
  word: string
  /**
   * `definition`: The definition response, retrieved from cache or api.
   */
  definition?: DefinitionResponse
  /**
   * `loading`: Used if a definition isn't in cache, while being retrieved from the api.
   */
  loading: boolean
  /**
   * `isFavorite`: the word's favorited status.
   */
  isFavorite: boolean
  /**
   * `error`: If retrieving a definition results in an error.
   */
  error?: string
}

export type ViewActions = {
  /**
   * Refresh the definition
   */
  refresh: () => Promise<void>
  /**
   * If an alt list is provided, this selects the word and navigates to that definition.
   */
  selectAlternative: (word: string) => void
  /**
   *  Toggle the favorite status of the word.
   */
  toggleFavorite: () => void
}

export default function useViewModel(): [ViewState, ViewActions] {
  const { word: paramWord } = useParams()
  const word = useRef(wordFromParams(paramWord)).current
  const nav = useNav()
  const [
    { cache, favorites },
    { searchWordDefinition, setCurrentWord, setFavorite },
  ] = useContext(DefinitionsContext)
  const [loading, setLoading] = useState(false)
  const [error, setErrot] = useState<string>()
  const [definition, setDefinition] = useState<DefinitionResponse | undefined>(
    () => {
      const def = cache[word]
      return def ? { type: "definition", definition: def } : undefined
    }
  )
  const isFavorite = useMemo(
    () => favorites.containsAny((f) => f.word === word),
    [favorites, word]
  )

  const selectAlternative = useCallback(
    (word: string) => {
      nav.push({ route: "definition", word })
    },
    [nav]
  )

  const fetchDefinition = useCallback(async () => {
    if (loading) return
    setLoading(true)
    const result = await searchWordDefinition(word)
    switch (result.result) {
      case "definition":
        setDefinition({ type: "definition", definition: result.definition })
        break
      case "alternatives":
        setDefinition({ type: "alternatives", altWords: result.altWords, word })
        break
      case "error":
        setErrot(result.message)
        break
    }
    setLoading(false)
  }, [loading, searchWordDefinition, word])

  const toggleFavorite = useCallback(
    () => setFavorite(word, !isFavorite),
    [isFavorite, setFavorite, word]
  )

  useEffect(() => setCurrentWord(word), [setCurrentWord, word])

  useEffect(() => {
    if (word && !definition && !loading) {
      fetchDefinition()
    }
  }, [definition, fetchDefinition, loading, word])

  return [
    { word, definition, loading, error, isFavorite },
    { refresh: fetchDefinition, selectAlternative, toggleFavorite },
  ]
}
