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

## Configure Jest

```shell
npm i -D jest babel-jest @babel/core @babel/preset-env
```

**Jest** picks up the **Babel** config automatically.

```js
// babel.config.js
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
}
```

```json
{
  "scripts": {
    "test": "jest",
    "validate": "npm run lint && npm run test && npm run build"
  }
}
```

You can simulate the browser environment in **Node** using `jsdom`.

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
}
```

You can use `@test-library` to test components.

```shell
npm i -D @test-library/react
```

Use `debug` from `@testing-library` to see the HTML output.

```js
import { render } from '@testing-library/react'

import Component from './Component'

test('renders', () => {
  let { debug } = render(<AutoScalingText />)
  debug()
})
```

**Snapshot** tests return a serialized value of your tree and store a snapshot that can be compared on subsequent test runs to catch unexpected changes.

```js
test('returns super heros that can fly', () => {
  let flyingHeros = getFlyingSuperHeros()
  expect(flyingHeros).toMatchInlineSnapshot(`
Array [
  Object {
    "name": "Dynaguy",
    "powers": Array [
      "disintegration ray",
      "fly",
    ],
  },
  Object {
    "name": "Apogee",
    "powers": Array [
      "gravity control",
      "fly",
    ],
  },
  Object {
    "name": "Jack-Jack",
    "powers": Array [
      "shapeshifting",
      "fly",
    ],
  },
]
`)
```

You can run `npm test -- -u` or `jest -u` to update snapshots.

```js
test('renders', () => {
  let { container } = render(<Component />)
  expect(container).toMatchInlineSnapshot()
})
```

You can use `@testing-library/jest-dom` to add some nice assertions for you.

```js
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Calculator from '../calculator'

test('the clear button switches from AC to C when there is an entry', () => {
  let { getByText } = render(<Calculator />)
  let clearButton = getByText('AC')

  fireEvent.click(getByText(/3/))
  expect(clearButton).toHaveTextContent('C')

  fireEvent.click(clearButton)
  expect(clearButton).toHaveTextContent('AC')
})
```

You could have it run before any of your tests.

```js
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
}
```

Use `jest --watch` to watch for changes.

```json
{
  "scripts": {
    "test:watch": "jest --watch"
  }
}
```

**Code coverage** helps show how much of your project is tested and where you could use help adding new tests.

```json
{
  "scripts": {
    "test": "jest --coverage"
  }
}
```

```js
// jest.config.js
module.exports = {
  collectCoverageFrom: ['**/src/**/*.jsx'],
}
```

## Testing React

```js
test('render a number input with a label "Favorite Number"', () => {
  let div = document.createElement('div')
  ReactDOM.render(<FavoriteNumber />, div)
  expect(div.querySelector('input').type).toBe('number')
  expect(div.querySelector('label').textContent).toBe('Favorite Number')
})
```

Use `@testing-library/jest-dom` for testing assertions on the DOM.

```shell
npm i -D @testing-library/jest-dom
```

```js
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
}
```

```js
import { render } from '@testing-library/react'

test('render a number input with a label "Favorite Number"', () => {
  let { getByLabelText } = render(<FavoriteNumber />)
  let input = getByLabelText(/favorite number/i)
  expect(input).toHaveAttribute('type', 'number')
})
```

Use `debug` to get a view of your DOM or look at a specific DOM node. It defaults to the container.

```js
test('render a number input with a label "Favorite Number"', () => {
  let { getByLabelText, debug } = render(<FavoriteNumber />)
  debug()

  let input = getByLabelText(/favorite number/i)
  expect(input).toHaveAttribute('type', 'number')
  debug(input)
})
```

Use `fireEvent` to fire event listeners.

```js
import { fireEvent, render } from '@testing-library/react'

test('entering an invalid value shows an error message', () => {
  let { getByLabelText, getByRole } = render(<FavoriteNumber />)
  let input = getByLabelText(/favorite number/i)

  fireEvent.change(input, { target: { value: '10' } })

  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)
})
```

You can improve your test confidence with `@testing-library/user-event` to resemble more how your user would use your software.

```js
import { render } from '@testing-library/react'
import user from '@testing-library/user-event'

test('entering an invalid value shows an error message', () => {
  let { getByLabelText, getByRole } = render(<FavoriteNumber />)
  let input = getByLabelText(/favorite number/i)

  user.type(input, '10')

  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)
})
```

If you need to rerender a component with new props use `rerender`.

```js
import { render } from '@testing-library/react'
import user from '@testing-library/user-event'

test('entering an invalid value shows an error message', () => {
  let { getByLabelText, getByRole, rerender } = render(<FavoriteNumber />)
  let input = getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)

  rerender(<FavoriteNumber max={10} />)
})
```

Any `get` query prefix is going to throw an element if it's not matching but if that's your intended outcome use the `query` prefix instead to verify an element is not being rendered.

```js
test('entering an invalid value shows an error message', () => {
  let { getByLabelText, getByRole, queryByRole, rerender } = render(
    <FavoriteNumber />
  )

  let input = getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)

  rerender(<FavoriteNumber max={10} />)
  expect(queryByRole('alert')).toBeNull()
})
```

You can use `jest-axe` to help with accessibility testing.

```shell
npm i -D jest-axe
```

```js
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import 'jest-axe/extend-expect'

function Form() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" placeholder="email" />
    </form>
  )
}

test('the form is accessible', async () => {
  let { container } = render(<Form />)
  let results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

```js
// jest.config.js
module.exports = {
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    'jest-axe/extend-expect',
  ],
}
```

It's a good idea to mock a module that does **HTTP** requests.

```js
import { fireEvent, render, waitFor } from '@testing-library/react'

import { GreetingLoader } from '../greeting-loader-01-mocking'
import { loadGreeting as mockLoadGreeting } from '../api'

jest.mock('../api')

test('loads greetings on click', async () => {
  let testGreeting = 'TEST_GREETING'

  mockLoadGreeting.mockResolvedValueOnce({
    data: {
      greeting: testGreeting,
    },
  })

  let { getByLabelText, getByText } = render(<GreetingLoader />)

  let nameInput = getByLabelText(/name/i)
  let loadButton = getByText(/load/i)

  nameInput.value = 'Mary'
  fireEvent.click(loadButton)

  expect(mockLoadGreeting).toHaveBeenCalledWith('Mary')
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)

  await waitFor(() =>
    expect(getByLabelText(/greeting/i)).toHaveTextContent(testGreeting)
  )
})
```

It's useful to mock things when you would otherwise have to wait for to finish like animations.

```js
import { fireEvent, render, waitFor } from '@testing-library/react'

jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props) => (props.in ? props.children : null),
  }
})

test('shows hidden message when toggle is clicked', () => {
  let myMessage = 'hello world'
  let { getByText, queryByText } = render(
    <HiddenMessage>{myMessage}</HiddenMessage>
  )

  let toggleButton = getByText(/toggle/i)
  expect(queryByText(myMessage)).not.toBeInTheDocument()

  fireEvent.click(toggleButton)
  expect(getByText(myMessage)).toBeInTheDocument()

  fireEvent.click(toggleButton)
  expect(queryByText(myMessage)).not.toBeInTheDocument()
})
```

Writing your tests ahead of time to drive your code is also known as **test driven development** or the "red, green, refactor" cycle where you first write a failing test and then create code that's necessary to make that test pass.

```js
import { render } from '@testing-library/react'

test('renders a form with title, content, tags, and a submit button', () => {
  let { getByLabelText, getByText } = render(<Editor />)
  getByLabelText(/title/i)
  getByLabelText(/content/i)
  getByLabelText(/tags/i)
  getByText(/submit/i)
})
```

When you have any test data it's a great idea to generate that data.

```shell
npm i -D test-data-bot
```

```js
test('renders a form with title, content, tags, and a submit button', () => {
  let fakeUser = { id: 'user-1' }
  let fakePost = {
    title: 'Test Title',
    content: 'Test content',
    tags: ['tag1', 'tag2'],
  }

  render(<Editor user={fakeUser} />)

  getByLabelText(/title/i).value = fakePost.title
  getByLabelText(/content/i).value = fakePost.content
  getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  getByText(/submit/i)
})
```

```js
import { build, fake, sequence } from 'test-data-bot'

let userBuilder = build('User').fields({
  id: sequence((s) => `user-${s}`),
})

let postBuilder = build('Post').fields({
  title: fake((f) => f.lorem.words()),
  content: fake((f) => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake((f) => [f.lorem.words(), f.lorem.words(), f.lorem.words()]),
})

test('renders a form with title, content, tags, and a submit button', async () => {
  let fakeUser = userBuilder()
  let fakePost = postBuilder()

  render(<Editor user={fakeUser} />)

  getByLabelText(/title/i).value = fakePost.title
  getByLabelText(/content/i).value = fakePost.content
  getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  getByText(/submit/i)
})
```

Simplify your tests by abstracting reusable code.

```js
function renderEditor() {
  let fakeUser = userBuilder()
  let fakePost = postBuilder()

  let utils = render(<Editor user={fakeUser} />)

  utils.getByLabelText(/title/i).value = fakePost.title
  utils.getByLabelText(/content/i).value = fakePost.content
  utils.getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  let submitButton = utils.getByText(/submit/i)

  return {
    ...utils,
    submitButton,
    fakeUser,
    fakePost,
  }
}
```

Testing routes in your app.

```js
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fireEvent, render as rtlRender } from '@testing-library/react'

import { Main } from '../main'

function render(
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Router history={history}>{children}</Router>
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    history,
  }
}

test('main renders about and home and I can navigate to those pages', () => {
  let { getByRole, getByText } = render(<Main />)

  expect(getByRole('heading')).toHaveTextContent(/home/i)
  fireEvent.click(getByText(/about/i))
  expect(getByRole('heading')).toHaveTextContent(/about/i)
})

test('landing on a bad page shows no match component', () => {
  let { getByRole } = render(<Main />, {
    route: '/something-that-does-not-match',
  })

  expect(getByRole('heading')).toHaveTextContent(/404/i)
})
```

Testing a custom **React** hook.

```js
import { renderHook, act } from '@testing-library/react-hooks'

test('exposes the count and increment/decrement functions', () => {
  let { result } = renderHook(useCounter)

  expect(result.current.count).toBe(0)

  act(() => result.current.increment())
  expect(result.current.count).toBe(1)

  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('allows customization of the initial count', () => {
  let { result } = renderHook(useCounter, { initialProps: { initialCount: 3 } })
  expect(result.current.count).toBe(3)
})

test('allows customization of the step', () => {
  let { result } = renderHook(useCounter, { initialProps: { step: 2 } })

  expect(result.current.count).toBe(0)

  act(() => result.current.increment())
  expect(result.current.count).toBe(2)

  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('the step can be changed', () => {
  let { result, rerender } = renderHook(useCounter, {
    initialProps: { step: 3 },
  })

  expect(result.current.count).toBe(0)

  act(() => result.current.increment())
  expect(result.current.count).toBe(3)

  rerender({ step: 2 })

  act(() => result.current.decrement())
  expect(result.current.count).toBe(1)
})
```
