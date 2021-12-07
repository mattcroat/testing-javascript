import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { ErrorBoundary } from '../error-boundary'
import { reportError as mockReportError } from '../api'

jest.mock('../api')

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

afterEach(() => {
  jest.clearAllMocks()
})

function Bomb({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('💣️')
  } else {
    return null
  }
}

test('calls reportError and renders that there was a problem', () => {
  mockReportError.mockResolvedValueOnce({ succes: true })

  let { getByText, queryByText, getByRole, queryByRole, rerender } = render(
    <Bomb />,
    { wrapper: ErrorBoundary }
  )

  rerender(<Bomb shouldThrow={true} />)

  let error = expect.any(Error)
  let info = { componentStack: expect.stringContaining('Bomb') }
  expect(mockReportError).toHaveBeenCalledWith(error, info)

  expect(console.error).toHaveBeenCalledTimes(2)

  // expect(getByRole('alert').textContent).toMatchInlineSnapshot()

  console.error.mockClear()
  mockReportError.mockClear()

  rerender(<Bomb />)

  fireEvent.click(getByText(/try again/i))
  expect(mockReportError).not.toHaveBeenCalled()
  expect(console.error).not.toHaveBeenCalled()
  expect(queryByRole('alert')).not.toBeInTheDocument()
  expect(queryByText(/try again/i)).not.toBeInTheDocument()
})
