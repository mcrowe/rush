# Rush

Rush is a front-end JavaScript framework for building apps quickly. It is optimized for development speed and ease of learning.

## Getting Started

Install Rush using the following command in your terminal:

> npm install -g @mcrowe/rush

Now you can create a new app called "my-app" like this:

> rush new my-app

This creates a new directory, change into that directory and run your new app:

> cd my-app
> rush start

Finally, follow the instructions output by the server to open the app in your browser.

The best way to get started is to open the generated application directory in your code editor and see what is there, and play around to see what you can do.

## The Basics

A Rush application has the following components:

- **app.js**: A JavaScript file that contains the main logic of your application.
- **pages/**: A directory containing `.ejs` templates for each page. See [ejs.co](http://ejs.co/) for more details on `.ejs`
- **styles/**: A directory containing css styles. You can add any number of stylesheet files. They will be concatenated together.

## Concepts

### Showing pages

Show a page or refresh the current page using the `show` function.

```js
// Show page a.ejs
show('a')

// Show page b.ejs with params equal to {value: 5}
show('b', {value: 5})

// Refresh the current page
show()
```

### Handling events

Handle an event on any element using the `on` function.

```js
on('click', '.fire-missiles', event => {
  // Do something when an element with class "fire-missiles"
  // is clicked
})
```

Parameters to the `on` function:

1. **event**: The name of the event to handle (e.g. 'click', 'change', 'keydown', ...).
2. **selector**: A CSS selector specifying what element(s) to handle this event on ([learn more about CSS selectors](https://www.w3schools.com/cssref/css_selectors.asp)).
3. **handler**: A function to run when this event occurs.


#### The `event` object

Event handlers are passed an event object, which has data describing the event. This data depends on the type of event.

- **target**: The target element.
- **data**: An object of data added to the target element.
- **nativeEvent**: The native JavaScript event created by the browser.
- **x** / **y**: [For mouse events only] The position of the mouse when the event happened.
- **value**: [For the "change" event only] The current value of the input element.

### State

The `state` object is how a Rush application maintains state between pages. You can set and update properties in `app.js`, and access them in your pages. Note that the view *does not* automatically update when you change the state. You need to explicitly show a page using `show` to see the changes.

For example, here is a simple application that has a counter you can increase and decrease with buttons:

**pages/home.ejs**

```html
<h1><%= state.counter %></h1>
<button class="down">-</button>
<button class="up">+</button>
```

**app.js**

```js
state.counter = 0

on('click', '.up', () => {
  state.counter += 1
  show()
})

on('click', '.down', () => {
  state.counter -= 1
  show()
})
```

### Params

You can pass an object of params to a page when you show it. This object is then available to the page using the `params` variable.

For example:

**app.js**

```js
show('home', {first: 'Mitch', last: 'Crowe'})
```

**pages/home.ejs**

```html
<p>Created by <%= params.first %> <%= params.last %>!</p>
```

### Helpers

Helpers give you a way to define helper functions you can use in your pages.

For example:

**app.js**

```js
helper('formatPercent', x => {
  return Math.floor(x * 100) + '%'
})
```

**pages/home.ejs**

```html
<p><%= formatPercent(0.53) %></p>
```

### Event Data

You can provide extra context data to an event by adding data attributes to an element. These values will be available as the `data` property on the event object.

For example:

**pages/home.ejs**

```html
<div class="item" data-id="42">Item 42</div>
```

**app.js**

```js
on('click', '.item', event => {
  console.log("You clicked item", event.data.id)
})
```

Note that html attribute values are always strings, and so the data values are strings. Use JavaScript's `parseInt` or `parseFloat` to explicity convert to numbers if that's what you want.

### Views

Views provide a way to share HTML template code between pages. They have not been implemented yet.

### Getting information about the current route

The current page and params can be accessed via the `currentRoute` variable:

```js
show('things', {id: 5})

currentRoute.pageName // => 'things'
currentRoute.params.id // => 5

```

### Saving State

You can save the state at any time by calling `saveState()`. To load a saved state, use the following pattern:

```js
// Call loadState(). It returns true if there was a saved state (and loads it),
// and false otherwise.
if (!loadState()) {
  // Initialize the state here, e.g.
  state.counter = 5
  // ...
}
```

## TODO

- Saving state
- Publishing
- Images
- Shared views


## Development

Install npm modules:

> npm install

Release a new version:

> bin/release.sh

This will publish a new version to npm, as well as push a new tag up to github.