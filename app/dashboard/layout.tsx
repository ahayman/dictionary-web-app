"use client"
import Nav from "../ui/common/nav/Nav"
import s from "./layout.module.scss"

type Props = {
  children: React.ReactNode
}

/**
 * Dashboard layout includes a sidenav for desktop layout, and a bottom nav
 * for mobile layouts. See layout.module.scss for more details.
 */
export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <div className={s.main}>
        <div className={s.sideNav}>
          <Nav />
        </div>
        <div className={s.container}>{children}</div>
        <div className={s.bottomNav}>
          <Nav />
        </div>
      </div>
    </>
  )
}
