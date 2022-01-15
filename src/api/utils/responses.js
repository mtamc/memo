const response = (statusCode) => (body) => ({ statusCode, body })

module.exports = {
  ok: response(200),
  badRequest: response(400),
  internalError: response(500),
}
