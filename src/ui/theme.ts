import { createTheme } from '@mantine/core'

export const appTheme = createTheme({
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  primaryColor: 'dark',
  primaryShade: 8,
  defaultRadius: 'md',
  cursorType: 'pointer',
  black: '#111111',
  white: '#ffffff',
  focusRing: 'auto',
  components: {
    Input: {
      defaultProps: {
        size: 'sm',
      },
    },
    Select: {
      defaultProps: {
        size: 'sm',
        allowDeselect: false,
        checkIconPosition: 'right',
        comboboxProps: {
          shadow: 'md',
          withinPortal: true,
        },
      },
    },
    TextInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'sm',
        autosize: true,
        minRows: 1,
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'sm',
        clampBehavior: 'strict',
      },
    },
    Slider: {
      defaultProps: {
        color: 'dark',
        size: 'sm',
        radius: 'xl',
      },
    },
    ColorPicker: {
      defaultProps: {
        size: 'sm',
        format: 'hex',
        swatchesPerRow: 7,
      },
    },
    Popover: {
      defaultProps: {
        shadow: 'md',
        radius: 'md',
        withinPortal: true,
      },
    },
    Tooltip: {
      defaultProps: {
        withArrow: true,
        openDelay: 180,
      },
    },
  },
})
