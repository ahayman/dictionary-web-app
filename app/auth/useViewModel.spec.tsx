import MockProvider from "@test/providers/MockProvider"
import { AuthContext } from "../providers/auth/Provider"
import { ReactNode } from "react"
import useViewModel from "./useViewModel"
import { act, render } from "@testing-library/react"
import helloJson from "@test/api/data/hello.json"
import useNav from "../ui/navigation/useNav"

jest.mock("../ui/navigation/useNav")
const mockedNav = jest.mocked(useNav)

describe("auth.useViewModel", () => {
  let apiKey: string | undefined
  let setAPIKey: (key: string) => void = jest.fn()

  const MockAuthProvider = ({ children }: { children: ReactNode }) => (
    <MockProvider
      context={AuthContext}
      state={[{ apiKey }, { setAPIKey, clearApiKey: () => undefined }]}
    >
      {children}
    </MockProvider>
  )

  beforeEach(() => {
    apiKey = undefined
    setAPIKey = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("initial state", () => {
    it("loading should be false", () => {
      let loadingSpy: boolean | undefined
      const Test = () => {
        const [{ loading }] = useViewModel()
        loadingSpy = loading
        return <></>
      }
      render(
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      expect(loadingSpy).toBe(false)
    })

    it("currentApiKey should be returned from auth context", () => {
      const key = "some_api_key"
      apiKey = key
      let apiKeySpy: string | undefined
      const Test = () => {
        const [{ currentApiKey }] = useViewModel()
        apiKeySpy = currentApiKey
        return <></>
      }
      render(
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      expect(apiKeySpy).toBe(key)
    })

    it("apiKeyEntry should be empty string", () => {
      let apiKeySpy: string | undefined
      const Test = () => {
        const [{ apiKeyEntry }] = useViewModel()
        apiKeySpy = apiKeyEntry
        return <></>
      }
      render(
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      expect(apiKeySpy).toBe("")
    })

    it("error should be undefined", () => {
      let errorSpy: string | undefined = "error"
      const Test = () => {
        const [{ error }] = useViewModel()
        errorSpy = error
        return <></>
      }
      render(
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      expect(errorSpy).toBeUndefined()
    })
  })

  describe("entry behavior", () => {
    it("should update apiKeyEntry state when `setApiKeyEntry` is called", () => {
      let apiKeyEntrySpy: string | undefined
      let setApiKeyEntrySpy: (entry: string) => void = () => undefined
      const Test = () => {
        const [{ apiKeyEntry }, { setApiKeyEntry }] = useViewModel()
        apiKeyEntrySpy = apiKeyEntry
        setApiKeyEntrySpy = setApiKeyEntry
        return <></>
      }
      const layout = (
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      const r = render(layout)
      expect(apiKeyEntrySpy).toBe("")
      act(() => setApiKeyEntrySpy("entry"))
      r.rerender(layout)
      expect(apiKeyEntrySpy).toBe("entry")
    })
  })

  describe("submission behavior", () => {
    it("should return error when submission is empty", async () => {
      let errorSpy: string | undefined
      let setApiKeyEntrySpy: (entry: string) => void = () => undefined
      let submitAPIKeyEntrySpy: () => Promise<void> = async () => undefined
      const Test = () => {
        const [{ error }, { setApiKeyEntry, submitApiKeyEntry }] =
          useViewModel()
        errorSpy = error
        setApiKeyEntrySpy = setApiKeyEntry
        submitAPIKeyEntrySpy = submitApiKeyEntry
        return <></>
      }
      const layout = (
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      const r = render(layout)
      expect(errorSpy).toBeUndefined()
      act(() => setApiKeyEntrySpy(""))
      r.rerender(layout)
      await act(submitAPIKeyEntrySpy)
      r.rerender(layout)
      expect(errorSpy).toBe("Please enter an API key")
    })

    it("should attempt to fetch using apiKeyEntry", async () => {
      let setApiKeyEntrySpy: (entry: string) => void = () => undefined
      let submitAPIKeyEntrySpy: () => Promise<void> = async () => undefined
      let mockFetch = jest.fn(async () => ({
        text: async () => "Invalid API Key",
      }))
      global.fetch = mockFetch as any
      const Test = () => {
        const [{ error }, { setApiKeyEntry, submitApiKeyEntry }] =
          useViewModel()
        setApiKeyEntrySpy = setApiKeyEntry
        submitAPIKeyEntrySpy = submitApiKeyEntry
        return <></>
      }
      const layout = (
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      const r = render(layout)
      act(() => setApiKeyEntrySpy("apikey"))
      r.rerender(layout)
      await act(submitAPIKeyEntrySpy)
      r.rerender(layout)
      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.dictionaryapi.com/api/v3/references/collegiate/json/login?key=apikey"
      )
    })

    it("should return invalid api key error upon invalid api key server response", async () => {
      let errorSpy: string | undefined
      let setApiKeyEntrySpy: (entry: string) => void = () => undefined
      let submitAPIKeyEntrySpy: () => Promise<void> = async () => undefined
      let mockFetch = jest.fn(async () => ({
        text: async () => "Invalid API Key",
      }))
      global.fetch = mockFetch as any
      const Test = () => {
        const [{ error }, { setApiKeyEntry, submitApiKeyEntry }] =
          useViewModel()
        errorSpy = error
        setApiKeyEntrySpy = setApiKeyEntry
        submitAPIKeyEntrySpy = submitApiKeyEntry
        return <></>
      }
      const layout = (
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      const r = render(layout)
      expect(errorSpy).toBeUndefined()
      act(() => setApiKeyEntrySpy("apikey"))
      r.rerender(layout)
      await act(submitAPIKeyEntrySpy)
      r.rerender(layout)
      expect(errorSpy).toBe("Invalid API Key")
    })

    it("should return parsing error is response is not valid json", async () => {
      let errorSpy: string | undefined
      let setApiKeyEntrySpy: (entry: string) => void = () => undefined
      let submitAPIKeyEntrySpy: () => Promise<void> = async () => undefined
      let mockFetch = jest.fn(async () => ({
        text: async () => "[[[[[[",
      }))
      global.fetch = mockFetch as any
      const Test = () => {
        const [{ error }, { setApiKeyEntry, submitApiKeyEntry }] =
          useViewModel()
        errorSpy = error
        setApiKeyEntrySpy = setApiKeyEntry
        submitAPIKeyEntrySpy = submitApiKeyEntry
        return <></>
      }
      const layout = (
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      const r = render(layout)
      expect(errorSpy).toBeUndefined()
      act(() => setApiKeyEntrySpy("apikey"))
      r.rerender(layout)
      await act(submitAPIKeyEntrySpy)
      r.rerender(layout)
      expect(errorSpy).toBe("API Error: Unexpected end of JSON input")
    })

    it("should attempt to set api key if response is valid json", async () => {
      let setApiKeyEntrySpy: (entry: string) => void = () => undefined
      let submitAPIKeyEntrySpy: () => Promise<void> = async () => undefined
      let mockFetch = jest.fn(async () => ({
        text: async () => JSON.stringify(helloJson),
      }))
      global.fetch = mockFetch as any
      const Test = () => {
        const [, { setApiKeyEntry, submitApiKeyEntry }] = useViewModel()
        setApiKeyEntrySpy = setApiKeyEntry
        submitAPIKeyEntrySpy = submitApiKeyEntry
        return <></>
      }
      const layout = (
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      const r = render(layout)
      act(() => setApiKeyEntrySpy("apikey"))
      r.rerender(layout)
      await act(submitAPIKeyEntrySpy)
      r.rerender(layout)
      expect(setAPIKey).toHaveBeenCalledWith("apikey")
    })

    it("should navigate to the search route on success", async () => {
      let setApiKeyEntrySpy: (entry: string) => void = () => undefined
      let submitAPIKeyEntrySpy: () => Promise<void> = async () => undefined
      let mockFetch = jest.fn(async () => ({
        text: async () => JSON.stringify(helloJson),
      }))
      let mockReplace = jest.fn()
      mockedNav.mockReturnValue({
        replace: mockReplace,
        push: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        routeHref: jest.fn(),
      })

      global.fetch = mockFetch as any
      const Test = () => {
        const [, { setApiKeyEntry, submitApiKeyEntry }] = useViewModel()
        setApiKeyEntrySpy = setApiKeyEntry
        submitAPIKeyEntrySpy = submitApiKeyEntry
        return <></>
      }
      const layout = (
        <MockAuthProvider>
          <Test />
        </MockAuthProvider>
      )
      const r = render(layout)
      act(() => setApiKeyEntrySpy("apikey"))
      r.rerender(layout)
      await act(submitAPIKeyEntrySpy)
      r.rerender(layout)
      expect(mockReplace).toHaveBeenCalledWith({ route: "search" })
    })
  })
})
