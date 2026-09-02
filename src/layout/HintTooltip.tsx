import { useId } from 'react'
import { HelpCircleIcon } from './icons'

type HintTooltipProps = {
  label: string
  hint: string
}

export const HintTooltip = ({ label, hint }: HintTooltipProps) => {
  const tooltipId = useId()

  return (
    <span className="control-hint">
      <button
        type="button"
        className="control-hint-button"
        aria-label={label}
        aria-describedby={tooltipId}
        onClick={(event) => event.preventDefault()}
      >
        <HelpCircleIcon />
      </button>
      <span id={tooltipId} className="control-hint-tooltip" role="tooltip">
        {hint}
      </span>
    </span>
  )
}
