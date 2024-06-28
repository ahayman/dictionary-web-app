import { DefinitionResponse } from "@/app/api/schema/DefinitionResponseSchema"
import s from "./components.module.scss"
import SseqItemView from "./SseqItemView"

export type Props = {
  def: DefinitionResponse
}

export default function DefinitionResponseView({ def }: Props) {
  const major = def.def
  if (!major) {
    return null
  }
  return (
    <div className={s.main}>
      <div className={s.row}>
        <h2 className={s.fl}>{def.fl}</h2>
      </div>
      <div>
        {major.map((m, idx) => (
          <div key={`${def.hwi.hw}-${idx}`} className={s.majorContainer}>
            {!!m.vd && <p className={s.majorDescriptor}>{m.vd}</p>}
            {m.sseq.map((sseqArr, idx1) => (
              <div
                key={`${def.hwi.hw}-${idx}-${idx1}`}
                className={s.groupingContainer}
              >
                {sseqArr.map((sseq, idx2) => (
                  <SseqItemView
                    parentKey={`${def.hwi.hw}-${idx}-${idx1}-${idx2}`}
                    key={`${def.hwi.hw}-${idx}-${idx1}-${idx2}`}
                    sseq={sseq}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
