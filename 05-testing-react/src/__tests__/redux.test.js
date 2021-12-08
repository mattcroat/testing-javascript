import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { fireEvent, render as rtlRender } from '@testing-library/react'

import { Counter } from '../redux-counter'
import { reducer } from '../redux-reducer'

function render(
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...rtlOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...rtlOptions }),
    store,
  }
}

test('can render with redux with defaults', () => {
  let { getByLabelText, getByText } = render(<Counter />)

  fireEvent.click(getByText('+'))
  expect(getByLabelText(/count/i)).toHaveTextContent('1')
})

test('can render with redux with custom initial state', () => {
  let { getByLabelText, getByText } = render(<Counter />, {
    initialState: { count: 3 },
  })

  fireEvent.click(getByText('-'))
  expect(getByLabelText(/count/i)).toHaveTextContent('2')
})
