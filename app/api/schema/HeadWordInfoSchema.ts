import { Type, type Static } from "@sinclair/typebox"
import { PronunciationSchema } from "./PronunciationSchema"

export const HeadWordInfoSchema = Type.Object({
  hw: Type.String({
    description:
      "The headword: the word being defined or translated in a dictionary entry.",
  }),
  prs: Type.Optional(
    Type.Array(PronunciationSchema, {
      description: "Provides possible pronunciations.",
    })
  ),
})

export type HeadWordInfo = Static<typeof HeadWordInfoSchema>
