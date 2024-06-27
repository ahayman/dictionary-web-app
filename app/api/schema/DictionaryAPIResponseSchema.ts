import { Type, type Static } from "@sinclair/typebox"
import { DefinitionResponseSchema } from "./DefinitionResponseSchema"

export const DictionaryAPISuccessResponseSchema = Type.Array(
  DefinitionResponseSchema
)

export const DictionaryAPIFailureResponseSchema = Type.Array(
  Type.String({
    description: "Alternative words provided if searched term does not match",
  })
)

export type DictionaryAPISuccessResponse = Static<
  typeof DictionaryAPISuccessResponseSchema
>
export type DictionaryAPIFailureResponse = Static<
  typeof DictionaryAPIFailureResponseSchema
>
