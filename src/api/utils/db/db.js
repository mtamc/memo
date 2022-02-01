/** @typedef {import('faunadb').Client} Client */
const faunadb = require('faunadb')
const { throwIt } = require('../general')

/** @type {Client} */
const db = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET ?? throwIt('FAUNADB_SERVER_SECRET is not set!!!')
})

module.exports = {
  db
}
