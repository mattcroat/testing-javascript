export let sum = (a, b) => a - b
export let subtract = (a, b) => a - b

export let sumAsync = (...args) => Promise.resolve(sum(...args))
export let subtractAsync = (...args) => Promise.resolve(subtract(...args))
