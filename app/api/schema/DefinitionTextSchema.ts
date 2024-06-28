import { Literal, Type, type Static } from "@sinclair/typebox"
import { VerbalIllustrationSchema } from "./VerbalIllustrationSchema"
import { BiographicalNameWrapSchema } from "./BiographicalNameWrapSchema"
import { RunInEntrySchema } from "./RunInEntrySchema"
import { SupplimentalNoteSchema } from "./SupplimentalNoteSchema"
import { UsageNoteSchema } from "./UsageNoteSchema"
import { CalledAlsoSchema } from "./CalledAlsoSchema"

export const DefinitionTextItemSchema = Type.Tuple(
  [Type.Literal("text"), Type.String({ description: "Definition Text" })],
  {
    description:
      "Primary Definition Text. Should always be present within a definition text.",
  }
)
export type DefinitionTextItem = Static<typeof DefinitionTextItemSchema>

export const DefinitionTextVisSchema = Type.Tuple(
  [Type.Literal("vis"), Type.Array(VerbalIllustrationSchema)],
  {
    description:
      "Visual Illustration. Generally, text that provides an example of the definition within some context.",
  }
)
export type DefinitionTextVis = Static<typeof DefinitionTextVisSchema>

export const DefinitionTextBNWSchema = Type.Tuple(
  [Type.Literal("bnw"), BiographicalNameWrapSchema],
  {
    description: "Biographical information for an entry.",
  }
)
export type DefinitionTextBNW = Static<typeof DefinitionTextBNWSchema>

export const DefinitionTextRunInSchema = Type.Tuple(
  [
    Type.Literal("ri"),
    Type.Array(Type.Union([DefinitionTextItemSchema, RunInEntrySchema])),
  ],
  {
    description: "Adjacent information to the entry.",
  }
)
export type DefinitionTextRunIn = Static<typeof DefinitionTextRunInSchema>

export const DefinitionTextSnoteSchema = Type.Tuple(
  [
    Type.Literal("snote"),
    Type.Array(
      Type.Union([
        SupplimentalNoteSchema,
        DefinitionTextVisSchema,
        DefinitionTextRunInSchema,
      ])
    ),
  ],
  {
    description: "A supplimental note.",
  }
)
export type DefinitionTextSnote = Static<typeof DefinitionTextSnoteSchema>

export const DefinitionTextCASchema = Type.Tuple([
  Literal("ca"),
  CalledAlsoSchema,
])
export type DefinitionTextCA = Static<typeof DefinitionTextCASchema>

export const DefinitionTextUsageNoteSchema = Type.Tuple(
  [
    Type.Literal("uns"),
    Type.Array(
      Type.Array(
        Type.Union([
          UsageNoteSchema,
          DefinitionTextRunInSchema,
          DefinitionTextVisSchema,
        ])
      )
    ),
  ],
  {
    description: "Usage information for the entry.",
  }
)
export type DefinitionTextUsageNote = Static<
  typeof DefinitionTextUsageNoteSchema
>

export const DefinitionTextSchema = Type.Array(
  Type.Union([
    DefinitionTextItemSchema,
    DefinitionTextVisSchema,
    DefinitionTextBNWSchema,
    DefinitionTextRunInSchema,
    DefinitionTextSnoteSchema,
    DefinitionTextUsageNoteSchema,
    DefinitionTextCASchema,
  ])
)

export type DefinitionText = Static<typeof DefinitionTextSchema>
