import type { TextLayer } from '../document/types'
import { useLocale } from '../i18n/useLocale'
import { TrashIcon } from '../layout/icons'

export const EXPORT_PREVIEW_ID = '__export-preview__'

type LayersPanelProps = {
  layers: TextLayer[]
  selectedLayerId: string | null
  staleLayerIds?: ReadonlySet<string>
  hasBackground: boolean
  removeDisabled?: boolean
  onSelectLayer: (id: string | null, source?: 'sidebar' | 'canvas') => void
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
  hasBackground,
  removeDisabled = false,
  onSelectLayer,
  onRemoveLayer,
}: LayersPanelProps) => {
  const { t } = useLocale()
  const ordered = [...layers].reverse()

  return (
    <div className="layers-panel">
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
                  disabled={removeDisabled}
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
        {hasBackground ? (
          <>
            <li>
              <button
                type="button"
                className={`layer-item is-export-preview${selectedLayerId === EXPORT_PREVIEW_ID ? ' is-selected' : ''}`}
                aria-pressed={selectedLayerId === EXPORT_PREVIEW_ID}
                onClick={() => onSelectLayer(EXPORT_PREVIEW_ID, 'sidebar')}
              >
                <span className="layer-type is-preview" aria-hidden="true" />
                <span className="layer-label">{t('layers.exportPreview')}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`layer-item is-background${selectedLayerId === null ? ' is-selected' : ''}`}
                aria-pressed={selectedLayerId === null}
                onClick={() => onSelectLayer(null, 'sidebar')}
              >
                <span className="layer-type is-checker" aria-hidden="true" />
                <span className="layer-label">{t('layers.background')}</span>
              </button>
            </li>
          </>
        ) : null}
      </ul>
    </div>
  )
}
