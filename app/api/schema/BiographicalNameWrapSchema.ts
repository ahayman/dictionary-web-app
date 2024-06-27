import { Type, type Static } from "@sinclair/typebox"

export const BiographicalNameWrapSchema = Type.Object({
  pname: Type.Optional(Type.String({ description: "Personal Name" })),
  sname: Type.Optional(Type.String({ description: "Surname" })),
  altname: Type.Optional(Type.String({ description: "Alternative Name" })),
})

export type BiographicalNameWrap = Static<typeof BiographicalNameWrapSchema>
