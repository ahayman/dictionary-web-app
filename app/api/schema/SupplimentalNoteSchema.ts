import { Type, type Static } from "@sinclair/typebox"

export const SupplimentalNoteSchema = Type.Tuple([
  Type.Literal("t"),
  Type.String({ description: "The supplemental note text" }),
])

export type SuppplimentalNote = Static<typeof SupplimentalNoteSchema>
