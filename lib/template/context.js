function show(pageName, params) {
  if (typeof pageName != 'undefined') {
    currentRoute.pageName = pageName
    currentRoute.params = params || {}
  }

  const template = _templates[currentRoute.pageName]
  const html = template({
    ..._helpers,
    state,
    params: currentRoute.params,
  })
  _container.innerHTML = html
}

function helper(name, handler) {
  _helpers[name] = handler
}

function saveState() {
  localStorage.setItem('rush-state', JSON.stringify(state))
}

function loadState() {
  const newStateString = localStorage.getItem('rush-state')

  if (newStateString) {
    try {
      state = JSON.parse(newStateString)
      return true
    } catch (e) {
      return false
    }
  } else {
    return false
  }
}

function on(event, selector, handler) {
  const callback = function (e) {
    const elem = e.target.closest(selector)
    // returns null if no matching parentNode is found
    if (elem) {

      const data = Object.assign({}, e.target.dataset)

      const syntheticEvent = {
        data,
        target: elem,
        nativeEvent: e
      }

      switch (event) {
        case 'click':
          handler({
            ...syntheticEvent,
            x: e.clientX,
            y: e.clientY
          })
          break
        case 'change':
          handler({
            ...syntheticEvent,
            value: e.target.value
          })
          break
        default:
          handler(syntheticEvent)
      }

    }
  }

  _container.addEventListener(event, callback, false)
  _listeners.push([event, callback])
}

let _listeners = []

let currentRoute = {
  pageName: undefined,
  params: {}
}

let state = {}

let _oldState, _oldRoute

const _container = document.getElementById('app')

let _helpers = {}

const _templates = {}