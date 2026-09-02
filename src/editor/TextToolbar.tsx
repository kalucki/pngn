import { NumberInput, Select, Slider, Textarea } from '@mantine/core'
import { useEffect, useState } from 'react'
import type { TextLayer } from '../document/types'
import { useLocale } from '../i18n/useLocale'
import type { MessageKey } from '../i18n/messages'
import { ColorSwatchInput } from '../ui/ColorSwatchInput'
import { defaultStrokeWidth } from './drawTextLayer'
import {
  ensureFont,
  FONT_GROUP_ORDER,
  fontByFamily,
  fontsInCategory,
  isFontFailed,
  isFontReady,
  nearestWeight,
  type FontCategory,
} from './fonts'

type TextToolbarProps = {
  layer: TextLayer | null
  onChange: (layer: TextLayer) => void
}

type FontStatus = 'idle' | 'loading' | 'error'

const FONT_GROUP_KEYS: Record<FontCategory, MessageKey> = {
  system: 'fontGroup.system',
  sans: 'fontGroup.sans',
  serif: 'fontGroup.serif',
  display: 'fontGroup.display',
  mono: 'fontGroup.mono',
}

const FONT_WEIGHT_KEYS: Record<number, MessageKey> = {
  100: 'fontWeight.100',
  200: 'fontWeight.200',
  300: 'fontWeight.300',
  400: 'fontWeight.400',
  500: 'fontWeight.500',
  600: 'fontWeight.600',
  700: 'fontWeight.700',
  800: 'fontWeight.800',
  900: 'fontWeight.900',
}

const renderFontOption = ({ option }: { option: { value: string; label: string } }) => (
  <span style={{ fontFamily: `"${option.value}", sans-serif` }}>{option.label}</span>
)

export const TextToolbar = ({ layer, onChange }: TextToolbarProps) => {
  const { t } = useLocale()
  const [fontEpoch, setFontEpoch] = useState(0)

  const inactive = !layer
  const selectedFont = layer
    ? fontByFamily(layer.typography.fontFamily)
    : undefined
  const availableWeights = selectedFont?.weights ?? [400, 700]
  const fontFamily = layer?.typography.fontFamily ?? ''
  const fontWeight = layer
    ? availableWeights.includes(layer.typography.fontWeight)
      ? layer.typography.fontWeight
      : nearestWeight(availableWeights, layer.typography.fontWeight)
    : 400

  useEffect(() => {
    if (!fontFamily || inactive) return
    if (isFontReady(fontFamily, fontWeight)) return
    let cancelled = false
    void ensureFont(fontFamily, fontWeight, true).then(() => {
      if (!cancelled) setFontEpoch((epoch) => epoch + 1)
    })
    return () => {
      cancelled = true
    }
  }, [fontFamily, fontWeight, inactive])

  const fontStatus: FontStatus =
    fontEpoch >= 0 && layer && isFontFailed(fontFamily, fontWeight)
      ? 'error'
      : layer && !isFontReady(fontFamily, fontWeight)
        ? 'loading'
        : 'idle'

  const updateTypography = (patch: Partial<TextLayer['typography']>) => {
    if (!layer) return
    onChange({
      ...layer,
      typography: { ...layer.typography, ...patch },
    })
  }

  const fontSelectData = FONT_GROUP_ORDER.map((category) => ({
    group: t(FONT_GROUP_KEYS[category]),
    items: fontsInCategory(category).map((font) => ({
      value: font.family,
      label: font.family,
    })),
  }))

  return (
    <div
      className={`toolbar-group${inactive ? ' is-inactive' : ''}`}
      aria-disabled={inactive}
    >
      <label className="toolbar-field field-text">
        <span>{t('toolbar.text')}</span>
        <Textarea
          size="xs"
          value={layer?.text ?? ''}
          disabled={inactive}
          minRows={1}
          maxRows={4}
          resize="none"
          placeholder={
            inactive ? t('toolbar.hint') : t('toolbar.placeholder')
          }
          aria-label={t('toolbar.text')}
          onChange={(event) => {
            if (!layer) return
            onChange({ ...layer, text: event.currentTarget.value })
          }}
        />
      </label>

      <label
        className="toolbar-field field-font"
        data-font-status={inactive ? 'idle' : fontStatus}
      >
        <span>{t('toolbar.font')}</span>
        <Select
          size="xs"
          searchable
          aria-label={t('toolbar.font')}
          aria-busy={!inactive && fontStatus === 'loading'}
          disabled={inactive}
          error={!inactive && fontStatus === 'error'}
          title={
            !inactive && fontStatus === 'error'
              ? t('toolbar.fontError')
              : undefined
          }
          placeholder={t('toolbar.font')}
          nothingFoundMessage={t('toolbar.fontEmpty')}
          value={fontFamily || null}
          data={fontSelectData}
          renderOption={renderFontOption}
          comboboxProps={{ width: 260, shadow: 'md', withinPortal: true }}
          styles={{
            input:
              !inactive && fontStatus === 'idle' && fontFamily
                ? { fontFamily: `"${fontFamily}", sans-serif` }
                : undefined,
          }}
          onChange={(value) => {
            if (!value) return
            const nextFont = fontByFamily(value)
            updateTypography({
              fontFamily: value,
              fontWeight: nextFont
                ? nearestWeight(
                    nextFont.weights,
                    layer?.typography.fontWeight ?? 400,
                  )
                : (layer?.typography.fontWeight ?? 400),
            })
          }}
        />
      </label>

      <label className="toolbar-field field-size">
        <span>{t('toolbar.size')}</span>
        <NumberInput
          size="xs"
          min={4}
          max={600}
          step={1}
          allowDecimal={false}
          allowNegative={false}
          disabled={inactive}
          aria-label={t('toolbar.size')}
          value={layer ? Math.round(layer.typography.fontSize) : ''}
          onChange={(value) => {
            if (typeof value !== 'number') return
            updateTypography({ fontSize: value })
          }}
        />
      </label>

      <label className="toolbar-field">
        <span>{t('toolbar.weight')}</span>
        <Select
          size="xs"
          disabled={inactive}
          aria-label={t('toolbar.weight')}
          value={String(fontWeight)}
          data={availableWeights.map((weight) => ({
            value: String(weight),
            label: FONT_WEIGHT_KEYS[weight]
              ? t(FONT_WEIGHT_KEYS[weight])
              : String(weight),
          }))}
          onChange={(value) => {
            if (!value) return
            updateTypography({ fontWeight: Number(value) })
          }}
        />
      </label>

      <div className="toolbar-field field-color">
        <span>{t('toolbar.color')}</span>
        <ColorSwatchInput
          disabled={inactive}
          aria-label={t('toolbar.color')}
          value={
            layer?.typography.color.startsWith('#')
              ? layer.typography.color
              : '#000000'
          }
          onChange={(color) => updateTypography({ color })}
        />
      </div>

      <div className="toolbar-field field-stroke">
        <span>{t('toolbar.stroke')}</span>
        <div className="stroke-controls">
          <ColorSwatchInput
            disabled={inactive}
            aria-label={t('toolbar.stroke')}
            value={
              layer?.typography.strokeColor.startsWith('#')
                ? layer.typography.strokeColor
                : '#000000'
            }
            onChange={(strokeColor) => {
              if (!layer) return
              updateTypography({
                strokeColor,
                strokeWidth:
                  layer.typography.strokeWidth > 0
                    ? layer.typography.strokeWidth
                    : defaultStrokeWidth(layer.typography.fontSize),
              })
            }}
          />
          <NumberInput
            size="xs"
            className="stroke-width-input"
            min={0}
            max={80}
            step={1}
            allowDecimal={false}
            allowNegative={false}
            disabled={inactive}
            aria-label={t('toolbar.strokeWidth')}
            value={layer ? Math.round(layer.typography.strokeWidth) : ''}
            onChange={(value) => {
              if (typeof value !== 'number') return
              updateTypography({ strokeWidth: Math.max(0, value) })
            }}
          />
        </div>
      </div>

      <label className="toolbar-field field-opacity">
        <span>{t('toolbar.opacity')}</span>
        <Slider
          className="opacity-slider"
          min={0}
          max={1}
          step={0.05}
          disabled={inactive}
          thumbLabel={t('toolbar.opacity')}
          label={(value) => `${Math.round(value * 100)}%`}
          value={layer?.effects.opacity ?? 1}
          onChange={(opacity) => {
            if (!layer) return
            onChange({
              ...layer,
              effects: {
                ...layer.effects,
                opacity,
              },
            })
          }}
        />
      </label>
    </div>
  )
}
