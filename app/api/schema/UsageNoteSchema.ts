import { Type, type Static } from "@sinclair/typebox"

export const UsageNoteSchema = Type.Tuple([
  Type.Literal("text"),
  Type.String({ description: "The usage note" }),
])
