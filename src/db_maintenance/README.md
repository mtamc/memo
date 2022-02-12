# Maintaining the database

## You need an .env file

In order to use the scripts in this folder, you need
to create a `.env` file in this folder containing
`FAUNADB_SERVER_SECRET=...`
Get a FaunaDB secret from Tam or from the dashboard

## Fixing incorrect values on every entry (minimal example)

```js
#!/usr/bin/env node
// ^ Optional shebang, if you include it then
// after running `chmod +x filename.js` you
// can run it with `./filename.js` instead of
// `node filename.js`

require('dotenv').config()
const fs = require('fs')
const { _findAllInCollection } = require('../api/utils/db/unsafe_functions')
const { updateMany } = require('./utils')

// This is an IIFE, it allows us to use await for ergonomics
// `;(async () => {})()`
// is equivalent to
// `const foobar = async () => {}; foobar()`

;(async () => {
  // If you only need to process one collection then remove the
  // for loop, or change the array elements to whatever you need
  for (const collection of ['books', 'games', 'tvShows', 'films']) {
    const works = (await _findAllInCollection(collection)).data
    // works = a collection of elements with the following shape: {
    //  ref: { // simplified
    //     id: string
    //   },
    //   data: {
    //     // content of the document here
    //   }
    // }

    // HIGHLY recommended: make a backup of the collection
    // before performing risky destructive operations on it
    fs.writeFileSync(
      `../../../backup_${collection}_${new Date().toISOString()}.json`,
      JSON.stringify(works)
    )

    // Create a variable that mirrors `works`, except it's fixed,
    // and unchanged properties are *not* included.
    // You can include the unchanged properties if you want,
    // but that will waste DB resources.
    // However, always include the `ref` object, see below
    const fixed =
      works.map((w) => ({
        ref: w.ref,
        data: { // documents have their actual content inside a 'data' prop
          apiRefs: w.data.apiRefs?.map(({ name, ref }) => `${name}__${ref}`)
        }
      }))

    // Utility function you can just use by providing a fixed list
    // that mirrors `works` but is fixed.
    updateMany(fixed)
  }
})()
```

## Restoring a backup (minimal example)

```js
require('dotenv').config()
const fs = require('fs')
const { createManyFromBackup, deleteAllEntries } = require('./utils')

const backups = [
  './backup_bookEntries_2022-02-04T16:04:00.514Z.json',
  './backup_filmEntries_2022-02-04T16:03:58.480Z.json',
  './backup_tvShowEntries_2022-02-04T16:03:56.862Z.json',
  './backup_gameEntries_2022-02-04T16:03:59.989Z.json',
]

;(async () => {
  // Uncomment this if you want to wipe out the database
  // await deleteAllEntries()

  for (const backup of backups) {
    const entries = JSON.parse(fs.readFileSync(backup))
    updateMany(entries)

    // Use this instead if you wiped out the database
    // createManyFromBackup(entries)
  }
})()
```

FaunaDB updates are *partial*, meaning that if you want to delete
fields from documents, you might need to wipe out the collection first.
You might also want to wipe out the database first if you want to delete
entries which are not in the backup.
