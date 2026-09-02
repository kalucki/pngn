import { MantineProvider } from '@mantine/core'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initAnalytics } from './analytics'
import { LocaleProvider } from './i18n/LocaleProvider'
import '@mantine/core/styles.css'
import './index.css'
import { Root } from './Root.tsx'
import { appTheme } from './ui/theme'

initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={appTheme} forceColorScheme="light">
      <LocaleProvider>
        <Root />
      </LocaleProvider>
    </MantineProvider>
  </StrictMode>,
)
