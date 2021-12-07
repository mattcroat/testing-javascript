import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { GreetingLoader } from '../greeting-loader-01-mocking'
import { loadGreeting as mockLoadGreeting } from '../api'

jest.mock('../api')

test('loads greetings on click', async () => {
  let testGreeting = 'TEST_GREETING'

  mockLoadGreeting.mockResolvedValueOnce({
    data: {
      greeting: testGreeting,
    },
  })

  let { getByLabelText, getByText } = render(<GreetingLoader />)

  let nameInput = getByLabelText(/name/i)
  let loadButton = getByText(/load/i)

  nameInput.value = 'Mary'
  fireEvent.click(loadButton)

  expect(mockLoadGreeting).toHaveBeenCalledWith('Mary')
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)

  await waitFor(() =>
    expect(getByLabelText(/greeting/i)).toHaveTextContent(testGreeting)
  )
})
