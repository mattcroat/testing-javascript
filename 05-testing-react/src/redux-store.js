import { createStore } from 'redux'
import { reducer } from './redux-reducer'

export let store = createStore(reducer)
