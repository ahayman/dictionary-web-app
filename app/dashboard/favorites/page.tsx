"use client"
import WordMetaDefListView from "../components/WordMetaDefList"
import useViewModel from "./useViewModel"
import s from "./page.module.scss"
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline"
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid"
import { cat } from "@/app/utils/cat"

export default function FavoritesPage() {
  const [{ favorites }, { toggleFavoriteWord, selectWord }] = useViewModel()
  return (
    <>
      <div className={s.titleBar}>
        <h2 className={s.title}>Favorites</h2>
      </div>
      <div className={s.main}>
        <WordMetaDefListView
          defs={favorites}
          onSelect={(def) => selectWord(def.word)}
          iconDef={(def) => ({
            location: "start",
            icon: () =>
              def.isFavorite ? (
                <SolidStarIcon
                  onClick={() => toggleFavoriteWord(def.word)}
                  className={cat(s.icon, s.favoriteIcon)}
                />
              ) : (
                <OutlineStarIcon
                  onClick={() => toggleFavoriteWord(def.word)}
                  className={cat(s.icon, s.unFavoriteIcon)}
                />
              ),
          })}
        />
      </div>
    </>
  )
}
