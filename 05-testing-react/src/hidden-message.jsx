import React from 'react'
import { CSSTransition } from 'react-transition-group'

function Fade(props) {
  return (
    <CSSTransition unmountOnExit timeout={1000} classNames="fade" {...props} />
  )
}

export function HiddenMessage({ children }) {
  let [show, setShow] = React.useState(false)
  let toggle = () => setShow((s) => !s)

  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <Fade in={show}>
        <div>{children}</div>
      </Fade>
    </div>
  )
}
