import "@/app/utils/ArrayExtensions"
import {
  State,
  WordDefMeta,
  WordDefinition,
  WordDefinitionCache,
} from "./types"

export type Action =
  | {
      type: "set-current-word"
      word?: string
    }
  | {
      type: "favorite-word"
      word: string
    }
  | {
      type: "unfavorite-word"
      word: string
    }
  | {
      type: "add-recent-word"
      word: string
    }
  | {
      type: "update-cache"
      definition: WordDefinition
    }
  | {
      type: "remove-recent-word"
      word: string
    }

export const Reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "add-recent-word": {
      const recent = state.recent
        .removingWhere((r) => r === action.word)
        .slice(0, 29)
      return { ...state, recent: [action.word, ...recent] }
    }
    case "remove-recent-word": {
      const recent = [...state.recent]
      recent.removeWhere((r) => r === action.word)
      return { ...state, recent }
    }
    case "favorite-word": {
      let wordMeta =
        state.metaCache[action.word] ??
        state.favorites.find((r) => r.word === action.word) ??
        extractWordMeta(action.word, state.cache)
      if (wordMeta === undefined) return state //Nothing to favorite
      const favorites = [...state.favorites, wordMeta].sortOn(
        "asc",
        (w) => w.word
      )
      const metaCache = { ...state.metaCache, [action.word]: wordMeta }
      return { ...state, favorites, metaCache }
    }
    case "unfavorite-word": {
      let favorites = [...state.favorites]
      let wordMeta = favorites.removeWhere((r) => r.word === action.word)
      if (wordMeta === undefined) return state //Nothing to unfavorite
      return { ...state, favorites }
    }
    case "update-cache": {
      const cache = { ...state.cache }
      cache[action.definition.word] = action.definition
      return { ...state, cache }
    }
    case "set-current-word": {
      return { ...state, currentWord: action.word }
    }
  }
}

const extractWordMeta = (
  word: string,
  cache: WordDefinitionCache
): WordDefMeta | undefined => {
  const wordDef = cache[word]
  if (wordDef === undefined) return undefined
  const shortDefs: string[] = []
  const sampleDefs = wordDef.definitions.length >= 3 //Sample the defs if there's many of them
  for (const def of wordDef.definitions) {
    if (sampleDefs && def.shortdef.length > 0) {
      shortDefs.push(def.shortdef[0])
    } else {
      shortDefs.push(...def.shortdef)
    }
  }
  return { word, shortDefs }
}
