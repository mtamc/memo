const fs = require('fs')
const faunadb = require('faunadb')
const db = new faunadb.Client({ secret: 'fnAEeModafACS3_A9MB2qEPCBUIjGJFd54ic5RbP' })
const q = faunadb.query
const {
  Get,
  Ref,
  Collection,
  Create,
  Match,
  Index,
  Var,
  Paginate,
  Documents,
  Lambda,
  Update,
  Delete,
} = q

const entries = JSON.parse(fs.readFileSync('./tv/good2.json'))

db.query(
  q.Map(
    entries,
    Lambda(
      "entry",
      Create(Collection("tvShowEntries"), { data: Var("entry") })
    )
  )
)
  .then(console.log)
  .catch(console.warn)


// const at = (collection, field) => Index(`${collection}__${field}`)
// const lambdaGet = Lambda((x) => Get(x))
// const findAllUnpaginated = (set) =>
  // db.query(q.Map(Paginate(set, { size: 100000 }), lambdaGet))
    // .then(console.log)

//findAllUnpaginated(Documents(Collection('filmEntries')))

//findAllUnpaginated(Match(Index('filmEntries__userId'), '860bf30e-497f-4e00-9304-160bf0e5e306'))

