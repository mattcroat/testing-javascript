import React from 'react'
import ReactDOM from 'react-dom'

let modalRoot = document.getElementById('modal-root')
if (!modalRoot) {
  modalRoot = document.createElement('div')
  modalRoot.setAttribute('id', 'modal-root')
  document.body.appendChild(modalRoot)
}

// don't use this for your modals.
// you need to think about accessibility and styling.
// Look into: https://ui.reach.tech/dialog
export function Modal({ children }) {
  let el = React.useRef(document.createElement('div'))

  React.useLayoutEffect(() => {
    let currentEl = el.current
    modalRoot.appendChild(currentEl)
    return () => modalRoot.removeChild(currentEl)
  }, [])

  return ReactDOM.createPortal(children, el.current)
}
