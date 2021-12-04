import { sumAsync, subtractAsync } from './math.js'

test('sumAsync adds numbers asynchronously', async () => {
  let result = await sumAsync(3, 7)
  let expected = 10
  expect(result).toBe(expected)
})

test('subtractAsync subtracts numbers asynchronously', async () => {
  let result = await subtractAsync(7, 3)
  let expected = 4
  expect(result).toBe(expected)
})

async function test(title, callback) {
  try {
    await callback()
    console.log(`👍 ${title}`)
  } catch (error) {
    console.error(`🚫 ${title}`)
    console.error(error)
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`)
      }
    },
  }
}
