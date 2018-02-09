function show(pageName, params) {
  if (typeof pageName != 'undefined') {
    currentRoute.pageName = pageName
    currentRoute.params = params || {}
  }

  const template = _templates[currentRoute.pageName]
  const context = Object.assign({}, _helpers, {state: state, params: currentRoute.params})
  const html = template(context)

  _container.innerHTML = html
}

function helper(name, handler) {
  _helpers[name] = handler
}

function saveState() {
  localStorage.setItem('rush-state', JSON.stringify(state))
  _log('Saved state')
}

function loadState() {
  const newStateString = localStorage.getItem('rush-state')

  if (newStateString) {
    _log('Loaded saved state')
    try {
      state = JSON.parse(newStateString)
      return true
    } catch (e) {
      _log('Failed to load saved state')
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
          handler(
            Object.assign(
              syntheticEvent,
              {
                x: e.clientX,
                y: e.clientY
              }
            )
          )
          break
        case 'change':
          handler(
            Object.assign(
              syntheticEvent,
              {
                value: e.target.value
              }
            )
          )
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

function _log(msg) {
  console.log('[rush] ' + msg)
}