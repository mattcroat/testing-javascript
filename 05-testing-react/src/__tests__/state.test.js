import React from 'react'
import { render } from '@testing-library/react'
import user from '@testing-library/user-event'

import { FavoriteNumber } from '../favorite-number'

test('entering an invalid value shows an error message', () => {
  let { getByLabelText, getByRole, queryByRole, rerender } = render(
    <FavoriteNumber />
  )
  let input = getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)
  rerender(<FavoriteNumber max={10} />)
  expect(queryByRole('alert')).toBeNull()
})
