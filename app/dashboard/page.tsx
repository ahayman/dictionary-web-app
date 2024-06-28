"use client"
import { PulseLoader } from "react-spinners"
import s from "./page.module.scss"
import useViewModel from "./useViewModel"
import { FormEvent, useContext } from "react"
import { ThemeContext } from "../providers/theme/Provider"
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid"
import { DefinitionsContext } from "../providers/definitions/Provider"
import WordListView from "./components/WordListView"

export default function DashboardDefault() {
  const [{ theme }] = useContext(ThemeContext)
  useContext(DefinitionsContext)
  const [
    { searchEntry, loading, error, favorites, recent, altWords },
    {
      setSearchEntry,
      submitSearchEntry,
      selectWord,
      removeRecentWord,
      setFavorite,
    },
  ] = useViewModel()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitSearchEntry()
  }

  return (
    <div className={s.main}>
      <div className={s.entryContainer}>
        <div className={s.inputRow}>
          <MagnifyingGlassIcon className={s.searchIcon} />
          <h3 className={s.title}>Search</h3>
        </div>
        <form onSubmit={onSubmit}>
          <input
            className={s.entryInput}
            type="text"
            value={searchEntry}
            onChange={(e) => setSearchEntry(e.target.value)}
          ></input>
          <input
            className={s.submit}
            type="submit"
            value="Search"
            disabled={loading || !searchEntry}
          />
          {loading && (
            <PulseLoader color={theme === "dark" ? "white" : "black"} />
          )}
          {!!error && <div className={s.error}>{error}</div>}
        </form>
      </div>
      {altWords && (
        <WordListView
          hWrap
          title="Alternatives"
          words={altWords}
          onSelect={selectWord}
        />
      )}
      <div className={s.infoContainer}>
        {recent.length > 0 && (
          <div className={s.infoItem}>
            <WordListView
              title="Recent"
              words={recent}
              onSelect={selectWord}
              iconDef={{
                location: "end",
                icon: XCircleIcon,
                onClick: removeRecentWord,
              }}
            />
          </div>
        )}
        {favorites.length > 0 && (
          <div className={s.infoItem}>
            <WordListView
              title="Favorites"
              words={favorites}
              onSelect={selectWord}
              iconDef={{
                location: "end",
                icon: SolidStarIcon,
                onClick: (word) => setFavorite(word, false),
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
