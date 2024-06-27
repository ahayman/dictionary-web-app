import { Type, type Static } from "@sinclair/typebox"

export const RunInEntrySchema = Type.Tuple([
  Type.Literal("riw"),
  Type.Object({
    rie: Type.String({
      description:
        "Run In Entry Item, often alternative naming for a definition entry.",
    }),
  }),
])

export type RunInEntry = Static<typeof RunInEntrySchema>
