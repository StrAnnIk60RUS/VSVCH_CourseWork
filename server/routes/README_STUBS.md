## Temporary backend stubs

The route files in this folder are temporary stubs created to allow `server/server.js`
to start without `ERR_MODULE_NOT_FOUND`.

Current behavior:
- each route exports an Express `Router`
- each route implements `GET /` only
- response is a JSON stub payload (`ok`, `route`, `message`)

Limitations:
- business logic is not implemented
- database operations are not implemented
- auth and role checks are not implemented

Next step:
- replace each stub with full route handlers and corresponding services.
