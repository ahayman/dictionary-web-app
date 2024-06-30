import { DefinitionsContext } from "@/app/providers/definitions/Provider"
import { WordDefMeta } from "@/app/providers/definitions/types"
import { useCallback, useContext, useState } from "react"
import {} from "@/app/utils/ArrayExtensions"
import useNav from "@/app/ui/navigation/useNav"

/**
 * The word, along with short defs, combined with whether it is favorited.
 */
export type FavoriteWordDef = WordDefMeta & { isFavorite: boolean }

export type ViewState = {
  /**
   * The view state only needs a list of favorite words.
   * Note: unfavoriting words does not remove them from the list.
   *   Instead, those words are retained until the user leaves the page.
   */
  favorites: FavoriteWordDef[]
}

export type ViewActions = {
  /**
   * Toggles the favorite status of a word.
   */
  toggleFavoriteWord: (word: string) => void
  /**
   * Upon selection, this will navigate to the word's definition.
   */
  selectWord: (word: string) => void
}

export default function useViewModel(): [ViewState, ViewActions] {
  const nav = useNav()
  const [{ favorites: favoriteDefs }, { setFavorite }] =
    useContext(DefinitionsContext)
  const [favorites, setFavorites] = useState<FavoriteWordDef[]>(
    favoriteDefs.map((f) => ({
      ...f,
      isFavorite: true,
      shortDefs: f.shortDefs.slice(0, 3),
    }))
  )

  const selectWord = useCallback(
    (word: string) => nav.push({ route: "definition", word }),
    [nav]
  )

  const toggleFavoriteWord = useCallback(
    (word: string) => {
      const favs = [...favorites]
      const idx = favs.findIndex((f) => f.word === word)
      if (idx === -1) return
      const def = favs[idx]
      const isFavorite = !def.isFavorite
      favs[idx] = { ...def, isFavorite }
      setFavorite(word, isFavorite)
      setFavorites(favs)
    },
    [favorites, setFavorite]
  )

  return [{ favorites }, { toggleFavoriteWord, selectWord }]
}
