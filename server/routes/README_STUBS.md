## Route implementation status

`auth.js` is **fully implemented** (`POST /register`, `POST /login`, `GET /me` under `/api/auth`). See [docs/FUNCTIONAL_REQUIREMENTS.md](../../../docs/FUNCTIONAL_REQUIREMENTS.md) §4.1.

The other route files in this folder are still **temporary stubs** created so `server/server.js` can start without `ERR_MODULE_NOT_FOUND`.

Stub behavior:

- each stub router still exposes `GET /` only
- response is a JSON stub payload (`ok`, `route`, `message`)

Next step:

- replace remaining stubs with real handlers and services (courses, lessons, enrollments, …).
