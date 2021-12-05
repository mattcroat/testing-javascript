import * as utils from './utils.js'

export default function thumbWar(player1, player2) {
  let numberToWin = 2
  let player1Wins = 0
  let player2Wins = 0

  while (player1Wins < numberToWin && player2Wins < numberToWin) {
    let winner = utils.getWinner(player1, player2)

    if (winner === player1) {
      player1Wins += 1
    } else if (winner === player2) {
      player2Wins += 1
    }
  }

  return player1Wins > player2Wins ? player1 : player2
}
