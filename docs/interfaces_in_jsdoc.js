// Interfaces can be used in JSDoc with the following syntax
// They can also be imported just by requiring the file they come from

/**
 * @typedef User
 * @type {object}
 * @property {string} id   - an ID.
 * @property {string} name - your name.
 * @property {number} age  - your age.
 */

/** @type {User} */
const tam = {
  id: 5, // 'number' is not assignable to type 'string' (using jsconfig.json)
  name: "tam",
  number: 25,
}

/** @type {User} */
const nil = {
  id: '6',
  name: "nil",
  number: 29, // 'number' does not exist in type 'User' (after fixing first error)
}
