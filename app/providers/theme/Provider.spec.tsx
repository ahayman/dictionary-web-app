import ThemeProvider, { ThemeContext } from "./Provider"
import MockProvider from "@/__test__/providers/MockProvider"
import { StorageContext } from "../storage/Provider"
import { Context as StorageState } from "../storage/types"
import { act, render } from "@testing-library/react"
import { useContext } from "react"
import { Theme } from "./types"

describe("ThemeProvider", () => {
  let storageTheme: Theme = "dark"
  let storageStateMock: StorageState

  beforeEach(() => {
    storageTheme = "dark"
    storageStateMock = [
      {
        getSet: jest.fn(() => storageTheme),
        set: jest.fn(),
        get: jest.fn(() => storageTheme),
        clear: jest.fn(),
      },
    ]
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should provide theme value returned from storage", () => {
    let themeSpy: Theme | undefined
    const Test = () => {
      const [{ theme }] = useContext(ThemeContext)
      themeSpy = theme
      return <></>
    }

    render(
      <MockProvider context={StorageContext} state={storageStateMock}>
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      </MockProvider>
    )
    expect(themeSpy).toBe(storageTheme)
    expect(storageStateMock[0].getSet).toHaveBeenCalledWith(
      "data-theme",
      expect.any(Function)
    )
  })

  it("should access window theme as default value and return 'dark' if color-scheme is dark", () => {
    const matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMedia,
    })
    storageStateMock[0].getSet = jest.fn((_, dValue) => dValue())

    let themeSpy: Theme | undefined
    const Test = () => {
      const [{ theme }] = useContext(ThemeContext)
      themeSpy = theme
      return <></>
    }

    render(
      <MockProvider context={StorageContext} state={storageStateMock}>
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      </MockProvider>
    )
    expect(themeSpy).toBe("dark")
    expect(storageStateMock[0].getSet).toHaveBeenCalledWith(
      "data-theme",
      expect.any(Function)
    )
    expect(matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)")
  })

  it("should access window theme as default value and return 'light' if color-scheme is not dark", () => {
    const matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMedia,
    })
    storageStateMock[0].getSet = jest.fn((_, dValue) => dValue())

    let themeSpy: Theme | undefined
    const Test = () => {
      const [{ theme }] = useContext(ThemeContext)
      themeSpy = theme
      return <></>
    }

    render(
      <MockProvider context={StorageContext} state={storageStateMock}>
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      </MockProvider>
    )

    expect(themeSpy).toBe("light")
    expect(storageStateMock[0].getSet).toHaveBeenCalledWith(
      "data-theme",
      expect.any(Function)
    )
    expect(matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)")
  })

  it("should store and return correct theme on toggle", () => {
    let themeSpy: Theme | undefined
    let toggleSpy: () => void = () => {}
    const Test = () => {
      const [{ theme }, { toggleTheme }] = useContext(ThemeContext)
      themeSpy = theme
      toggleSpy = toggleTheme
      return <></>
    }
    const layout = (
      <MockProvider context={StorageContext} state={storageStateMock}>
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      </MockProvider>
    )
    const result = render(layout)
    act(toggleSpy)
    result.rerender(layout)
    expect(themeSpy).toBe("light")
    expect(storageStateMock[0].set).toHaveBeenCalledWith("data-theme", "light")
  })

  it("should set the document element attribute on toggle", () => {
    let themeSpy: Theme | undefined
    let toggleSpy: () => void = () => {}
    const setAttributeMock = jest.fn()
    document.documentElement.setAttribute = setAttributeMock
    const Test = () => {
      const [{ theme }, { toggleTheme }] = useContext(ThemeContext)
      themeSpy = theme
      toggleSpy = toggleTheme
      return <></>
    }
    const layout = (
      <MockProvider context={StorageContext} state={storageStateMock}>
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      </MockProvider>
    )
    const result = render(layout)
    act(toggleSpy)
    result.rerender(layout)
    expect(themeSpy).toBe("light")
    expect(setAttributeMock).toHaveBeenCalledWith("data-theme", "light")
  })
})
