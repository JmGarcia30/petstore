# Deployment notes (Render)

Recommended Render setup:

- Provision a free PostgreSQL instance on Render and copy its connection URL into `SPRING_DATASOURCE_URL`, username and password env vars.
- Create a Web Service on Render for the backend; build using Maven and set `PORT` to `10000` or leave default. Ensure Flyway runs during startup.
- Create a Static Site on Render for the frontend; build with `npm run build` and publish the `dist` directory (Vite builds to `dist`).

Environment variables (backend):
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
