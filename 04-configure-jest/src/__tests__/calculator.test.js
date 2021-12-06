import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import Calculator from '../calculator'

test('the clear button switches from AC to C when there is an entry', () => {
  let { getByText } = render(<Calculator />)
  let clearButton = getByText('AC')

  fireEvent.click(getByText(/3/))
  expect(clearButton).toHaveTextContent('C')

  fireEvent.click(clearButton)
  expect(clearButton).toHaveTextContent('AC')
})
