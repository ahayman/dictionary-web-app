"use client"

import s from "./page.module.scss"
import { useParams } from "next/navigation"
import useViewModel, { DefinitionResponse } from "./useViewModel"
import WordListView from "../../components/WordListView"
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline"
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid"
import WordDefinitionView from "./components/WordDefinitionView"
import { cat } from "@/app/utils/cat"

//There should only be one word. This is the way
const wordFromParams = (word: string | string[]) =>
  word instanceof Array ? word.join("_") : word

export default function DefinitionsPage() {
  const { word } = useParams()
  const [
    { error, definition, isFavorite },
    { selectAlternative, toggleFavorite },
  ] = useViewModel(wordFromParams(word))

  const definitionView = (def?: DefinitionResponse) => {
    if (!def) return null
    switch (def.type) {
      case "alternatives":
        return (
          <>
            <p className={s.altP}>
              Could not find a definition for {def.word}. Consider one of the
              following alternatives.
            </p>
            <WordListView
              hWrap
              title="Alternatives"
              words={def.altWords}
              onSelect={selectAlternative}
            />
          </>
        )
      case "definition":
        return <WordDefinitionView definition={def.definition} />
    }
  }

  const FavoriteIcon = isFavorite ? SolidStarIcon : OutlineStarIcon

  return (
    <>
      <div className={s.titleBar}>
        <h2 className={s.title}>{word}</h2>
        <FavoriteIcon
          onClick={toggleFavorite}
          className={cat(
            s.icon,
            isFavorite ? s.favoriteIcon : s.unFavoriteIcon
          )}
        />
      </div>
      <div className={s.main}>
        {definitionView(definition)}
        {!!error && <p className={s.error}>{error}</p>}
      </div>
    </>
  )
}
