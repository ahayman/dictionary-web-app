import {
  DictionaryAPIFailureResponse,
  DictionaryAPISuccessResponse,
} from "./schema/DictionaryAPIResponseSchema"

/**
 * The API Response returned for a word definition can be one of the following:
 * - success: Returns all the definitions for the word in question
 * - failure: The word is not recognized. A list of possible replacements are returned.
 * - error: An error occurred. This could be an HTTP error or some internal error. The error message is returned.
 */
export type APIResponse =
  | {
      status: "success"
      data: DictionaryAPISuccessResponse
    }
  | {
      status: "failure"
      data: DictionaryAPIFailureResponse
    }
  | {
      status: "error"
      message: string
    }

/**
 * Primary interface for interacting with the api
 */
export type ApiClient = {
  /**
   * Retrieve a definition for a given word.
   */
  getWordDefinition: (word: string) => Promise<APIResponse>
}
