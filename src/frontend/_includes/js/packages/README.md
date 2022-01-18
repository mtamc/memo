This folder contains NPM modules which have been browserified.
For example, the following code turns `index.cjs` into a
`neverthrow.js` file which binds the module's exports to
a global (window) object called NT.

```
browserify index.cjs.js -o neverthrow.js --standalone NT
```

It can then be used in browser JS like this:

```js
// if neverthrow exports a function called `okAsync`
NT.okAsync('blablabla')
```

If both an ES6 and CommonJS (CJS) version of the module exists,
ensure you browserify the CommonJS version.
