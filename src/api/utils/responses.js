const response = (statusCode) => (body) => ({
  statusCode,
  body: JSON.stringify(body),
})

module.exports = {
  ok: response(200),
  badRequest: response(400),
  notFound: response(404),
  internalError: response(500),
}
