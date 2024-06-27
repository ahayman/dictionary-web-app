"use client"

import Image from "next/image"
import { PulseLoader } from "react-spinners"
import styles from "./auth.module.css"
import useViewModel from "./useViewModel"
import { FormEvent, useContext } from "react"
import { ThemeContext } from "../providers/theme/Provider"

export default function AuthPage() {
  const [{ theme }] = useContext(ThemeContext)
  const [
    { apiKeyEntry, loading, currentApiKey, error },
    { setApiKeyEntry, submitApiKeyEntry },
  ] = useViewModel()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitApiKeyEntry()
  }

  return (
    <div className={styles.main}>
      <Image
        src="/logox1200.png"
        alt="Merriam Webster Logo"
        className={styles.logo}
        width={100}
        height={100}
        priority
      />

      <div className={styles["entry-container"]}>
        <h3 className={styles.title}>API Key</h3>
        <form onSubmit={onSubmit}>
          <input
            className={styles["entry-input"]}
            type="text"
            value={apiKeyEntry}
            onChange={(e) => setApiKeyEntry(e.target.value)}
          ></input>
          <input
            className={styles.submit}
            type="submit"
            value="Submit"
            disabled={loading || !apiKeyEntry}
          />
          {loading && (
            <PulseLoader color={theme === "dark" ? "white" : "black"} />
          )}
          {!!error && <div className={styles.error}>{error}</div>}
        </form>
        {!!currentApiKey && (
          <>
            <em className={styles.subText}>
              Current Key: <br />
            </em>
            <em className={styles.subText}>{currentApiKey}</em>
          </>
        )}
      </div>
    </div>
  )
}
