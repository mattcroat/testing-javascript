import React from 'react'

export function Countdown() {
  let [remainingTime, setRemainingTime] = React.useState(10000)
  let end = React.useRef(new Date().getTime() + remainingTime)

  React.useEffect(() => {
    let interval = setInterval(() => {
      let newRemainingTime = end.current - new Date().getTime()
      if (newRemainingTime <= 0) {
        clearInterval(interval)
        setRemainingTime(0)
      } else {
        setRemainingTime(newRemainingTime)
      }
    })

    return () => clearInterval(interval)
  }, [])

  return remainingTime
}
