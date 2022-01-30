const fs = require('fs')
const entries1 = JSON.parse(fs.readFileSync('./converted2.json'))
const entries2 = JSON.parse(fs.readFileSync('./converted_towatch2.json'))
const entries = [...entries1, ...entries2]

const goodEntries = entries.map(e => ({
  ...e,
  score: parseInt(e.score) || undefined
}))

fs.writeFileSync('good.json', JSON.stringify(goodEntries, null, 2))
