import { Sense } from "@/app/api/schema/SenseSchema"
import DefinitionTextView from "./DefinitionTextView"
import s from "./components.module.scss"

export type Props = {
  parentKey: string
  sense: Sense
}

export default function SenseView({ sense: { sn, dt }, parentKey }: Props) {
  return (
    <div className={s.senseRow}>
      {!!sn && <p className={s.sn}>{sn}</p>}
      <div className={s.senseColumn}>
        {dt.map((dt, idx) => (
          <DefinitionTextView
            parentKey={`${parentKey}-${idx}`}
            key={`${parentKey}-${idx}`}
            dt={dt}
          />
        ))}
      </div>
    </div>
  )
}
