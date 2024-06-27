import { Type, type Static } from "@sinclair/typebox"

export const MetaSchema = Type.Object({
  id: Type.String({ description: "usually the dictionary term" }),
  uuid: Type.String({
    description: "fully unique id for this entry",
  }),
  sort: Type.String({
    description:
      "can be used to sort entries according to their order in the dictionary.",
  }),
  stems: Type.Array(
    Type.String({
      description: "headwords, variants, inflections, and possible run-ons. ",
    })
  ),
  offensive: Type.Boolean({
    description: "whether this term can be considered offensive.",
  }),
})

export type Meta = Static<typeof MetaSchema>
