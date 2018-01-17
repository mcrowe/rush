function show(pageName, params) {
  if (typeof pageName != 'undefined') {
    _route.pageName = pageName
    _route.params = params || {}
  }

  const template = _templates[_route.pageName]
  const html = template({
    ..._helpers,
    state,
    params: _route.params,
  })
  _container.innerHTML = html
}

function helper(name, handler) {
  _helpers[name] = handler
}

function on(event, selector, handler) {
  const callback = function (e) {
    const elem = e.target.closest(selector)
    // returns null if no matching parentNode is found
    if (elem) {

      const data = Object.assign({}, e.target.dataset)

      switch (event) {
        case 'click':
          handler(elem, {
            data,
            x: e.clientX,
            y: e.clientY,
            nativeEvent: e
          })
          break
        case 'change':
          handler(elem, {
            data,
            value: e.target.value,
            nativeEvent: e
          })
          break
        default:
          handler(elem, { nativeEvent: e })
      }

    }
  }

  _container.addEventListener(event, callback, false)
  _listeners.push([event, callback])
}

let _listeners = []

let _route = {
  pageName: undefined,
  params: {}
}

let state = {}

let _oldState, _oldRoute

const _container = document.getElementById('app')

let _helpers = {}

const _templates = {}