"use client"
import Image from "next/image"
import { usePathname } from "next/navigation"
import useNav from "../../navigation/useNav"
import s from "./Nav.module.scss"
import NavLink from "./components/NavLink"
import {
  ArrowLeftStartOnRectangleIcon,
  SunIcon,
  MoonIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import useViewModel from "./useViewModel"

export default function Nav() {
  const [
    { navItems, confirmSignout, theme },
    { signout, confirmedSignout, cancelSignout, toggleTheme },
  ] = useViewModel()
  const nav = useNav()
  const path = usePathname()

  return (
    <div className={s.main}>
      <Image
        src="/logox1200.png"
        alt="Merriam Webster Logo"
        className={s.logo}
        width={50}
        height={50}
        priority
      />

      {navItems.map(({ title, icon, route }) => (
        <NavLink
          key={title}
          title={title}
          icon={icon}
          href={nav.routeHref(route)}
          selected={path?.endsWith(nav.routeHref(route))}
        />
      ))}

      <div className={s.vSpacer} />
      {!confirmSignout && (
        <button className={s.signoutButton} onClick={signout}>
          <ArrowLeftStartOnRectangleIcon className={s.signoutIcon} />
        </button>
      )}
      {confirmSignout && (
        <div className={s.confirmContainer}>
          <p className={s.warningText}>Are you sure?</p>
          <div className={s.hr} />
          <div className={s.buttonRow}>
            <button className={s.yesButton} onClick={confirmedSignout}>
              <CheckCircleIcon className={s.confirmYesIcon} />
            </button>
            <button className={s.noButton} onClick={cancelSignout}>
              <XCircleIcon className={s.confirmNoIcon} />
            </button>
          </div>
        </div>
      )}
      <div className={s.hr} />
      <button className={s.themeButton} onClick={toggleTheme}>
        {theme === "dark" ? (
          <MoonIcon className={s.themeIcon} />
        ) : (
          <SunIcon className={s.themeIcon} />
        )}
      </button>
    </div>
  )
}
