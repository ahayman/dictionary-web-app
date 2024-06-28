import useNav from "@/app/ui/navigation/useNav"
import { DefinitionsContext } from "@/app/providers/definitions/Provider"
import { WordDefinition } from "@/app/providers/definitions/types"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"

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

export type ViewState = {
  word: string
  definition?: DefinitionResponse
  loading: boolean
  isFavorite: boolean
  error?: string
}

export type ViewActions = {
  refresh: () => Promise<void>
  selectAlternative: (word: string) => void
  toggleFavorite: () => void
}

export default function useViewModel(word: string): [ViewState, ViewActions] {
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
