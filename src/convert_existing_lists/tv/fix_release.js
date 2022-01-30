const fs = require('fs')
const entries = JSON.parse(fs.readFileSync('./good3.json'))

const goodEntries = entries.map(e => {
  return {
    ...e,
    commonMetadata: {
      ...e.commonMetadata,
      releaseYear: e.commonMetadata.releaseYear ? parseInt(e.commonMetadata.releaseYear) || undefined : undefined
    }
  }
})

fs.writeFileSync('good4.json', JSON.stringify(goodEntries, null, 2))
