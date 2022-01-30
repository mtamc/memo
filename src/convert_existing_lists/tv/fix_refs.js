const fs = require('fs')
const entries = JSON.parse(fs.readFileSync('./good2.json'))

const goodEntries = entries.map(e => {
  return {
    ...e,
    commonMetadata: {
      ...e.commonMetadata,
      apiRefs: e.commonMetadata.apiRefs ? [e.commonMetadata.apiRefs] : [],
      externalUrls: e.commonMetadata.externalUrls ? [e.commonMetadata.externalUrls] : [],
    }
  }
})

fs.writeFileSync('good3.json', JSON.stringify(goodEntries, null, 2))
