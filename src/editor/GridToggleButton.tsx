import { useLocale } from '../i18n/useLocale'
import { GridIcon } from '../layout/icons'

type GridToggleButtonProps = {
  pressed: boolean
  onToggle: () => void
}

export const GridToggleButton = ({
  pressed,
  onToggle,
}: GridToggleButtonProps) => {
  const { t } = useLocale()
  const label = pressed ? t('grid.hide') : t('grid.show')

  return (
    <button
      type="button"
      className="secondary-button grid-toggle"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      onClick={onToggle}
    >
      <GridIcon />
    </button>
  )
}
