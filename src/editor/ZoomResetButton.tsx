import { useLocale } from '../i18n/useLocale'

export const ZoomResetButton = ({
  scale,
  onReset,
}: {
  scale: number
  onReset: () => void
}) => {
  const { t } = useLocale()
  if (scale <= 1.001) return null
  return (
    <button
      type="button"
      className="secondary-button zoom-reset"
      onClick={onReset}
      aria-label={t('zoom.reset')}
      title={t('zoom.reset')}
    >
      {Math.round(scale * 100)}%
    </button>
  )
}
