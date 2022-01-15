const responses = require('../utils/responses')
exports.handler = async (event, context) => responses.ok(JSON.stringify(context.clientContext))
