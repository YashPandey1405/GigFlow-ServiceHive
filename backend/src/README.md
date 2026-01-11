# GigFlow – ServiceHive Backend

Backend API for a gig–bidding platform where users can post gigs, place bids, and hire one bid per gig.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## Core Flow

- Users register and log in
- Gig owners post gigs
- Freelancers place bids on gigs
- Gig owner hires **one** bid
- All other bids are automatically rejected

---

## Base URL

```
/api/v1
```

---

## Auth Routes

**POST** `/auth/register`
Register a new user.

**POST** `/auth/login`
Login and receive access token.

---

## Gig Routes

**GET** `/gig`
Fetch all gigs.

**POST** `/gig` (Auth required)
Create a new gig.

---

## Bid Routes

**POST** `/bids` (Auth required)
Place a bid on a gig.

**GET** `/bids/:gigId` (Auth required)
Get all bids for a gig.

**PATCH** `/bids/:bidId/hire` (Auth required, Gig owner only)
Hire a bid.

- Selected bid → `hired`
- All other bids → `rejected`
- Bid can be processed only once

---

## Health Check

**GET** `/healthcheck`
Check server status.

---

## Bid Status

```
pending → hired
pending → rejected
```

---

## Notes

- Only gig owners can hire bids
- Authorization enforced at route level
- Database updates are atomic and consistent
