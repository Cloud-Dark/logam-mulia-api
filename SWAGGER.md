# Swagger (OpenAPI) Documentation

This project now registers Swagger UI (via Fastify plugins) when running in non-production environments.

- Local URL: http://localhost:3000/docs
- JSON (OpenAPI): http://localhost:3000/documentation/json

Quick steps to try locally:

1. Install new dependencies:
   - npm install
2. Start in dev mode:
   - npm run dev
3. Open your browser at http://localhost:3000/docs

Notes:
- The code registers `@fastify/swagger` and `@fastify/swagger-ui` in `src/main.ts` only when `NODE_ENV !== 'production'`.
- If you want Swagger enabled in production, change the condition in `src/main.ts` accordingly.
- This project uses Fastify. The OpenAPI document is served at `/documentation/json` and the interactive UI at `/docs`.

If you'd like, I can also add a README section linking to this file and/or run `npm install` for you in the container.