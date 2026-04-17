# 📘 API Documentation

---

## 🔑 Register

POST /api/v1/auth/register

```json
{
  "name": "Mehul",
  "email": "mehul2904@gmail.com",
  "password": "123456"
}
```

---

## 🔑 Login

POST /api/v1/auth/login

```json
{
  "email": "ishu@gmail.com",
  "password": "123456"
}
```

---

## 🔑 Logout

POST /api/v1/auth/logout

(No body required — uses auth token)

---

## 🔑 Refresh Tokens

GET /api/v1/auth/resetTokens

---

## 📋 Create Task

POST /api/v1/task/createTask

```json
{
  "title": "Learn Backend",
  "description": "Complete Node.js project"
}
```

---

## 📋 Get Own Tasks

GET /api/v1/task/allOwnTask

---

## 📋 Get All Tasks (Admin)

GET /api/v1/task/allTask

---

## 📋 Update Task

PATCH /api/v1/task/updateTask/:id

```json
{
  "title": "Updated title"
}
```

---

## 📋 Delete Task

DELETE /api/v1/task/deleteTask/:id

---

## 🔐 Headers

Cookies are automatically handled:

* accessToken
* refreshToken

---

## ❗ Error Format

```json
{
  "status": 400,
  "message": "Error message",
  "error": "Detailed error"
}
```

---
