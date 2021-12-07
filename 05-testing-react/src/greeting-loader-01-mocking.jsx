import React from 'react'
import { loadGreeting } from './api'

export function GreetingLoader() {
  let [greeting, setGreeting] = React.useState('')

  async function loadGreetingForInput(e) {
    e.preventDefault()
    let { data } = await loadGreeting(e.target.elements.name.value)
    setGreeting(data.greeting)
  }

  return (
    <form onSubmit={loadGreetingForInput}>
      <label htmlFor="name">Name</label>
      <input id="name" />
      <button type="submit">Load Greeting</button>
      <div aria-label="greeting">{greeting}</div>
    </form>
  )
}
