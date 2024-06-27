import { Object, Optional, String, Type, type Static } from "@sinclair/typebox"
import { DefinitionTextSchema } from "./DefinitionTextSchema"

export const SenseSchema = Type.Object(
  {
    sn: Optional(
      Type.String({
        description:
          "Sense Number: Defines the order of the sense withing the definition. Starts at 1, but may contain sub number, ex: 1 a, 2 b, etc.",
      })
    ),
    dt: DefinitionTextSchema,
    sdsense: Optional(
      Object({
        sd: String(),
        dt: DefinitionTextSchema,
      })
    ),
  },
  {
    description:
      "Each Sense defines the sense/sequence number along with the definition text.",
  }
)

export type Sense = Static<typeof SenseSchema>
