import { ReactNode, createContext, useState } from "react"
import { Context, State } from "./types"
import { Storage } from "@/app/utils/Storage"
import useNav from "../../ui/navigation/useNav"

export const AuthContext = createContext<Context>([] as any)

export type Props = {
  children: ReactNode
}

export default function Provider({ children }: Props) {
  const nav = useNav()
  const [state, setState] = useState<State>(() =>
    typeof window === "undefined"
      ? {}
      : {
          apiKey: Storage.get("api-key"),
        }
  )

  const setApiKey = (apiKey?: string) => {
    Storage.set("api-key", apiKey)
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
