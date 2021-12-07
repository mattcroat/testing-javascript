import React from 'react'
import { Redirect } from 'react-router'
import { savePost } from './api'

export function Editor({ user }) {
  let [isSaving, setIsSaving] = React.useState(false)
  let [redirect, setRedirect] = React.useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    let { title, content, tags } = e.target.elements
    let newPost = {
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((t) => t.trim()),
      date: new Date().toISOString(),
      authorId: user.id,
    }
    setIsSaving(true)
    savePost(newPost).then(() => setRedirect(true))
  }

  if (redirect) {
    return <Redirect to="/" />
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" name="title" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" name="content" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" name="tags" />

      <button type="submit" disabled={isSaving}>
        Submit
      </button>
    </form>
  )
}
