const dbError = (context) => ({ error: 'DBError', context })

const reqError = (context) => ({ error: 'RequestError', context })

module.exports = {
  dbError,
  reqError
}
