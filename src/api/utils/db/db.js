/** @typedef {import('faunadb').Client} Client */
const faunadb = require('faunadb')
const { throwIt } = require('../general')

const LOG_READ_OPS = false

let totalReadOps = 0

/** @type {Client} */
const db = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET ?? throwIt('FAUNADB_SERVER_SECRET is not set!!!'),
  observer: (res) => {
    if (LOG_READ_OPS) {
      totalReadOps = totalReadOps + (parseInt(res?.responseHeaders?.['x-read-ops']) || 0)
      console.log(`readops so far: ${totalReadOps}`)
    }
  }
})

module.exports = {
  db
}
