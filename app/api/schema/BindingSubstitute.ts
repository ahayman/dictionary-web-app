import { Literal, Object, Type, type Static } from "@sinclair/typebox"
import { SenseSchema } from "./SenseSchema"

export const BindingSubtituteSchema = Type.Tuple([
  Literal("bs"),
  Object({
    sense: SenseSchema,
  }),
])
