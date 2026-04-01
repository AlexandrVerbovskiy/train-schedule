# 🚅 Train Schedule Project (Monorepo)

Welcome to the Train Schedule project! This is a full-stack project built with modern technologies and containerized using Docker for a seamless development experience.

## 🏗 Architecture Overview

The system consists of four main components interacting within a unified network:
*   **Frontend**: React - Running on Port **3000**.
*   **Backend**: NestJS - Running on Port **5000**.
*   **Database**: PostgreSQL - Occupying Port **5432**.
*   **Cache**: Redis - Occupying Port **6379**.

---

## 🚀 Getting Started (Development)

The project is pre-configured for a smooth development workflow using Docker.

### 1. Launching the Project
Run the following command from the root directory:
```bash
docker compose up --build
```

### 3. Accessing the Services (Dev Mode)
*   🌐 **Frontend**: [http://localhost:3000](http://localhost:3000)
*   🛰️ **Backend API**: [http://localhost:5000](http://localhost:5000)

### 4. Accessing the Services (Prod / Build Mode)
*   🌐 **Frontend**: [http://localhost:80](http://localhost:80)
*   🛰️ **Backend API**: [http://localhost:8080](http://localhost:8080)

---

## 🛠 Technical Features

### Containerization
Docker Compose setup:
*   `docker-compose.yml`: Base configuration (Production-ready with Nginx).
*   `docker-compose.override.yml`: Local development overrides.

### CORS & Connectivity
CORS is configured in `main.ts`. It dynamically allows origins based on the environment:
*   **Dev Mode**: Permissive (`*` or localhost list).
*   **Production**: Controlled via `CORS_URLS` environment variable.

---

## 📝 Available Commands

### 🐳 Docker (Root directory)
Use these to manage the entire environment:
*   `docker compose up --build` — Build and start dev services.
*   `docker compose -f docker-compose.yml up --build` — Build and start prod services.

### 🛰️ Backend (Folder `/server`)
These can be run inside the container or locally if dependencies are installed:
*   `npm run start:dev` — Start NestJS in watch mode.
*   `npm run build` — Compile the project.
*   `npm run lint` — Check code style.

### 🌐 Frontend (Folder `/client`)
*   `npm start` — Start React in development mode.
*   `npm run build` — Build for production (outputs to `/build`).
*   `npm run lint` — Check and fix code style.

---

## 📂 Project Structure
```text
.
├── client/           # React Frontend
├── server/           # NestJS Backend
├── docker-compose.yml
├── docker-compose.override.yml
└── README.md
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).