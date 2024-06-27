import { WordDefinition } from "@/app/providers/definitions/types"
import s from "./WordDefinitionView.module.scss"
import DefinitionResponseView from "./DefinitionResponseView"

export type Props = {
  definition: WordDefinition
}

export default function WordDefinitionView({ definition }: Props) {
  return (
    <div className={s.main}>
      {definition.definitions
        .map((def) => <DefinitionResponseView key={def.meta.uuid} def={def} />)
        .joinWith(() => (
          <div className={s.hr} />
        ))}
    </div>
  )
}
