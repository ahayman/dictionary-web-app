import { Type, type Static } from "@sinclair/typebox"

export const PronunciationSchema = Type.Object({
  mw: Type.Optional(
    Type.String({
      description: "written pronunciation in Merriam-Webster format",
    })
  ),
})

export type Pronunciation = Static<typeof PronunciationSchema>
