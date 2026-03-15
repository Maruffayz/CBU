# 🏦 CBU – Personal Finance Platform (MyFin fork)

CBU is a customized fork of the [MyFin](https://github.com/aFaneca/myfin) personal finance platform. 
It helps you track income and expenses, build budgets and view useful financial statistics.

This repository contains only the **backend API** and the **web frontend**. 
The Android mobile app module has been removed.

---

## 📁 Project Structure

- `project` – Node.js / Express **REST API** (MyFin API fork)
- `web` – React + TypeScript **web frontend** (MyFin web fork)

Each part has its own detailed README:

- Backend details: `project/README.md`
- Frontend details: `web/README.md`

---

## 🚀 Quick Start (local development)

### 1. Backend (API)

```bash
cd project
npm install
npm run dev
```

You must have a running MySQL database and configure the required environment variables 
(`DB_NAME`, `DB_USER`, `DB_PW`, `DB_HOST`, `DB_PORT`, etc.).
For full setup instructions, see `project/README.md`.

### 2. Frontend (Web)

In a separate terminal:

```bash
cd web
npm install
npm run dev
```

The frontend is built with **Vite** and expects the backend API URL to be configured via
`VITE_MYFIN_BASE_API_URL` (as a build arg in Docker, or via a `.env` file in dev mode).
See `web/README.md` for more details.

---

## 🌐 Localization

The web app supports multiple languages.
Uzbek translations are located at:

- `web/public/locales/uz/translation.json`

You can edit this file to adjust the UI text in Uzbek.

---

## 🐳 Docker (optional)

Both backend and frontend ship with Dockerfiles:

- Backend Dockerfile: `project/Dockerfile`
- Frontend Dockerfile: `web/Dockerfile`

Typical flow:

1. Start a MySQL container.
2. Build and run the `project` image, providing the required DB-related env vars.
3. Build the `web` image and pass `VITE_MYFIN_BASE_API_URL` pointing to the API.

For full configuration and all available options, check the READMEs inside each folder.

---

## 📜 License

This project is based on the original MyFin project and keeps the same open‑source licensing terms.
See the `LICENSE` file for full details.

