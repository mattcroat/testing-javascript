import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from '@emotion/react'
import { Link } from '@reach/router'
import Calculator from './calculator'
import * as themes from './themes'

export default function App({ user, logout }) {
  let [theme, setTheme] = React.useState('dark')
  let handleThemeChange = ({ target: { value } }) => setTheme(value)

  return (
    <ThemeProvider theme={themes[theme]}>
      <Calculator />
      <div style={{ marginTop: 30 }}>
        <fieldset>
          <legend>Theme</legend>
          <label>
            <input
              onChange={handleThemeChange}
              checked={theme === 'light'}
              type="radio"
              name="theme"
              value="light"
            />{' '}
            light
          </label>
          <label>
            <input
              onChange={handleThemeChange}
              checked={theme === 'dark'}
              type="radio"
              name="theme"
              value="dark"
            />{' '}
            dark
          </label>
        </fieldset>
      </div>
      <div
        css={{
          display: 'flex',
          marginTop: 10,
          marginBottom: 10,
          justifyContent: 'space-around',
        }}
      >
        {user ? (
          <>
            <div data-testid="username-display">{user.username}</div>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </ThemeProvider>
  )
}

App.propTypes = {
  user: PropTypes.any,
  logout: PropTypes.func,
}
