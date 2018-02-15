
state.counter = 1

helper('magicCalculation', x => {
  return x * 42
})

on('click', '.show-b', () => {
  state.counter += 1
  show('b', {value: 9})
})

on('click', '.show-a', () => {
  state.counter += 1
  show('a')
})

on('click', '.parent', event => {
  console.log('data', event.data)
})

show('a')
