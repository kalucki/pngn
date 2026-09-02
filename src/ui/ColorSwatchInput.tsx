import { ColorPicker, Popover } from '@mantine/core'
import { useState, type CSSProperties } from 'react'

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

const toHex = (value: string) =>
  value.startsWith('#') ? value : '#000000'

export const ColorSwatchInput = ({
  value,
  onChange,
  disabled,
  'aria-label': ariaLabel,
}: ColorSwatchInputProps) => {
  const [opened, setOpened] = useState(false)
  const hex = toHex(value)

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
      </Popover.Dropdown>
    </Popover>
  )
}
