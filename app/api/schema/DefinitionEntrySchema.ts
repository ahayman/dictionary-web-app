import { Type, type Static } from "@sinclair/typebox"
import { SenseSequenceSchema } from "./SenseSequenceSchema"
import { ParentheticalSenseSequenceSchema } from "./ParentheticalSequence"
import { BindingSubtituteSchema } from "./BindingSubstitute"

export const DefinitionEntrySchema = Type.Object({
  sseq: Type.Array(
    Type.Array(
      Type.Union([
        SenseSequenceSchema,
        ParentheticalSenseSequenceSchema,
        BindingSubtituteSchema,
      ])
    )
  ),
})

export type DefinitionEntry = Static<typeof DefinitionEntrySchema>
