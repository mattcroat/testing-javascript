export function getWinner(player1, player2) {
  let winningNumber = Math.random()

  return winningNumber < 1 / 3
    ? player1
    : winningNumber < 2 / 3
    ? player2
    : null
}
