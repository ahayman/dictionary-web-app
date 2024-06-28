import { Type, type Static } from "@sinclair/typebox"
import { SenseSequenceSchema } from "./SenseSequenceSchema"
import { BindingSubtituteSchema } from "./BindingSubstitute"

export const ParentheticalSenseSequenceSchema = Type.Tuple([
  Type.Literal("pseq"),
  Type.Array(Type.Union([SenseSequenceSchema, BindingSubtituteSchema])),
])
