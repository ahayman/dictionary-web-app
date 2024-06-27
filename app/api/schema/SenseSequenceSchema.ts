import { Type, type Static } from "@sinclair/typebox"
import { SenseSchema } from "./SenseSchema"

export const SenseSequenceSchema = Type.Tuple([
  Type.Literal("sense"),
  SenseSchema,
])
