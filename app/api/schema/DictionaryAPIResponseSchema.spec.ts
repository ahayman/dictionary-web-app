import blueJson from "@test/api/data/blue.json"
import volJson from "@test/api/data/voluminous.json"
import angryJson from "@test/api/data/angry.json"
import georgeJson from "@test/api/data/george_washington.json"
import happyJson from "@test/api/data/happy.json"
import helloJson from "@test/api/data/hello.json"
import isJson from "@test/api/data/is.json"
import fluffleJson from "@test/api/data/fluffle.json"
import greenJson from "@test/api/data/green.json"

import {
  DictionaryAPISuccessResponseSchema,
  DictionaryAPIFailureResponseSchema,
} from "./DictionaryAPIResponseSchema"
import { Value } from "@sinclair/typebox/value"

describe("Blue JSON Schema validation", () => {
  const json = blueJson
  it("should decode the json success response", async () => {
    const response = Value.Decode(DictionaryAPISuccessResponseSchema, json)
    expect(response instanceof Array).toBe(true)
  })
  it("should not decode as failure response", async () => {
    expect(Value.Check(DictionaryAPIFailureResponseSchema, json)).toBe(false)
  })
  it("should check the json response", async () => {
    expect(Value.Check(DictionaryAPISuccessResponseSchema, json)).toBe(true)
  })
  it("should not throw errors", async () => {
    const errors = [...Value.Errors(DictionaryAPISuccessResponseSchema, json)]
    expect(errors.length).toBe(0)
  })
})

describe("Voluminous JSON Schema validation", () => {
  const json = volJson
  it("should decode the json response", async () => {
    const response = Value.Decode(DictionaryAPISuccessResponseSchema, json)
    expect(response instanceof Array).toBe(true)
  })
  it("should not decode as failure response", async () => {
    expect(Value.Check(DictionaryAPIFailureResponseSchema, json)).toBe(false)
  })
  it("should check the json response", async () => {
    expect(Value.Check(DictionaryAPISuccessResponseSchema, json)).toBe(true)
  })
  it("should not throw errors", async () => {
    const errors = [...Value.Errors(DictionaryAPISuccessResponseSchema, json)]
    expect(errors.length).toBe(0)
  })
})

describe("Angry JSON Schema validation", () => {
  const json = angryJson
  it("should decode the json response", async () => {
    const response = Value.Decode(DictionaryAPISuccessResponseSchema, json)
    expect(response instanceof Array).toBe(true)
  })
  it("should not decode as failure response", async () => {
    expect(Value.Check(DictionaryAPIFailureResponseSchema, json)).toBe(false)
  })
  it("should check the json response", async () => {
    expect(Value.Check(DictionaryAPISuccessResponseSchema, json)).toBe(true)
  })
  it("should not throw errors", async () => {
    const errors = [...Value.Errors(DictionaryAPISuccessResponseSchema, json)]
    expect(errors.length).toBe(0)
  })
})

describe("Happy JSON Schema validation", () => {
  const json = happyJson
  it("should decode the json response", async () => {
    const response = Value.Decode(DictionaryAPISuccessResponseSchema, json)
    expect(response instanceof Array).toBe(true)
  })
  it("should not decode as failure response", async () => {
    expect(Value.Check(DictionaryAPIFailureResponseSchema, json)).toBe(false)
  })
  it("should check the json response", async () => {
    expect(Value.Check(DictionaryAPISuccessResponseSchema, json)).toBe(true)
  })
  it("should not throw errors", async () => {
    const errors = [...Value.Errors(DictionaryAPISuccessResponseSchema, json)]
    expect(errors.length).toBe(0)
  })
})

describe("Hello JSON Schema validation", () => {
  const json = helloJson
  it("should decode the json response", async () => {
    const response = Value.Decode(DictionaryAPISuccessResponseSchema, json)
    expect(response instanceof Array).toBe(true)
  })
  it("should not decode as failure response", async () => {
    expect(Value.Check(DictionaryAPIFailureResponseSchema, json)).toBe(false)
  })
  it("should check the json response", async () => {
    expect(Value.Check(DictionaryAPISuccessResponseSchema, json)).toBe(true)
  })
  it("should not throw errors", async () => {
    const errors = [...Value.Errors(DictionaryAPISuccessResponseSchema, json)]
    expect(errors.length).toBe(0)
  })
})

describe("George Washington JSON Schema validation", () => {
  const json = georgeJson
  it("should decode the json response", async () => {
    const response = Value.Decode(DictionaryAPISuccessResponseSchema, json)
    expect(response instanceof Array).toBe(true)
  })
  it("should not decode as failure response", async () => {
    expect(Value.Check(DictionaryAPIFailureResponseSchema, json)).toBe(false)
  })
  it("should check the json response", async () => {
    expect(Value.Check(DictionaryAPISuccessResponseSchema, json)).toBe(true)
  })
  it("should not throw errors", async () => {
    const errors = [...Value.Errors(DictionaryAPISuccessResponseSchema, json)]
    expect(errors.length).toBe(0)
  })
})

describe("Is JSON Schema validation", () => {
  const json = isJson
  it("should decode the json response", async () => {
    const response = Value.Decode(DictionaryAPISuccessResponseSchema, json)
    expect(response instanceof Array).toBe(true)
  })
  it("should not decode as failure response", async () => {
    expect(Value.Check(DictionaryAPIFailureResponseSchema, json)).toBe(false)
  })
  it("should check the json response", async () => {
    expect(Value.Check(DictionaryAPISuccessResponseSchema, json)).toBe(true)
  })
  it("should not throw errors", async () => {
    const errors = [...Value.Errors(DictionaryAPISuccessResponseSchema, json)]
    expect(errors.length).toBe(0)
  })
})

describe("Green JSON Schema validation", () => {
  const json = greenJson
  it("should decode the json response", async () => {
    const response = Value.Decode(DictionaryAPISuccessResponseSchema, json)
    expect(response instanceof Array).toBe(true)
  })
  it("should not decode as failure response", async () => {
    expect(Value.Check(DictionaryAPIFailureResponseSchema, json)).toBe(false)
  })
  it("should check the json response", async () => {
    expect(Value.Check(DictionaryAPISuccessResponseSchema, json)).toBe(true)
  })
  it("should not throw errors", async () => {
    const errors = [...Value.Errors(DictionaryAPISuccessResponseSchema, json)]
    expect(errors.length).toBe(0)
  })
})

describe("Fluffle JSON Schema validation", () => {
  const json = fluffleJson
  it("should decode the json failure response", async () => {
    const response = Value.Decode(DictionaryAPIFailureResponseSchema, json)
    expect(response instanceof Array).toBe(true)
  })
  it("should not decode as success response", async () => {
    expect(Value.Check(DictionaryAPISuccessResponseSchema, json)).toBe(false)
  })
  it("should not throw errors", async () => {
    const errors = [...Value.Errors(DictionaryAPIFailureResponseSchema, json)]
    expect(errors.length).toBe(0)
  })
})
