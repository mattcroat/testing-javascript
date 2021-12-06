import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { ThemeProvider } from '@emotion/react'

import * as themes from '../src/themes'

function render(ui, { theme = themes.dark, ...options }) {
  function Wrapper({ children }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { render }
