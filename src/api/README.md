# API

## Important difference between local server and netlify production

Serverless functions MUST fulfill at least one of the following conditions, or they will throw in production.

- Be async
- Possess two parameters named `event` and `context`
