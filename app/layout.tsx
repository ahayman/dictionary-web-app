"use client"
import { Inter } from "next/font/google"
import "./globals.scss"
import AuthProvider from "./providers/auth/Provider"
import ApiProvider from "@/app/providers/api/Provider"
import DefintitionsProvider from "@/app/providers/definitions/Provider"
import ThemeProvider from "./providers/theme/Provider"
import styles from "./layout.module.scss"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <AuthProvider>
          <ApiProvider>
            <DefintitionsProvider>
              <body className={inter.className}>
                <div className={styles.main}>{children}</div>
              </body>
            </DefintitionsProvider>
          </ApiProvider>
        </AuthProvider>
      </ThemeProvider>
    </html>
  )
}
