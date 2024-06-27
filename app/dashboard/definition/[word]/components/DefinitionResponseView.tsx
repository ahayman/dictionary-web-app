import { DefinitionResponse } from "@/app/api/schema/DefinitionResponseSchema"
import s from "./DefinitionResponseView.module.scss"

export type Props = {
  def: DefinitionResponse
}

export default function DefinitionResponseView({ def }: Props) {
  return (
    <div className={s.main}>
      <div className={s.row}>
        <strong className={s.flTitle}>Function: </strong>
        <em className={s.fl}>{def.fl}</em>
      </div>
      <div>
        {def.shortdef.map((sdef) => (
          <p className={s.shortDef} key={sdef}>
            {sdef}
          </p>
        ))}
      </div>
    </div>
  )
}
