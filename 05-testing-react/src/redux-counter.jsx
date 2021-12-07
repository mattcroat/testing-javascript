import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export function Counter() {
  let count = useSelector((state) => state.count)
  let dispatch = useDispatch()
  let increment = () => dispatch({ type: 'INCREMENT' })
  let decrement = () => dispatch({ type: 'DECREMENT' })

  return (
    <div>
      <h2>Counter</h2>
      <div>
        <button onClick={decrement}>-</button>
        <span aria-label="count">{count}</span>
        <button onClick={increment}>+</button>
      </div>
    </div>
  )
}
