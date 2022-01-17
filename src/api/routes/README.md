This folder contains the Netlify functions.
They can be called at `{BASE_URL}/api/file_basename`.
They simply define routes and defer logic to
the functions inside the `api/controllers` folder.

## Note

Serverless functions MUST fulfill at least one
of the following conditions, or they will throw in production.

- Be async
- Possess two parameters named `event` and `context`
