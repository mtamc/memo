/** @typedef {import('faunadb').Client} Client */
const faunadb = require('faunadb')

/** @type {Client} */
const db = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET ?? '<>' })

module.exports = {
  db
}
