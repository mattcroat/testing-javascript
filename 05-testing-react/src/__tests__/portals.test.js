import React from 'react'
import { render, queries } from '@testing-library/react'

import { Modal } from '../modal'

test('modal shows the children', () => {
  let { getByTestId } = render(
    <>
      <div data-testid="foo" />
      <Modal>
        <div data-testid="test" />
      </Modal>
    </>,
    { baseElement: document.getElementById('modal-root') }
  )

  queries.getByTestId(document.body, 'foo')
  expect(getByTestId('test')).toBeInTheDocument()
})
