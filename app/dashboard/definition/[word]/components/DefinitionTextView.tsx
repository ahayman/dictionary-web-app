import s from "./components.module.scss"
import {
  DefinitionTextBNW,
  DefinitionTextItem,
  DefinitionTextRunIn,
  DefinitionTextSnote,
  DefinitionTextUsageNote,
  DefinitionTextVis,
} from "@/app/api/schema/DefinitionTextSchema"
import { RunInEntry } from "@/app/api/schema/RunInEntrySchema"
import { SuppplimentalNote } from "@/app/api/schema/SupplimentalNoteSchema"
import { UsageNote } from "@/app/api/schema/UsageNoteSchema"
import cleanString from "@/app/utils/cleanString"

export type DefinitionText =
  | UsageNote
  | DefinitionTextRunIn
  | DefinitionTextItem
  | DefinitionTextVis
  | DefinitionTextUsageNote
  | DefinitionTextSnote
  | DefinitionTextBNW
  | SuppplimentalNote
  | RunInEntry

export type Props = {
  parentKey: string
  dt: DefinitionText
  isUns?: boolean
}

export default function DefinitionTextView({ dt, parentKey, isUns }: Props) {
  switch (dt[0]) {
    case "t":
    case "text":
      return isUns ? (
        <p className={s.unsText}>({cleanString(dt[1])})</p>
      ) : (
        <p className={s.dtText}>{cleanString(dt[1])}</p>
      )
    case "ri":
    case "snote":
      return (
        <div>
          {dt[1].map((subDt, idx) => (
            <DefinitionTextView
              parentKey={`${parentKey}-${idx}`}
              key={`${parentKey}-${idx}`}
              dt={subDt}
            />
          ))}
        </div>
      )
    case "bnw":
      return (
        <p>
          {cleanString([dt[1].altname, dt[1].pname, dt[1].sname].join(" "))}
        </p>
      )
    case "vis":
      return (
        <div className={s.groupingContainer}>
          {dt[1].map((vis, idx) => (
            <p className={s.vis} key={`${parentKey}-${idx}`}>
              • {cleanString(vis.t)}
            </p>
          ))}
        </div>
      )
    case "riw":
      return <p>{cleanString(dt[1].rie)}</p>
    case "uns":
      return (
        <div>
          {dt[1].map((arr, idx) => (
            <div key={`${parentKey}-${idx}`}>
              {arr.map((uns, idx1) => (
                <DefinitionTextView
                  isUns
                  parentKey={`${parentKey}-${idx}-${idx1}`}
                  key={`${parentKey}-${idx}-${idx1}`}
                  dt={uns}
                />
              ))}
            </div>
          ))}
        </div>
      )
  }
}
