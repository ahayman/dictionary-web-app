import s from "./NavLink.module.scss"
import Link from "next/link"
import { Icon } from "../types"
import { cat } from "@/app/utils/cat"

export type Props = {
  title: string
  icon: Icon
  href: string
  selected: boolean
}

export default function NavLink({ title, icon, href, selected }: Props) {
  const LinkIcon = icon
  return (
    <Link
      href={href}
      className={cat(
        s.link,
        selected ? s.selectedBackground : s.unselectedBackground
      )}
    >
      <LinkIcon className={s.linkIcon} />
      <p className={s.title}>{title}</p>
    </Link>
  )
}
