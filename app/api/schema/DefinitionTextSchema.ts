import { Type, type Static } from "@sinclair/typebox"
import { VerbalIllustrationSchema } from "./VerbalIllustrationSchema"
import { BiographicalNameWrapSchema } from "./BiographicalNameWrapSchema"
import { RunInEntrySchema } from "./RunInEntrySchema"
import { SupplimentalNoteSchema } from "./SupplimentalNoteSchema"
import { UsageNoteSchema } from "./UsageNoteSchema"

export const DefinitionTextItemSchema = Type.Tuple(
  [Type.Literal("text"), Type.String({ description: "Definition Text" })],
  {
    description:
      "Primary Definition Text. Should always be present within a definition text.",
  }
)

export const DefinitionTextVisSchema = Type.Tuple(
  [Type.Literal("vis"), Type.Array(VerbalIllustrationSchema)],
  {
    description:
      "Visual Illustration. Generally, text that provides an example of the definition within some context.",
  }
)

export const DefinitionTextBNWSchema = Type.Tuple(
  [Type.Literal("bnw"), BiographicalNameWrapSchema],
  {
    description: "Biographical information for an entry.",
  }
)

export const DefinitionTextRunInSchema = Type.Tuple(
  [
    Type.Literal("ri"),
    Type.Array(Type.Union([DefinitionTextItemSchema, RunInEntrySchema])),
  ],
  {
    description: "Adjacent information to the entry.",
  }
)

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

export const DefinitionTextSchema = Type.Array(
  Type.Union([
    DefinitionTextItemSchema,
    DefinitionTextVisSchema,
    DefinitionTextBNWSchema,
    DefinitionTextRunInSchema,
    DefinitionTextSnoteSchema,
    DefinitionTextUsageNoteSchema,
  ])
)

export type DefinitionText = Static<typeof DefinitionTextSchema>
