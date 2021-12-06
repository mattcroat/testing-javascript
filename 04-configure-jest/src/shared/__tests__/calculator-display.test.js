import React from 'react'

import { render } from '../../../test/calculator-test-utils'
import { light } from '../../themes'
import CalculatorDisplay from '../calculator-display'

test('renders', () => {
  let { container } = render(<CalculatorDisplay value="0" />, { theme: light })
  // expect(container.firstChild).toMatchInlineSnapshot()
})
