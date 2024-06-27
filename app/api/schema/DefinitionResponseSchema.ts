import { Optional, Type, type Static } from "@sinclair/typebox"
import { MetaSchema } from "./MetaSchema"
import { HeadWordInfoSchema } from "./HeadWordInfoSchema"
import { DefinitionEntrySchema } from "./DefinitionEntrySchema"

export const DefinitionResponseSchema = Type.Object({
  meta: MetaSchema,
  hwi: HeadWordInfoSchema,
  fl: Optional(
    Type.String({
      description: "Functional Language type. Ex: noun, adjective. ",
    })
  ),
  def: Optional(Type.Array(DefinitionEntrySchema)),
  date: Optional(Type.String()),
  shortdef: Type.Array(Type.String()),
})

export type DefinitionResponse = Static<typeof DefinitionResponseSchema>
