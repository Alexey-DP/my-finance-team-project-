# Deploy on Heroku: https://obscure-hollows-77176.herokuapp.com/

# PERSONAL ASSETS MANAGEMENT APP

Project description

---

#### For Windows users:

- WSL is mandatory for running this project.

- Project is to be cloned to WSL disk.
  If you're seeing `/mnt/` path prefix in your terminal it means the project **isn't** on the WSL disk.
  **This is required for hot reloading with docker**.

---

#### 0.1. What's shipped with this boilerplate?

- React (CRA) + NestJS applications
- Configured TypeORM for PostgreSQL
- Tailwind
- React Redux
- React Router
- docker-compose

#### 0.2. Reference

- [Backend folder structure](./docs/backend.md)
- [Frontend folder structure](./docs/frontend.md)
- shared is a directory where common code is located in order to avoid duplication.
  It's symlinked into backend and frontend during project initiazation.

---

#### 1. Project init

- Run `npm run symlink-shared` after git clone.

---

#### 2. Bootstrap project using Docker Compose

- To build (rebuild) `docker-compose --env-file=.env.dev up -d --build`
- To start without building `docker-compose --env-file=.env.dev up -d`
- To stop `docker-compose --env-file=.env.dev down`

Migrations

- To run in docker `docker exec -it backend bash`

- To show all migrations `npm run migration:show`
- To create migration `npm run migration:create --name=[migration name]`
- To generate migration `npm run migration:generate --name=[migration name]`
- To run migrations `npm run migration:run`
- To revert migrations `npm run migration:revert`
- To run database seeding `npm run seed:run`

- To exit docker `exit`
