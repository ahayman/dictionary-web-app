import { Icon } from "@/app/ui/common/types"
import s from "./WordMetaDefList.module.scss"
import {} from "@/app/utils/ArrayExtensions"
import { WordDefMeta } from "@/app/providers/definitions/types"
import { ReactNode } from "react"

export type Props<T extends WordDefMeta> = {
  defs: T[]
  onSelect: (word: T) => void
  iconDef?: (def: T) => {
    location: "start" | "end"
    icon: () => ReactNode
  }
}

export default function WordMetaDefListView<T extends WordDefMeta>({
  defs,
  onSelect,
  iconDef,
}: Props<T>) {
  return (
    <div className={s.main}>
      {defs.map((def) => {
        const { word, shortDefs } = def
        const iDef = iconDef?.(def)
        return (
          <div key={word} className={s.wordRow}>
            {iDef && iDef.location === "start" && <iDef.icon />}
            <div onClick={() => onSelect(def)} className={s.wordContainer}>
              <b className={s.wordText}>{word}</b>
              <div className={s.hr} />
              {shortDefs.map((def) => (
                <p key={def} className={s.defText}>
                  • {def}
                </p>
              ))}
            </div>
            {iDef && iDef.location === "end" && <iDef.icon />}
          </div>
        )
      })}
    </div>
  )
}
