# TourHobe – Travel Planner & Buddy Matching Backend

A **production-ready backend API** for a modern **Travel Planning, Travel Buddy Matching, and Meetup Platform**.

TourHobe enables users to create travel plans, find compatible travel buddies, manage trip participation, leave reviews, and subscribe to premium features using secure online payments.

This backend is built with scalability, security, and real-world production practices in mind.

🔗 **GitHub Repository:**  
https://github.com/abujaforhadi/TourHobe-server

🚀 **Live Server URL:**  
https://tourhobe25.vercel.app


## 🧩 Overview

Built using **Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL**, this API supports:

* Travel plan creation and management
* Travel buddy matching based on smart criteria
* Participant join request workflow
* Review and rating system
* User dashboards
* Real subscription payments via **SSLCommerz**
* Admin-level system management

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* Secure JWT-based authentication
* Password hashing using **bcrypt**
* Cookie-based session handling
* Role-based access control (`USER`, `ADMIN`)

---

### 🧳 Travel Plan Management

* Create, update, and delete travel plans
* Public / Private visibility control
* Date and budget validation logic
* Join request system for participants
* Host can **accept / reject / cancel** join requests
* User dashboard showing:

  * Hosted trips
  * Joined trips
  * Upcoming trips

---

### 🤝 Travel Buddy Matching

Automatically suggests matching travel plans based on:

* Same destination
* Overlapping travel dates
* Same travel type
* Public visibility

Matching results are shown directly on the user dashboard.

---

### ⭐ Review System

* Users can review trip hosts after completion
* Prevents duplicate reviews
* Admin can monitor and remove suspicious reviews

---

### 💳 SSLCommerz Payment Integration

Supports **real subscription payments** using SSLCommerz (Sandbox).

#### Subscription Options

* Monthly subscription
* Yearly subscription
* Verified badge upgrade

#### Payment Capabilities

* SSLCommerz sandbox integration
* Success / fail / cancel redirects
* IPN (Instant Payment Notification) validation
* Automatic premium activation after payment
* User & Admin transaction history

---

### 🛠️ Admin Capabilities

* Manage all travel plans
* Moderate reviews
* Manage subscriptions & transactions
* Manage users and premium status

---

## 🧪 Tech Stack

| Category       | Technology      |
| -------------- | --------------- |
| Runtime        | Node.js         |
| Language       | TypeScript      |
| Framework      | Express.js      |
| Database       | PostgreSQL      |
| ORM            | Prisma          |
| Validation     | Zod             |
| Authentication | JWT + Cookies   |
| Payments       | SSLCommerz      |
| Deployment     | Vercel / Render |

---

## 🔌 API Endpoints

### 🔐 Authentication

| Endpoint             | Method | Description            |
| -------------------- | ------ | ---------------------- |
| `/api/v1/auth/register` | POST   | Register new user      |
| `/api/v1/auth/login`    | POST   | User login             |
| `/api/v1/auth/me`       | GET    | Logged-in user profile |

---

### 🧳 Travel Plans

| Endpoint                     | Method | Description        |
| ---------------------------- | ------ | ------------------ |
| `/api/v1/travel-plans`          | POST   | Create travel plan |
| `/api/v1/travel-plans/:id`      | GET    | Get travel plan    |
| `/api/v1/travel-plans/:id`      | PATCH  | Update travel plan |
| `/api/v1/travel-plans/:id`      | DELETE | Delete travel plan |
| `/api/v1/travel-plans/:id/join` | POST   | Request to join    |
| `/api/v1/travel-plans/hosted`   | GET    | User hosted plans  |
| `/api/v1/travel-plans/joined`   | GET    | User joined plans  |

---

### ⭐ Reviews

| Endpoint                 | Method | Description            |
| ------------------------ | ------ | ---------------------- |
| `/api/v1/reviews/user/:id`  | GET    | Get reviews for a host |
| `/api/v1/reviews`           | POST   | Add a review           |
| `/api/v1/admin/reviews`     | GET    | Admin: all reviews     |
| `/api/v1/admin/reviews/:id` | DELETE | Admin: delete review   |

---

### 📊 User Dashboard

| Endpoint              | Method | Description                     |
| --------------------- | ------ | ------------------------------- |
| `/api/v1/dashboard/user` | GET    | User dashboard (matches, trips) |

---

### 💳 Payments (SSLCommerz)

| Endpoint                              | Method   | Description        |
| ------------------------------------- | -------- | ------------------ |
| `/api/v1/payments/init-subscription`     | POST     | Start payment      |
| `/api/v1/payments/success`               | GET/POST | Success callback   |
| `/api/v1/payments/fail`                  | GET/POST | Fail callback      |
| `/api/v1/payments/cancel`                | GET/POST | Cancel callback    |
| `/api/v1/payments/validate-payment`      | POST     | IPN validation     |
| `/api/v1/payments/status/:transactionId` | GET      | Payment status     |
| `/api/v1/payments/my-transactions`       | GET      | User transactions  |
| `/api/v1/payments/admin/transactions`    | GET      | Admin transactions |

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js **v20+**
* PostgreSQL database (Local / Docker / Railway / NeonDB)
* npm or yarn
* SSLCommerz Sandbox credentials

(Optional)

```bash
npm install -g prisma
```

---

### 1️⃣ Clone & Install

```bash
git clone https://github.com/abujaforhadi/TourHobe-server
cd TourHobe-server
npm install
```

---

### 2️⃣ Environment Variables

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

PORT=5000
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
COOKIE_NAME=token
SALT_ROUNDS=12

# SSLCommerz Sandbox
SSL_STORE_ID=your_store_id
SSL_STORE_PASS=your_store_password
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/v1/validationserverAPI.php

# Backend Redirect URLs
SSL_SUCCESS_BACKEND_URL=https://your-backend.com/api/v1/payments/success
SSL_FAIL_BACKEND_URL=https://your-backend.com/api/v1/payments/fail
SSL_CANCEL_BACKEND_URL=https://your-backend.com/api/v1/payments/cancel
SSL_IPN_URL=https://your-backend.com/api/v1/payments/validate-payment

# Frontend Redirect URLs
SSL_SUCCESS_FRONTEND_URL=https://your-frontend.com/payment-success
SSL_FAIL_FRONTEND_URL=https://your-frontend.com/payment-fail
SSL_CANCEL_FRONTEND_URL=https://your-frontend.com/payment-cancel

# Pricing
PRICE_MONTHLY=299
PRICE_YEARLY=2999
PRICE_VERIFIED_BADGE=199
```

---

### 3️⃣ Run Prisma Migrations

```bash
npx prisma migrate dev
```

---

### 4️⃣ Start the Server

```bash
npm run dev
```

---

## ✅ Production Notes

* Prisma Client is generated before build
* Railway / Vercel compatible
* Strict TypeScript friendly
* Modular service-controller architecture
* Ready for scaling and feature expansion

---

If you want, next I can:

* Write a **professional LinkedIn project post**
* Add **API versioning**
* Create **Swagger/OpenAPI docs**
* Add **rate limiting & security headers**


