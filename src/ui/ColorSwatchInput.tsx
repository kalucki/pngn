import { ColorPicker, Popover, TextInput } from '@mantine/core'
import { useEyeDropper } from '@mantine/hooks'
import { useEffect, useState, type CSSProperties } from 'react'
import { useLocale } from '../i18n/useLocale'
import { PipetteIcon } from '../layout/icons'

const TEXT_SWATCHES = [
  '#000000',
  '#ffffff',
  '#525252',
  '#dc2626',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#2563eb',
  '#7c3aed',
  '#db2777',
]

type ColorSwatchInputProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  'aria-label'?: string
}

const HEX6 = /^#[0-9a-fA-F]{6}$/
const HEX3 = /^#[0-9a-fA-F]{3}$/

const toHex = (value: string) =>
  value.startsWith('#') ? value : '#000000'

const normalizeHex = (value: string) => {
  const trimmed = value.trim()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  if (HEX6.test(withHash)) return withHash.toLowerCase()
  if (HEX3.test(withHash)) {
    const r = withHash[1]
    const g = withHash[2]
    const b = withHash[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return null
}

export const ColorSwatchInput = ({
  value,
  onChange,
  disabled,
  'aria-label': ariaLabel,
}: ColorSwatchInputProps) => {
  const { t } = useLocale()
  const [opened, setOpened] = useState(false)
  const hex = toHex(value)
  const [draft, setDraft] = useState(hex)
  const { supported: eyeDropperSupported, open: openEyeDropper } =
    useEyeDropper()

  useEffect(() => {
    setDraft(hex)
  }, [hex])

  const pickFromScreen = () => {
    const pending = openEyeDropper()
    setOpened(false)
    void pending
      .then((result) => {
        if (result?.sRGBHex) onChange(result.sRGBHex.toLowerCase())
      })
      .catch(() => {})
  }

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      disabled={disabled}
      position="bottom-start"
    >
      <Popover.Target>
        <button
          type="button"
          className="color-swatch-button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-expanded={opened}
          aria-haspopup="dialog"
          style={{ '--swatch-color': hex } as CSSProperties}
          onClick={() => setOpened((current) => !current)}
        >
          <span className="color-swatch-button-fill" />
        </button>
      </Popover.Target>
      <Popover.Dropdown className="color-swatch-dropdown">
        <ColorPicker
          format="hex"
          value={hex}
          swatches={TEXT_SWATCHES}
          onChange={onChange}
          onColorSwatchClick={() => setOpened(false)}
        />
        <div className="color-swatch-tools">
          <TextInput
            size="xs"
            className="color-swatch-hex"
            aria-label={t('toolbar.hex')}
            spellCheck={false}
            value={draft}
            onChange={(event) => {
              const next = event.currentTarget.value
              setDraft(next)
              const normalized = normalizeHex(next)
              if (normalized) onChange(normalized)
            }}
            onBlur={() => setDraft(hex)}
          />
          {eyeDropperSupported ? (
            <button
              type="button"
              className="color-swatch-eyedropper"
              aria-label={t('toolbar.eyedropper')}
              onClick={pickFromScreen}
            >
              <PipetteIcon size={15} />
            </button>
          ) : (
            <label className="color-swatch-eyedropper">
              <span className="visually-hidden">{t('toolbar.eyedropper')}</span>
              <PipetteIcon size={15} />
              <input
                type="color"
                className="color-swatch-native"
                value={hex}
                aria-label={t('toolbar.eyedropper')}
                onChange={(event) => onChange(event.currentTarget.value)}
              />
            </label>
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}
