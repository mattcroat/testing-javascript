let { sumAsync, subtractAsync } = require('./math')

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
