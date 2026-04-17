# 🚀 Task Management Backend API

A secure and scalable backend built with **Node.js, Express, MongoDB, and Redis**, featuring authentication, role-based access, and caching.

---

## 📌 Features

* 🔐 Authentication (JWT - Access & Refresh Tokens + Google OAuth)
* 👤 Role-Based Access Control (Admin/User)
* 📋 Task CRUD (Create, Read, Update, Delete)
* ⚡ Redis Caching (with invalidation)
* 🛡 Secure Logout (refresh token invalidation)
* ✅ Input Validation (Zod)
* 🌐 Global Error Handling

---

## 🏗 Tech Stack

* Node.js
* Express.js
* MongoDB Atlas + Mongoose
* Redis (RedisLabs — ap-south-1)
* Zod
* JWT (jsonwebtoken)
* bcrypt

---

## ⚙️ Setup Instructions

### 1. Clone Repo

```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the server root. Refer to `server.env.example` for all required variables.

Key variables:

```env
PORT=9000

DB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/assignment?appName=<appName>

NODE_ENV=development

FRONTEND_PATH=https://your-frontend.vercel.app

ACCESS_TOKEN_SECRET_KEY=<generate_with_crypto.randomBytes(64).toString('hex')>
ACCESS_TOKEN_EXPIRY_TIME=15m

REFRESH_TOKEN_SECRET_KEY=<generate_with_crypto.randomBytes(64).toString('hex')>
REFRESH_TOKEN_EXPIRY_TIME=7d

GOOGLE_CLIENT_ID=<from_google_cloud_console>
GOOGLE_CLIENT_SECRET=<from_google_cloud_console>

REDIS_URL=redis://default:<password>@<host>:<port>
```

For the client, create a `.env` in the client root. Refer to `client.env.example`.

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
VITE_GOOGLE_CLIENT_ID=<same_as_server_GOOGLE_CLIENT_ID>
```

---

### 4. Run Server

```bash
npm run dev
```

Server runs on `http://localhost:9000` by default.

---

## 🔐 Authentication Flow

1. User registers/login (or via Google OAuth)
2. Server generates:

   * Access Token (15m expiry) — short-lived, sent with every request
   * Refresh Token (7d expiry) — stored in DB, used to regenerate access token
3. Tokens stored in **httpOnly cookies**
4. Refresh token used to generate new access token via `/api/v1/auth/resetTokens`
5. Logout clears cookies + invalidates refresh token in DB

---

## 📦 API Endpoints

Base URL (production): `https://backend-project-assignment-p1w6.onrender.com/api/v1`

### 🔑 Auth Routes

| Method | Route                    | Description          |
| ------ | ------------------------ | -------------------- |
| POST   | /api/v1/auth/register    | Register user        |
| POST   | /api/v1/auth/login       | Login user           |
| GET    | /api/v1/auth/resetTokens | Refresh tokens       |
| POST   | /api/v1/auth/logout      | Logout user          |

---

### 📋 Task Routes

| Method | Route                       | Access        |
| ------ | --------------------------- | ------------- |
| GET    | /api/v1/task/allTask        | Admin only    |
| GET    | /api/v1/task/allOwnTask     | Authenticated |
| POST   | /api/v1/task/createTask     | Authenticated |
| PATCH  | /api/v1/task/updateTask/:id | Authenticated |
| DELETE | /api/v1/task/deleteTask/:id | Authenticated |

---

## ⚡ Caching Strategy

* Redis (hosted on RedisLabs, ap-south-1) used for:

  * All tasks (`tasks:all`) — Admin view
  * User tasks (`tasks:user:<userId>`) — per-user cache

### Strategy:

* Read → Cache → DB fallback
* Write → Cache invalidation
* TTL → 60 seconds (fallback safety)

---

## 🛡 Security Features

* httpOnly cookies
* JWT authentication (Access + Refresh token rotation)
* Role-based access control (Admin / User)
* Refresh token invalidation on logout
* Google OAuth client ID verification
* Input validation using Zod

---

## ❗ Important Notes

* Cache invalidation is used to keep data consistent
* TTL acts as fallback if invalidation fails
* Admin operations may clear broader cache (simplified approach)
* `GOOGLE_CLIENT_SECRET` must be set in server env — do not leave it empty

---

## 📌 Future Improvements

* Rate limiting
* Logging (Winston)
* Queue system (BullMQ)
* Pagination & filtering
* Better cache segmentation (avoid flushAll)

---

## 🌍 Deployment

| Layer    | Platform        |
| -------- | --------------- |
| Backend  | Render          |
| Frontend | Vercel          |
| Database | MongoDB Atlas   |
| Cache    | RedisLabs       |

---

## 👨‍💻 Author

Mehul Nawal