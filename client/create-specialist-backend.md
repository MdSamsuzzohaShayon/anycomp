# 🧠 First Understand the Business Flow

You are building something similar to how a gig is created in Fiverr or Upwork.

One **Specialist** =
title + description + duration + price

* services they provide
* images
* publish/draft state

But these data live in **different tables**.

So the backend must act like a **conductor** 🎼
→ one action from UI
→ many DB operations behind the scene.

Frontend should NOT care where data goes.

---

# 🚨 Biggest Mistake Juniors Make

They call APIs like:

```
POST /specialists
POST /media
POST /service-offerings
POST /fees
```

❌ Wrong for product thinking.
❌ Too many requests.
❌ Hard to maintain.
❌ Bad UX.

---

# ✅ What Client Expects

A **smart API** like:

```
POST /api/specialists
PUT /api/specialists/:id
GET /api/specialists
GET /api/specialists/:id
```

And backend handles everything internally.

---

# 🧩 Who Stores What?

Let’s map frontend fields → database.

### From your form:

| Frontend Field       | Table             |
| -------------------- | ----------------- |
| title                | specialists       |
| description          | specialists       |
| duration_days        | specialists       |
| base_price           | specialists       |
| images               | media             |
| additional offerings | service_offerings |
| publish / draft      | is_draft          |

Platform fee → calculated using `platform_fee` table.

---

# 🎯 FINAL ARCHITECTURE (Important)

### 👉 Frontend hits **ONE** endpoint.

Backend:

1. create/update specialist
2. calculate platform fee
3. insert services
4. insert images
5. return final result

---

# ✨ Example – Create Specialist

## Request from Next.js

```json
POST /api/specialists

{
  "title": "Fix API bugs",
  "description": "I will fix backend issues",
  "duration_days": 3,
  "base_price": 100,
  "services": [
    "uuid-service-1",
    "uuid-service-2"
  ],
  "images": [
    { "file_name": "a.png", "size": 1234 },
    { "file_name": "b.png", "size": 4567 }
  ],
  "is_draft": true
}
```

---

## What Backend Does (secretly)

### Step 1 → Create specialist

Insert into `specialists`.

### Step 2 → Calculate fee

Read from `platform_fee` where price fits range.

### Step 3 → Update

Save:

* platform_fee
* final_price

### Step 4 → Insert offerings

Create rows in `service_offerings`.

### Step 5 → Insert media

Create rows in `media`.

---

### User sees:

✅ success
✅ specialist created

He has NO IDEA about tables.

Perfect system.

---

# 🧠 Why This Makes You Look Senior

Because you understand:

✔ aggregation
✔ transactions
✔ separation of responsibility
✔ API design
✔ scalability

---

# 🔥 VERY IMPORTANT → USE TRANSACTIONS

If image upload fails, specialist should not be half-created.

```
BEGIN
create specialist
insert offerings
insert media
COMMIT / ROLLBACK
```

---

# ✨ Update Specialist

Same idea.

```
PUT /api/specialists/:id
```

Backend:

* update specialist fields
* replace offerings
* replace media

---

# ✨ Get All Specialists Page

Acceptance criteria:

```
only where is_draft = false
```

```
GET /api/specialists?published=true
```

---

# ✨ Get One Specialist

Needs:

* specialist
* images
* services

Backend joins everything.

---

# 🎯 How Many APIs You Actually Need

### Core:

```
POST   /api/specialists
PUT    /api/specialists/:id
GET    /api/specialists
GET    /api/specialists/:id
DELETE /api/specialists/:id (maybe soft delete)
```

That’s it.

Not 20 endpoints.

---

# 🧠 How Data Connects (Visualization)

```
specialist
   |
   |-- media (many)
   |
   |-- service_offerings (many)
```

---

# 🎯 What Interviewer Wants to See

They want proof you can:

✅ read schema
✅ map UI → DB
✅ design API
✅ avoid too many requests
✅ maintain integrity
✅ think like product engineer

---

# 🏆 Golden Rule

👉 **Frontend sends business data**
👉 **Backend decides tables**

---
