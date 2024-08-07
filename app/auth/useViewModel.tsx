"use client"

import { useCallback, useContext, useState } from "react"
import { AuthContext } from "../providers/auth/Provider"
import useNav from "../ui/navigation/useNav"

/**
 * State used by the auth page.
 * - `currentAPIKey`: the currently set api key.
 *   This is only displayed if the auth page is navigated to directly.
 * - `apiKeyEntry`: string value entered into the view's input.
 * - `loading`: True when checking an api key.
 * - `error`: Displayed when submitting an api key incurs an error.
 */
export type ViewState = {
  currentApiKey?: string
  apiKeyEntry: string
  loading: boolean
  error?: string
}

export type ViewActions = {
  /**
   * Update the backing state for the api entry
   */
  setApiKeyEntry: (entry: string) => void
  /**
   * Submit the currently entered api input.
   */
  submitApiKeyEntry: () => Promise<void>
}

export default function useViewModel(): [ViewState, ViewActions] {
  const nav = useNav()
  const [apiKeyEntry, setApiEntry] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [{ apiKey: currentApiKey }, { setAPIKey }] = useContext(AuthContext)

  const setApiKeyEntry = useCallback(setApiEntry, [setApiEntry])
  const submitApiKeyEntry = useCallback(async () => {
    if (loading) return
    if (!apiKeyEntry) {
      setError("Please enter an API key")
      return
    }
    setError(undefined)
    setLoading(true)
    const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/login?key=${apiKeyEntry}`
    try {
      const result = await fetch(url)
      const text = await result.text()
      if (text.toLowerCase().includes("invalid api key")) {
        setError("Invalid API Key")
      } else {
        JSON.parse(text) //make sure this is valid json
        setAPIKey(apiKeyEntry)
        nav.replace({ route: "search" })
      }
    } catch (error: any) {
      setError(`API Error: ${error.message ?? error.toString()}`)
    }
    setLoading(false)
  }, [apiKeyEntry, loading, nav, setAPIKey])

  return [
    { currentApiKey, apiKeyEntry, loading, error },
    { setApiKeyEntry, submitApiKeyEntry },
  ]
}
