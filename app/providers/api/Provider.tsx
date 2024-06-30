import { ReactNode, createContext, useContext } from "react"
import { APIResponse, ApiClient } from "../../api/ApiClient"
import { AuthContext } from "../auth/Provider"
import { Value } from "@sinclair/typebox/value"
import {
  DictionaryAPIFailureResponseSchema,
  DictionaryAPISuccessResponseSchema,
} from "@/app/api/schema/DictionaryAPIResponseSchema"

export const APIContext = createContext<ApiClient>({} as any)

export type Props = {
  children: ReactNode
}

/**
 * Primary API Provider. Contains no state except for the actions
 * of the api client.
 */
export default function Provider({ children }: Props) {
  const [{ apiKey }] = useContext(AuthContext)

  const getWordDefinition = async (word: string): Promise<APIResponse> => {
    if (apiKey === undefined) {
      return { status: "error", message: "Missing API Key" }
    }
    const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`
    try {
      const result = await fetch(url)
      const text = await result.text()
      if (text.toLocaleLowerCase().startsWith("invalid api key")) {
        return {
          status: "error",
          message: "Invalid API Key.",
        }
      }
      const json = JSON.parse(text)
      if (Value.Check(DictionaryAPISuccessResponseSchema, json)) {
        return {
          status: "success",
          data: json,
        }
      } else if (Value.Check(DictionaryAPIFailureResponseSchema, json)) {
        return {
          status: "failure",
          data: json,
        }
      } else {
        return {
          status: "error",
          message: `Unable to parse server response: ${text}`,
        }
      }
    } catch (e: any) {
      return {
        status: "error",
        message: `Error Fetching data: ${
          e.message ?? e.toString?.() ?? "Unknown Error"
        }`,
      }
    }
  }

  return (
    <APIContext.Provider value={{ getWordDefinition }}>
      {children}
    </APIContext.Provider>
  )
}
