import { Array, Optional, Tuple, Type, type Static } from "@sinclair/typebox"
import { DefinitionTextSchema } from "./DefinitionTextSchema"

export const TruncatedSenseSchema = Type.Object(
  {
    sn: Optional(
      Type.String({
        description:
          "Sense Number: Defines the order of the sense withing the definition. Starts at 1, but may contain sub number, ex: 1 a, 2 b, etc.",
      })
    ),
    dt: Optional(DefinitionTextSchema),
    et: Optional(DefinitionTextSchema),
  },
  {
    description:
      "Each Truncated Sense defines the sense/sequence number along with the definition text.",
  }
)

export const TruncatedSenseSeqSchema = Tuple([
  Type.Literal("sen"),
  TruncatedSenseSchema,
])

export type TruncatedSense = Static<typeof TruncatedSenseSchema>
