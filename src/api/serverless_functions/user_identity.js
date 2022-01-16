// Test file, will be deleted
const responses = require('../utils/responses')

exports.handler = async (event, context) => responses.ok(JSON.stringify(context.clientContext))

