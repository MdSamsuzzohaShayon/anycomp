# Anycomp Backend

A backend service for a simplified replica of **Anycomp** — a platform for Company Registration and Management — built using **Node.js, TypeScript, Express, and PostgreSQL**.  

This project demonstrates **full-stack proficiency**, **system design**, and **clean code practices**.

[Figma Design Reference](https://www.figma.com/design/ukCEkns86j8tyJgBovg7E8/ST-Comp-Holdings--MERN-Stack-Developer---Project-assesment?m=auto&t=4S8MVyU6tufRjr4H-6)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Available Scripts](#available-scripts)
- [Modules](#modules)
  - [User Authentication](#user-authentication)
  - [Specialist Service](#specialist-service)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [License](#license)

---

## Tech Stack

- **Node.js** v24+
- **TypeScript**
- **Express.js**
- **PostgreSQL** v16.11+
- **TypeORM** (ORM for PostgreSQL)
- **JWT** for authentication
- **bcryptjs** for password hashing

---

## Project Structure

```bash
src/
├── app.ts                # Express app setup
├── server.ts             # Server startup
├── data-source.ts        # TypeORM database connection
├── config/
│   └── env.ts            # Environment variable config
├── entities/             # Database models
│   ├── User.ts
│   ├── Specialist.ts
│   ├── Media.ts
│   └── ServiceOffering.ts
├── routes/               # API routes
│   ├── user.routes.ts
│   └── specialist.routes.ts
├── controllers/          # Route handlers
│   ├── user.controller.ts
│   └── specialist.controller.ts
├── services/             # Business logic
│   ├── user.service.ts
│   └── specialist.service.ts
└── middleware/           # Authentication & authorization
    └── auth.ts
````

---

## Setup & Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd anycomp-backend
```

2. Install dependencies:

```bash
npm install
```

3. Setup PostgreSQL database (PostgreSQL 16.11+):

```sql
CREATE DATABASE anycomp;
```

4. Configure environment variables:

```env
PORT=5000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=<your_user>
DATABASE_PASSWORD=<your_password>
DATABASE_NAME=anycomp
JWT_SECRET=<your_secret>
```

5. Run the development server:

```bash
npm run dev
# or
npm run dev:tsd
```

---

## Available Scripts

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start development server with nodemon     |
| `npm run dev:tsd` | Start development server with ts-node-dev |
| `npm run build`   | Compile TypeScript to JavaScript          |
| `npm start`       | Run the compiled server                   |
| `npm run lint`    | Run ESLint for code quality               |
| `npm run format`  | Format code using Prettier                |

---

## Modules

### User Authentication

Handles **user registration, login, password reset, and change password**, with **JWT-based authentication** and **role-based authorization**.

* **Routes**: `src/routes/user.routes.ts`
* **Controller**: `src/controllers/user.controller.ts`
* **Service**: `src/services/user.service.ts`
* **Middleware**: `src/middleware/auth.ts`
* **Entity**: `src/entities/User.ts`

Endpoints:

| Method | Path                         | Description                     |
| ------ | ---------------------------- | ------------------------------- |
| POST   | `/api/users/register`        | Register a new user             |
| POST   | `/api/users/login`           | User login                      |
| POST   | `/api/users/forgot-password` | Forgot password flow            |
| POST   | `/api/users/change-password` | Change password (auth required) |

---

### Specialist Service

Manages **specialists, media, and service offerings**.

* **Routes**: `src/routes/specialist.routes.ts`
* **Controller**: `src/controllers/specialist.controller.ts`
* **Service**: `src/services/specialist.service.ts`
* **Entity**: `src/entities/Specialist.ts`

Endpoints:

| Method | Path               | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/specialists` | Create a new specialist |
| GET    | `/api/specialists` | Get all specialists     |

---

## Environment Variables

| Variable          | Description                       |
| ----------------- | --------------------------------- |
| PORT              | Server port                       |
| DATABASE_HOST     | PostgreSQL host                   |
| DATABASE_PORT     | PostgreSQL port                   |
| DATABASE_USER     | PostgreSQL user                   |
| DATABASE_PASSWORD | PostgreSQL password               |
| DATABASE_NAME     | PostgreSQL database name          |
| JWT_SECRET        | Secret key for JWT authentication |

---

## Database

* Using **PostgreSQL 16.11+**
* **TypeORM** entities handle table creation
* **Migrations** can be added if needed for production

---

## License

This project is licensed under the MIT License.


