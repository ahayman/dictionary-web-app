/**
 * Common Icon type definition for Icon use throughout the app
 */
export type Icon = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
    title?: string
    titleId?: string
  } & React.RefAttributes<SVGSVGElement>
>
