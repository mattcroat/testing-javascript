const sum = require('./sum')

// matcher that uses exact equality
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

// check value of object recursively
test('object assignment', () => {
  const data = { one: 1 }
  data['two'] = 2
  expect(data).toEqual({ one: 1, two: 2 })
})

// opposite matcher
test('adding positive numbers is not zero', () => {
  for (let a = 1; a < 10; a += 1) {
    for (let b = 1; b < 10; b += 1) {
      expect(a + b).not.toBe(0)
    }
  }
})

// truthiness
test('null', () => {
  const n = null
  expect(n).toBeNull()
  expect(n).toBeDefined()
  expect(n).not.toBeUndefined()
  expect(n).not.toBeTruthy()
  expect(n).toBeFalsy()
})

test('zero', () => {
  const z = 0
  expect(z).not.toBeNull()
  expect(z).toBeDefined()
  expect(z).not.toBeUndefined()
  expect(z).not.toBeTruthy()
  expect(z).toBeFalsy()
})

// floating point numbers
test('adding floating point numbers', () => {
  const value = 0.1 + 0.2
  // expect(value).toBe(0.3)
  expect(value).toBeCloseTo(0.3)
})

// regex
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/)
})

test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/)
})

// check if array contains items

const shoppingList = ['bread', 'eggs', 'milk']

test('the shopping list has milk on it', () => {
  expect(shoppingList).toContain('milk')
  expect(new Set(shoppingList)).toContain('milk')
})

// exceptions
function youAreWrong() {
  throw new Error('You are wrong!')
}

test('I should always be right', () => {
  expect(() => youAreWrong()).toThrow()
  expect(() => youAreWrong()).toThrow(Error)
  expect(() => youAreWrong()).toThrow('You are wrong!')
  expect(() => youAreWrong()).toThrow(/wrong/)
})

// promises
function fetchResolve() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('peanut butter'), 100)
  })
}

function fetchReject() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('error'), 100)
  })
}

test('the data is peanut butter', () => {
  return fetchResolve().then((data) => expect(data).toBe('peanut butter'))
})

// test('the data is peanut butter', () => {
//   return expect(fetchResolve()).resolves.toBe('peanut butter')
// })

test('the fetch fails with an error', () => {
  expect.assertions(1)
  return fetchReject().catch((e) => expect(e).toMatch('error'))
})

// test('the fetch fails with an error', () => {
//   return expect(fetchReject()).rejects.toMatch('error')
// })

// async/await
test('the data is peanut butter', async () => {
  const data = await fetchResolve()
  expect(data).toBe('peanut butter')
})

// test('the data is peanut butter', async () => {
//   await expect(fetchResolve()).resolves.toBe('peanut butter')
// })

test('the fetch fails with an error', async () => {
  expect.assertions(1)
  try {
    await fetchReject()
  } catch (e) {
    expect(e).toMatch('error')
  }
})

// test('the fetch fails with an error', async () => {
//   await expect(fetchReject()).rejects.toMatch('error')
// })

// setup and teardown
let cityDatabase = []

function initializeCityDatabase() {
  cityDatabase.push('London', 'Paris', 'Vienna', 'San Juan')
}

function clearCityDatabase() {
  cityDatabase = []
}

function isCity(city) {
  return cityDatabase.includes(city)
}

beforeAll(() => {
  initializeCityDatabase()
})

afterAll(() => {
  clearCityDatabase()
})

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy()
})

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy()
})

// scoping
let foodDatabase = {}

function initializeFoodDatabase() {
  foodDatabase = {
    Vienna: ['Wiener Schnitzel'],
    'San Juan': ['Mofongo'],
  }
}

function isValidCityFoodPair(city, food) {
  return foodDatabase[city].includes(food)
}

describe('matching cities to foods', () => {
  beforeEach(() => {
    return initializeFoodDatabase()
  })

  test('Vienna <3 veal', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true)
  })

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true)
  })
})

// run only one test
// test.only('this will be the only test that runs', () => {
//   expect(true).toBe(true)
// })

// mock functions
function forEach(items, callback) {
  for (let index = 0; index < items.length; index += 1) {
    callback(items[index])
  }
}

test('test forEach implementation', () => {
  const mockCallback = jest.fn((x) => 42 + x)
  forEach([0, 1], mockCallback)

  expect(mockCallback.mock.calls.length).toBe(2)
  expect(mockCallback.mock.calls[0][0]).toBe(0)
  expect(mockCallback.mock.calls[1][0]).toBe(1)
  expect(mockCallback.mock.results[0].value).toBe(42)
})
