# Memo component tutorial

Memo uses a homemade minimalistic component system.

A component possesses content (HTML), style (CSS) and an initializer (JS
function). Style and initializer are optional.

This is a modern approach that goes against web 2.0
"separation of concern".

Read more about Component Based Architecture: https://medium.com/@dan.shapiro1210/understanding-component-based-architecture-3ff48ec0c238

Or about React, the king of CBAs: https://reactjs.org/docs/hello-world.html

With this approach, a component is a self-contained unit which
contains all the code that pertains to itself. You don't
need to go find its HTML, then its CSS, then its JS.

```js
const { initComponent } = Components
const { html } = Utils

const MyComponent = () => initComponent({
  content: () => html`
    <div class="my-component">Hi!</div>
  `,
  initializer: () => {
    $('.my-component').click(() => alert("You've clicked on MyComponent!"))
  },
  style: () => css`
    .my-component {
      color: red;
    }
  `
})
```

What if you want the initializer to target the individual instance
of the component? With the current approach, if you use MyComponent
multiple times in your page your initializer can only target
every instance of `.my-component`, every time.

Well, you may have noticed that `content`, `initializer` and `style` are
functions. These functions may use the `id` parameter, which is a unique
CSS id that will be different for every instance of the component.


```js
const MyComponent = () => initComponent({
  content: ({ id }) => html`
    <div id="${id}-container" class="my-component">
      <span id="${id}">Hi!</span>
    </div>
  `,
  initializer: ({ id }) => {
    $(`#${id}`.click(() => {
      alert(`You've clicked on MyComponent! Specifically, on its instance ${id}`)
    }))

    $(`#${id}-container`) // Doing something with the container
  },
  style: ({ id }) => css`
    // Not sure what you need it for, but you can use it => ${id}
    .my-component {
      color: red;
    }
  `
})
```

How to include a component inside another? Well, the `content` function
may also use an `include` parameter, which is used in this way:

```js
const MyComponent = () => initComponent({
  content: ({ include }) => html`
    <div>
      <h1>My Component!</h1>
      ${include(Menu('john'))}
    </div>
  `
})

const Menu = (username) => initComponent({
  content: () => html`
    <ul>
      <li> Your name is: ${username} </li>
      <li> Home </li>
      <li> About </li>
    </ul>
  `,
})
```

The magic of the `include` function is that if your child component
contains an initializer, it will automatically be added to the
parent component's initializer.

Last piece of advice. If `username` happens to be inside a promise
(for example if you have to fetch it from the network), I wrote
a helper to use this data declaratively (rather than manually
writing an initializer that edits the DOM when the data is ready):

```js
const { initComponent, WithRemoteData } = Components

const getUserName = () =>
  Promise.resolve('john') // Or get 'john' from the network

const MyComponent = () => initComponent({
  content: ({ include }) => html`
    <div>
      <h1>My Component!</h1>
      ${include(
        WithRemoteData({
          remoteData: getUserName(),
          component: (name) => Menu(name))
        })}
    </div>
  `
})
```

This will automatically:
- Display a loading animation while the data promise is unfulfilled
- Show an error if the promise was rejected
- Replace the loading animation with `Menu('john')` once the promise is
    fulfilled.

For a more imperative approach, you can use the `setContent` helper.


```js
const { setContent } = Components

setContent(selector, Component())
```

