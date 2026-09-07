import type { TextLayer } from '../document/types'
import { useLocale } from '../i18n/useLocale'
import { TrashIcon } from '../layout/icons'

type LayersPanelProps = {
  layers: TextLayer[]
  selectedLayerId: string | null
  staleLayerIds?: ReadonlySet<string>
  disabled?: boolean
  onSelectLayer: (id: string, source?: 'sidebar' | 'canvas') => void
  onRemoveLayer: (id: string) => void
}

const layerLabel = (layer: TextLayer, fallback: string) => {
  const text = layer.text.trim() || layer.originalText.trim()
  if (!text) return fallback
  return text.replace(/\s+/g, ' ')
}

export const LayersPanel = ({
  layers,
  selectedLayerId,
  staleLayerIds,
  disabled = false,
  onSelectLayer,
  onRemoveLayer,
}: LayersPanelProps) => {
  const { t } = useLocale()
  const ordered = [...layers].reverse()

  return (
    <div className={`layers-panel${disabled ? ' is-disabled' : ''}`}>
      <h2 className="layers-heading">{t('layers.title')}</h2>
      {layers.length === 0 ? (
        <p className="layers-empty">{t('layers.empty')}</p>
      ) : null}
      <ul className="layers-list" aria-label={t('layers.aria')}>
        {ordered.map((layer, reverseIndex) => {
          const index = layers.length - reverseIndex
          const selected = layer.id === selectedLayerId
          const stale = staleLayerIds?.has(layer.id) ?? false
          return (
            <li key={layer.id}>
              <div
                className={`layer-row${selected ? ' is-selected' : ''}${stale ? ' is-stale' : ''}`}
              >
                <button
                  type="button"
                  className="layer-item"
                  aria-pressed={selected}
                  disabled={disabled}
                  title={stale ? t('app.applySettingsHint') : undefined}
                  onClick={() => onSelectLayer(layer.id, 'sidebar')}
                >
                  <span className="layer-type" aria-hidden="true">
                    T
                  </span>
                  <span
                    className="layer-swatch"
                    style={{ background: layer.typography.color }}
                    aria-hidden="true"
                  />
                  <span className="layer-label">
                    {layerLabel(layer, t('layers.fallback', { n: index }))}
                  </span>
                </button>
                <button
                  type="button"
                  className="layer-delete"
                  disabled={disabled}
                  aria-label={t('layers.remove')}
                  title={t('layers.remove')}
                  onClick={() => onRemoveLayer(layer.id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
