
const fs = require('fs')
const entries = JSON.parse(fs.readFileSync('./converted2.json'))

const goodEntries = entries.map(e => {
  let entry = e
  if (e.completedDate) {
    const cmpl = new Date(e.completedDate)
    cmpl.setFullYear(cmpl.getFullYear()-8000)
    entry = {
      ...entry,
      completedDate: cmpl.getTime()
    }
  }

  if (e.startedDate) {
    const strt = new Date(e.startedDate)
    strt.setFullYear(strt.getFullYear()-8000)
    entry = {
      ...entry,
      startedDate: strt.getTime()
    }
  }

  return e
})

fs.writeFileSync('good2.json', JSON.stringify(goodEntries, null, 2))
