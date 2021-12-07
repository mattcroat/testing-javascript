import React from 'react'

export function useCounter({ initialCount = 0, step = 1 } = {}) {
  let [count, setCount] = React.useState(initialCount)
  let increment = () => setCount((c) => c + step)
  let decrement = () => setCount((c) => c - step)
  return { count, increment, decrement }
}
