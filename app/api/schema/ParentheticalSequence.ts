import { Type, type Static } from "@sinclair/typebox"
import { SenseSequenceSchema } from "./SenseSequenceSchema"

export const ParentheticalSenseSequenceSchema = Type.Tuple([
  Type.Literal("pseq"),
  Type.Array(SenseSequenceSchema),
])
