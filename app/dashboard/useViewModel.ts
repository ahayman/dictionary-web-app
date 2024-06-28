"use client"

import { useCallback, useContext, useMemo, useState } from "react"
import useNav from "../ui/navigation/useNav"
import { DefinitionsContext } from "../providers/definitions/Provider"

export type ViewState = {
  searchEntry: string
  loading: boolean
  altWords?: string[]
  error?: string
  favorites: string[]
  recent: string[]
}

export type ViewActions = {
  setSearchEntry: (entry: string) => void
  submitSearchEntry: () => void
  setFavorite: (word: string, isFavorite: boolean) => void
  removeRecentWord: (word: string) => void
  selectWord: (word: string) => void
}

export default function useViewModel(): [ViewState, ViewActions] {
  const nav = useNav()
  const [searchEntry, setEntry] = useState("")
  const [altWords, setAltWords] = useState<string[]>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [
    { favorites: favoriteDefs, recent },
    { searchWordDefinition, setFavorite, removeRecentWord },
  ] = useContext(DefinitionsContext)
  const favorites = useMemo(
    () => favoriteDefs.map((f) => f.word),
    [favoriteDefs]
  )

  const setSearchEntry = useCallback(
    (word: string) => {
      setEntry(word)
    },
    [setEntry]
  )

  const searchForWord = useCallback(
    async (word: string) => {
      setError(undefined)
      if (loading) return
      if (!word) {
        setError("Please Enter a word to search for.")
        return
      }
      setLoading(true)

      const result = await searchWordDefinition(word)
      switch (result.result) {
        case "alternatives":
          if (result.altWords.length > 0) {
            setError("Word not found. Maybe try one of these alternatives?")
            setAltWords(result.altWords)
          } else {
            setError("Word not found.")
          }
          break
        case "definition":
          nav.push({ route: "definition", word })
          break
        case "error":
          setError(result.message)
          break
      }
      setLoading(false)
    },
    [loading, nav, searchWordDefinition]
  )

  const submitSearchEntry = useCallback(
    () => searchForWord(searchEntry),
    [searchEntry, searchForWord]
  )

  const selectWord = useCallback(
    (word: string) => searchForWord(word),
    [searchForWord]
  )

  return [
    {
      searchEntry,
      altWords,
      loading,
      error,
      favorites,
      recent: recent.slice(0, 10),
    },
    {
      setSearchEntry,
      submitSearchEntry,
      setFavorite,
      removeRecentWord,
      selectWord,
    },
  ]
}
