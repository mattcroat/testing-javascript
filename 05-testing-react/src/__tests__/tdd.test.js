import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Redirect as MockRedirect } from 'react-router'
import { build, fake, sequence } from 'test-data-bot'

import { Editor } from '../post-editor-08-custom-render'
import { savePost as mockSavePost } from '../api'

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

jest.mock('../api')

afterEach(() => {
  jest.clearAllMocks()
})

let userBuilder = build('User').fields({
  id: sequence((s) => `user-${s}`),
})

let postBuilder = build('Post').fields({
  title: fake((f) => f.lorem.words()),
  content: fake((f) => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake((f) => [f.lorem.words(), f.lorem.words(), f.lorem.words()]),
})

function renderEditor() {
  let fakeUser = userBuilder()
  let fakePost = postBuilder()

  let utils = render(<Editor user={fakeUser} />)

  utils.getByLabelText(/title/i).value = fakePost.title
  utils.getByLabelText(/content/i).value = fakePost.content
  utils.getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  let submitButton = utils.getByText(/submit/i)

  return {
    ...utils,
    submitButton,
    fakeUser,
    fakePost,
  }
}

test('renders a form with title, content, tags, and a submit button', async () => {
  let preDate = new Date().getTime()
  mockSavePost.mockResolvedValueOnce()
  let { submitButton, fakeUser, fakePost } = renderEditor()

  fireEvent.click(submitButton)

  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    date: expect.any(String),
    authorId: fakeUser.id,
  })

  expect(mockSavePost).toHaveBeenCalledTimes(1)

  let postDate = new Date().getTime()
  let date = new Date(mockSavePost.mock.calls[0][0].date).getTime()
  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)

  await waitFor(() =>
    expect(MockRedirect).toHaveBeenCalledWith({ to: '/' }, {})
  )
})

test('renders an error message from the server', async () => {
  let testError = 'test error'
  mockSavePost.mockRejectedValueOnce({ data: { error: testError } })
  let { submitButton, findByRole } = renderEditor()

  fireEvent.click(submitButton)

  let postError = await findByRole('alert')
  expect(postError).toHaveTextContent('test error')
  expect(submitButton).not.toBeDisabled()
})
