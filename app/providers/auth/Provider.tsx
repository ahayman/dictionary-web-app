import { ReactNode, createContext, useContext, useState } from "react"
import { Context, State } from "./types"
import useNav from "../../ui/navigation/useNav"
import { StorageContext } from "../storage/Provider"

export const AuthContext = createContext<Context>([] as any)

export type Props = {
  children: ReactNode
}

/**
 * The auth Provides manages the credentials of the app which,
 * at this point, only includes the api key.
 */
export default function Provider({ children }: Props) {
  const [{ get, set, clear }] = useContext(StorageContext)
  const nav = useNav()
  const [state, setState] = useState<State>(() => ({
    apiKey: get("api-key"),
  }))

  const setApiKey = (apiKey?: string) => {
    if (apiKey) {
      set("api-key", apiKey)
    } else {
      clear("api-key")
    }
    setState((s) => ({ ...s, apiKey }))
    if (apiKey === undefined) {
      nav.replace({ route: "auth" })
    }
  }

  return (
    <AuthContext.Provider
      value={[
        state,
        {
          setAPIKey: (key) => setApiKey(key),
          clearApiKey: () => setApiKey(),
        },
      ]}
    >
      {children}
    </AuthContext.Provider>
  )
}
