# 🚀 GigFlow – Mini Freelance Marketplace Platform

**Internship Assignment – Full Stack Development**
**Platform by: ServiceHive**

---

## 📌 Project Overview (Version 1)

**GigFlow** is a mini freelance marketplace platform designed to simulate real-world client–freelancer interactions.
The platform enables **Clients** to post job listings (Gigs) and **Freelancers** to apply by placing bids.

This project focuses on:

- Designing **relational data models** in MongoDB
- Implementing **secure authentication & authorization**
- Managing **complex business rules**
- Building a **scalable full-stack architecture**

GigFlow represents a production-style MVP with real deployment, validations, and role-based logic.

---

## 🛠️ Tech Stack

### Frontend

- **Vite + React.js**
- **TanStack Router** – client-side routing
- **Zustand** – global state management

### Backend

- **Node.js + Express.js**
- **JWT Authentication + BcryptJS**
- **Zod** – schema validation
- **CORS** – secure cross-origin handling

### Database

- **MongoDB**
- Collections:

  - `Users`
  - `Gigs`
  - `Bids`

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Domain Setup:**

  - Backend API routed via subdomain of `yashpandey.xyz`
  - CORS configured for production

---

## ✨ Key Features

- **Secure Authentication**

  - JWT-based login & signup
  - Password hashing using BcryptJS

- **Gig Management**

  - Any authenticated user can create a gig
  - Full CRUD operations supported

- **Bid System**

  - Freelancers can bid on gigs
  - Gig owner **cannot** bid on their own gig
  - Gig owner can **accept exactly one bid**

- **Bid Resolution Logic**

  - Once a bid is accepted:

    - The gig is marked as **assigned**
    - All other bids for that gig are **automatically rejected**

- **File Upload**

  - Multer + Cloudinary integration
  - Secure media handling for gig-related uploads

---

## 🔐 Business Rules Implemented

- ❌ Gig owner cannot place a bid on their own gig
- ✅ Only the gig owner can accept a bid
- 🔒 Only **one bid** can be accepted per gig
- 🚫 All other bids are rejected after acceptance

These rules ensure platform integrity and realistic marketplace behavior.

---

## ▶️ How to Use the Platform

### Step 1: Prevent Backend Cold Start

Render free servers may sleep.
Hit the health check endpoint first:

```
https://gigflow-servicehive.onrender.com/api/v1/healthcheck
```

Wait until you receive a **200 OK** response.

---

### Step 2: Visit the Platform

```
https://gigflow.yashpandey.xyz/about
```

---

### Step 3: Authenticate

- Sign up as a new user
- Login to access gigs, bids, and dashboard features

---

## 📦 Project Status

✅ **Version 1 – Completed & Deployed**

- Fully functional MVP
- Real production deployment
- Secure APIs and validations
- Clean separation of frontend and backend

---

## 🔮 Future Roadmap (Version 2)

### 1️⃣ Transactional Integrity (Race Condition Handling)

Implement **MongoDB Transactions** or equivalent locking logic to ensure:

- If two users attempt to accept different bids **at the exact same time**
- Only **one bid** is accepted
- The other operation fails gracefully

This will prevent data inconsistency in high-concurrency scenarios.

---

### 2️⃣ Real-Time Notifications

Integrate **Socket.io** for live updates:

- When a client hires a freelancer
- The freelancer instantly receives a notification:

  > _“You have been hired for [Project Name]!”_

- No page refresh required

---

## 🧠 Learning Outcomes

- Designing scalable backend APIs
- Handling multi-entity relationships in MongoDB
- Implementing real-world authorization logic
- Production deployment with domain & CORS setup
- Writing clean, validation-driven backend code

---

## 👤 Author

**Yash Pandey**
Full Stack Developer
Domain: `yashpandey.xyz`

---
