import { Type, type Static } from "@sinclair/typebox"

export const VerbalIllustrationSchema = Type.Object({
  t: Type.String({ description: "The verbal illustration text" }),
  aq: Type.Optional(
    Type.Object({
      auth: Type.Optional(Type.String({ description: "Author name" })),
      source: Type.Optional(
        Type.String({ description: "Source name, ex: a newspaper." })
      ),
    })
  ),
})

export type VerbalIllustration = Static<typeof VerbalIllustrationSchema>
