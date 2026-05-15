# Totos — NestJS REST API

A NestJS REST API with JWT authentication, Prisma ORM (PostgreSQL), and file upload support.

---

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in the values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nest_course"
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
```

---

## Running the server

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run start:prod
```

API is available at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api`

---

## Prisma (like Django's ORM commands)

| Django | NestJS / Prisma | Description |
|---|---|---|
| `makemigrations` | `npx prisma migrate dev --name <name>` | Create and apply a new migration |
| `migrate` | `npx prisma generate` | Regenerate the Prisma client after schema changes |
| `dbshell` | `npx prisma studio` | Open a visual DB browser at `localhost:5555` |

```bash
# Create a migration (after editing prisma/schema.prisma)
npx prisma migrate dev --name add_user_table

# Regenerate Prisma client (run after every schema change)
npx prisma generate

# Open visual database browser
npx prisma studio

# Reset the database (drops all data — dev only!)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Push schema changes without creating a migration file (prototyping only)
npx prisma db push
```

---

## NestJS code generation (like Django's startapp)

```bash
# Generate a full resource: module + controller + service + DTOs + spec files
nest g resource name

# Generate individual pieces
nest g module name
nest g controller name
nest g service name

# Generate without creating spec (test) files
nest g resource name --no-spec
```

> `nest g resource` is the equivalent of Django's `startapp` — it scaffolds everything at once and registers the module automatically.

---
