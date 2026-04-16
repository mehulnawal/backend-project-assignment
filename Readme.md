# 🚀 Task Management Backend API

A secure and scalable backend built with **Node.js, Express, MongoDB, and Redis**, featuring authentication, role-based access, and caching.

---

## 📌 Features

* 🔐 Authentication (JWT - Access & Refresh Tokens)
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
* MongoDB + Mongoose
* Redis
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

Create `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

ACCESS_TOKEN_SECRET_KEY=your_access_secret
ACCESS_TOKEN_EXPIRY_TIME=15m

REFRESH_TOKEN_SECRET_KEY=your_refresh_secret
REFRESH_TOKEN_EXPIRY_TIME=7d

REDIS_URL=your_redis_url

NODE_ENV=development
```

---

### 4. Run Server

```bash
npm run dev
```

---

## 🔐 Authentication Flow

1. User registers/login
2. Server generates:

   * Access Token (short-lived)
   * Refresh Token (stored in DB)
3. Tokens stored in **httpOnly cookies**
4. Refresh token used to generate new access token
5. Logout clears cookies + invalidates refresh token

---

## 📦 API Endpoints

### 🔑 Auth Routes

| Method | Route                    | Description    |
| ------ | ------------------------ | -------------- |
| POST   | /api/v1/auth/register    | Register user  |
| POST   | /api/v1/auth/login       | Login user     |
| GET    | /api/v1/auth/resetTokens | Refresh tokens |
| POST   | /api/v1/auth/logout      | Logout user    |

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

* Redis used for:

  * All tasks (`tasks:all`)
  * User tasks (`tasks:user:<id>`)

### Strategy:

* Read → Cache → DB fallback
* Write → Cache invalidation
* TTL → 60 seconds (fallback safety)

---

## 🛡 Security Features

* httpOnly cookies
* JWT authentication
* Role-based access control
* Refresh token invalidation on logout
* Input validation using Zod

---

## ❗ Important Notes

* Cache invalidation is used to keep data consistent
* TTL acts as fallback if invalidation fails
* Admin operations may clear broader cache (simplified approach)

---

## 📌 Future Improvements

* Rate limiting
* Logging (Winston)
* Queue system (BullMQ)
* Pagination & filtering
* Better cache segmentation (avoid flushAll)

---

## 👨‍💻 Author

Mehul Nawal

---
