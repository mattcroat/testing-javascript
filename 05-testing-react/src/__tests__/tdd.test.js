import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { Editor } from '../post-editor-02-state'

test('renders a form with title, content, tags, and a submit button', () => {
  let { getByLabelText, getByText } = render(<Editor />)
  getByLabelText(/title/i)
  getByLabelText(/content/i)
  getByLabelText(/tags/i)
  let submitButton = getByText(/submit/i)

  fireEvent.click(submitButton)
  expect(submitButton).toBeDisabled()
})
