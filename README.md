# Anycomp – Full Stack Application

A full-stack implementation of **Anycomp**, a platform for **Company Registration and Management**, built with a **Node.js + TypeScript backend** and a **Next.js frontend**.

This project demonstrates **production-ready architecture**, **clean separation of concerns**, **secure authentication**, and **scalable system design**.

🔗 **Figma Design Reference**
[https://www.figma.com/design/ukCEkns86j8tyJgBovg7E8/ST-Comp-Holdings--MERN-Stack-Developer---Project-assesment](https://www.figma.com/design/ukCEkns86j8tyJgBovg7E8/ST-Comp-Holdings--MERN-Stack-Developer---Project-assesment)

---

## Table of Contents

* [Project Overview](#project-overview)
* [Tech Stack](#tech-stack)
* [Repository Structure](#repository-structure)
* [Prerequisites](#prerequisites)
* [Environment Variables](#environment-variables)
* [Backend Setup (Server)](#backend-setup-server)
* [Frontend Setup (Client)](#frontend-setup-client)
* [Running the Project](#running-the-project)
* [Available Scripts](#available-scripts)
* [Backend Modules](#backend-modules)
* [Database](#database)
* [License](#license)

---

## Project Overview

This repository contains **two applications**:

* **Backend (`/server`)**

  * REST API
  * Authentication & authorization
  * PostgreSQL database with TypeORM
* **Frontend (`/client`)**

  * Next.js application
  * Dashboard & UI based on Figma
  * API communication with backend

Both applications are **independently runnable** but designed to work together.

---

## Tech Stack

### Backend

* **Node.js** v24+
* **TypeScript**
* **Express.js**
* **PostgreSQL** v16.11+
* **TypeORM**
* **JWT** authentication
* **bcryptjs**

### Frontend

* **Next.js** (App Router)
* **TypeScript**
* **React**
* **Tailwind CSS / CSS Modules** (if applicable)
* **Fetch / Axios** for API calls

---

## Repository Structure

```bash
.
├── client/                 # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── public/
│   ├── next.config.js
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── data-source.ts
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── entities/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── middleware/
│   └── package.json
│
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

* **Node.js** v24+
* **npm** or **pnpm**
* **PostgreSQL** v16.11+
* **Git**

---

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=anycomp

JWT_SECRET=your_jwt_secret
```

### Frontend (`client/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## Backend Setup (Server)

### 1️⃣ Navigate to backend folder

```bash
cd server
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create PostgreSQL database

```sql
CREATE DATABASE anycomp;
```

### 4️⃣ Start development server

```bash
npm run dev
# or
npm run dev:tsd
```

Backend will run on:

```
http://localhost:5000
```

---

## Frontend Setup (Client)

### 1️⃣ Navigate to frontend folder

```bash
cd client
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start development server

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```

---

## Running the Project

### Development Mode (Recommended)

Run backend and frontend **in separate terminals**:

```bash
# Terminal 1
cd server
npm run dev
```

```bash
# Terminal 2
cd client
npm run dev
```

---

## Available Scripts

### Backend (`/server`)

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start dev server with nodemon     |
| `npm run dev:tsd` | Start dev server with ts-node-dev |
| `npm run build`   | Compile TypeScript                |
| `npm start`       | Run compiled server               |
| `npm run lint`    | Run ESLint                        |
| `npm run format`  | Format code with Prettier         |

---

### Frontend (`/client`)

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start Next.js dev server |
| `npm run build` | Build production app     |
| `npm start`     | Run production build     |
| `npm run lint`  | Run Next.js linting      |

---

## Backend Modules

### User Authentication

* Registration & login
* JWT-based authentication
* Role-based authorization

**Files**

* Routes: `src/routes/user.routes.ts`
* Controller: `src/controllers/user.controller.ts`
* Service: `src/services/user.service.ts`
* Middleware: `src/middleware/auth.ts`
* Entity: `src/entities/User.ts`

---

### Specialist & Services

Manages:

* Specialists
* Media
* Service offerings
* Service offering master list

Uses proper **TypeORM relationships** and transactional logic.

---

## Database

* **PostgreSQL 16.11+**
* Managed via **TypeORM entities**
* Automatic schema sync (dev)
* Migrations can be added for production

---

## License

This project is licensed under the **MIT License**.

---

### ✅ Notes (Industry Best Practice)

* Backend and frontend are **fully decoupled**
* Environment variables are **never committed**
* Business logic lives in **services**, not controllers
* TypeORM relationships are handled from the **owning side**
* Ready for **Docker / CI / production hardening**

