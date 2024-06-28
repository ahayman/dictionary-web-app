import { Object, String, Array, Static } from "@sinclair/typebox"

export const CalledAlsoSchema = Object(
  {
    intro: String(),
    cats: Array(
      Object({
        cat: String(),
      })
    ),
  },
  {
    description:
      "A called-also note lists other names a headword is called in a given sense. The called-also note is contained in a ca.",
  }
)

export type CalledAlso = Static<typeof CalledAlsoSchema>
