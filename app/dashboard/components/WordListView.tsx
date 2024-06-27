import { Icon } from "@/app/ui/common/types"
import s from "./WordListView.module.scss"
import {} from "@/app/utils/ArrayExtensions"
import { cat } from "@/app/utils/cat"

export type Props = {
  title?: string
  words: string[]
  onSelect: (word: string) => void
  iconDef?: {
    location: "start" | "end"
    icon: Icon
    onClick?: (word: string) => void
  }
}

export default function WordListView({
  words,
  onSelect,
  title,
  iconDef,
}: Props) {
  return (
    <div className={s.main}>
      {!!title && (
        <>
          <h3 className={s.title}>{title}</h3>
          <div className={s.titleHr} />
        </>
      )}
      {words
        .map((w) => (
          <div key={w} className={s.wordRow}>
            {iconDef && iconDef.location === "start" && (
              <iconDef.icon
                onClick={() => iconDef.onClick?.(w)}
                className={cat(s.icon, s.iconStart)}
              />
            )}
            <div onClick={() => onSelect(w)} className={s.wordContainer}>
              <b className={s.wordText}>{w}</b>
            </div>
            {iconDef && iconDef.location === "end" && (
              <iconDef.icon
                onClick={() => iconDef.onClick?.(w)}
                className={cat(s.icon, s.iconEnd)}
              />
            )}
          </div>
        ))
        .joinWith(() => (
          <div className={s.hr} />
        ))}
    </div>
  )
}
