# 🧪 Testing JavaScript

Notes on testing JavaScript.

## Fundamentals

Automated test in **JavaScript** is code that throws an error when things are unexpected.

```js
let sum = (a, b) => a - b
let subtract = (a, b) => a - b

let result = sum(3, 7)
let expected = 10

if (result !== expected) {
  throw new Error(`${result} is not equal to ${expected}`)
}
```

Writing a simple assertion library.

```js
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
```

```js
test('sum adds numbers', () => {
  let result = sum(3, 7)
  let expected = 10
  expect(result).toBe(expected)
})

test('subtract subtracts numbers', () => {
  let result = subtract(7, 3)
  let expected = 4
  expect(result).toBe(expected)
})
```

Many test frameworks embrace you're going to use testing utilities in every test file, so they're available globally.

```js
// setup-globals.cjs
global.test = test
global.expect = expect
```

```shell
node --require ./setup-globals.cjs ./test.js
```

**Jest** is a testing framework that does this for us and we can run it on our tests (**Jest** requires **Babel** to use `import` syntax).

```shell
npx jest
```

## Static Analysis

Static testing tools give you confidence in your project.

**ESLint** can lint **JavaScript** and give us warnings in our console and editor using the extension.

```js
npx eslint .
```

It can also fix our code.

```js
npx eslint . --fix
```

You can add **ESLint** to the **scripts** configuration in **package.json**.

```json
"scripts": {
  "lint": "eslint ."
}
```

```shell
npm run lint
```

**Prettier** can automatically format your code to avoid distractions using a command or "on save" in your editor using the extension.

```shell
npx prettier src/example.js --write
```

You can use a **glob** to format all files in the project.

```json
"scripts": {
  "format": "prettier --write \"**/*.+(js|json)\""
}
```

```shell
npm run format
```

To avoid conflict between **ESLint** and **Prettier** install `eslint-config-prettier`.

```shell
npm i -D eslint-config-prettier
```

Extend your `.eslintrc` config.

```js
{
  "extends": ["eslint:recommended", "eslint-config-prettier"]
}
```

You can **validate** that your project is in good state.

```json
"scripts": {
  "build": "babel src --out-dir dist",
  "lint": "eslint --ignore-path .gitignore .",
  "prettier": "prettier --ignore-path .gitignore \"**/*.+(js|json)\"",
  "format": "npm run prettier -- --write",
  "check-format": "npm run prettier -- --list-different",
  "validate": "npm run check-format && npm run lint && npm run build"
}
```

```shell
npm run validate
```

**TypeScript** helps you catch bugs at the compile-time instead of having them occurring at runtime.

```shell
npm i -D typescript
```

You can set options for the **TypeScript** compiler inside **tsconfig.json** for example if you want **Babel** to transpile your **JavaScript** and use **TypeScript** only for type checking.

```json
{
  "compilerOptions": {
    "noEmit": true,
    "baseUrl": "./src"
  }
}
```

You can run the **TypeScript** compiler.

```shell
npx tsc
```

You can add **TypeScript** to your validation.

```json
"scripts": {
  "build": "babel src --extensions .js,.ts,.tsx --out-dir dist",
  "lint": "eslint --ignore-path .gitignore --ext .js,.ts,.tsx .",
  "check-types": "tsc",
  "prettier": "prettier --ignore-path .gitignore \"**/*.+(js|json|ts|tsx)\"",
  "format": "npm run prettier -- --write",
  "check-format": "npm run prettier -- --list-different",
  "validate": "npm run check-types && npm run check-format && npm run lint && npm run build"
}
```

If you're using **Babel** to compile **TypeScript** you need `@babel/preset-typescript`.

```shell
npm i -D @babel/preset-typescript
```

Update your **.babelrc** file.

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "10"
        }
      }
    ],
    "@babel/preset-typescript"
  ]
}
```

**Husky** can be used to validate code before you can commit it by adding a **pre-commit** hook. The **hooks** directory is built into **git** and it's going to run that **pre-commit** script.

```shell
npm i -D husky
```

Inside of your `.huskyrc` file.

```json
{
  "hooks": {
    "pre-commit": "npm run validate"
  }
}
```

**lint-staged** can automate linting for us if the person commiting the code doesn't have it set up.

```shell
npm i -D lint-staged
```

Inside your `.lintstagedrc` file.

```json
{
  "*.+(js|ts|tsx)": ["eslint"],
  "**/*.+(js|json)": ["prettier --write", "git add"]
}
```

Update your `.huskyrc` file.

```json
{
  "hooks": {
    "pre-commit": "npm run check-types lint-staged && npm run build"
  }
}
```

You can use `npm-run-all` to run all your validation in parallel.

```shell
pnpm i -D npm-run-all
```

```json
"scripts": {
  "validate": "npm-run-all --parallel check-types check-format lint build"
}
```

## Mocking

**Mocking** is a general idea of erasing the actual implementation of a function that's doing something like a payment request and making your tests more determinstic.

```js
test('returns winner', () => {
  let originalGetWinner = utils.getWinner

  // monkey patching `getWinner`
  utils.getWinner = (p1, p2) => p1

  let winner = thumbWar('React', 'Svelte')

  expect(winner).toBe('React')

  // cleanup after yourself to not impact other tests
  utils.getWinner = originalGetWinner
})
```

You could break the implementation but your test wouldn't catch that.

You can use the `jest.fn` mock function instead to catch the mistake.

```js
// breaking the implementation
let winner = utils.getWinner(player1)
```

```js
test('returns winner', () => {
  let originalGetWinner = utils.getWinner

  utils.getWinner = jest.fn((p1, p2) => p1)

  let winner = thumbWar('React', 'Svelte')

  expect(winner).toBe('React')
  expect(utils.getWinner).toHaveBeenCalledTimes(2)
  expect(utils.getWinner).toHaveBeenCalledWith('React', 'Svelte')
  expect(utils.getWinner).toHaveBeenNthCalledWith(1, 'React', 'Svelte')
  expect(utils.getWinner).toHaveBeenNthCalledWith(2, 'React', 'Svelte')

  utils.getWinner = originalGetWinner
})
```

You can use `jest.mock` to mock an entire module because **Jest** is in control of the whole module system.

```js
jest.mock('../utils', () => {
  return {
    getWinner: jest.fn((p1, p2) => p1),
  }
})

test('returns winner', () => {
  let winner = thumbWar('React', 'Svelte')

  expect(winner).toBe('React')
  expect(utils.getWinner.mock.calls).toEqual([
    ['React', 'Svelte'],
    ['React', 'Svelte'],
  ])

  utils.getWinner.mockReset()
})
```

You can place your mocks in a `__mocks__` directory if you're going to use it in multiple files.

```js
// __mocks__/utils.js
module.exports = {
  getWinner: jest.fn((p1, p2) => p1),
}
```

```js
// __tests__/mock.test.js
jest.mock('../utils')
```

**Jest** is going to pick up the mock file.
