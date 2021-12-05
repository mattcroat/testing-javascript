import thumbWar from '../thumb-war.js'
import * as utils from '../utils'

jest.mock('../utils')

test('returns winner', () => {
  let winner = thumbWar('React', 'Svelte')

  expect(winner).toBe('React')
  expect(utils.getWinner.mock.calls).toEqual([
    ['React', 'Svelte'],
    ['React', 'Svelte'],
  ])

  utils.getWinner.mockReset()
})
