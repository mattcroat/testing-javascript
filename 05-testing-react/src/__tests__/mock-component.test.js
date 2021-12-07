import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { HiddenMessage } from '../hidden-message'

jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props) => (props.in ? props.children : null),
  }
})

test('shows hidden message when toggle is clicked', () => {
  let myMessage = 'hello world'
  let { getByText, queryByText } = render(
    <HiddenMessage>{myMessage}</HiddenMessage>
  )

  let toggleButton = getByText(/toggle/i)
  expect(queryByText(myMessage)).not.toBeInTheDocument()

  fireEvent.click(toggleButton)
  expect(getByText(myMessage)).toBeInTheDocument()

  fireEvent.click(toggleButton)
  expect(queryByText(myMessage)).not.toBeInTheDocument()
})
