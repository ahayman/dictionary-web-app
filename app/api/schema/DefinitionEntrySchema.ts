import { Optional, String, Type, type Static } from "@sinclair/typebox"
import { SenseSequenceSchema } from "./SenseSequenceSchema"
import { ParentheticalSenseSequenceSchema } from "./ParentheticalSequence"
import { BindingSubtituteSchema } from "./BindingSubstitute"
import { TruncatedSenseSeqSchema } from "./TruncatedSenseSchema"

export const SSEQItemSchema = Type.Union([
  SenseSequenceSchema,
  TruncatedSenseSeqSchema,
  ParentheticalSenseSequenceSchema,
  BindingSubtituteSchema,
])

export const DefinitionEntrySchema = Type.Object({
  sseq: Type.Array(Type.Array(SSEQItemSchema)),
  vd: Optional(String()),
})

export type DefinitionEntry = Static<typeof DefinitionEntrySchema>
export type SSEQItem = Static<typeof SSEQItemSchema>
