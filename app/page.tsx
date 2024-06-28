"use client"
import Image from "next/image"
import styles from "./page.module.scss"
import { useContext, useEffect } from "react"
import { AuthContext } from "./providers/auth/Provider"
import useNav from "./ui/navigation/useNav"

export default function Home() {
  const [{ apiKey }] = useContext(AuthContext)
  const nav = useNav()

  useEffect(() => {
    if (apiKey) {
      nav.replace({ route: "search" })
    } else {
      nav.replace({ route: "auth" })
    }
  }, [apiKey, nav])

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <Image
            src="/logox1200.png"
            alt="Merriam Webster Logo"
            className={styles.logo}
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
    </main>
  )
}
