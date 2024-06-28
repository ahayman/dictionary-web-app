import { SSEQItem } from "@/app/api/schema/DefinitionEntrySchema"
import SenseView from "./SenseView"

export type Props = {
  parentKey: string
  sseq: SSEQItem
}

export default function SseqItemView({ sseq, parentKey }: Props) {
  switch (sseq[0]) {
    case "sense":
      return <SenseView parentKey={parentKey} sense={sseq[1]} />
    case "bs":
      return null
    case "pseq":
      return (
        <div>
          {sseq[1].map((s, idx) => (
            <SseqItemView
              key={[parentKey, idx].join("-")}
              parentKey={[parentKey, idx].join("-")}
              sseq={s}
            />
          ))}
        </div>
      )
    //No need to handle truncated definitions
    case "sen":
      return null
  }
}
