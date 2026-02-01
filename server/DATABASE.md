# Backend System – Database Design

## 1. `specialists`

| Column Name             | Type     | Notes       |
| ----------------------- | -------- | ----------- |
| id                      | uuid     | Primary Key |
| average_rating          | decimal  |             |
| is_draft                | boolean  |             |
| total_number_of_ratings | int      |             |
| title                   | string   |             |
| slug                    | string   |             |
| description             | text     |             |
| base_price              | decimal  |             |
| platform_fee            | decimal  |             |
| final_price             | decimal  |             |
| verification_status     | enum     |             |
| is_verified             | boolean  |             |
| duration_days           | int      |             |
| created_at              | datetime |             |
| updated_at              | datetime |             |
| deleted_at              | datetime | Nullable    |

---

## 2. `media`

| Column Name   | Type     | Notes               |
| ------------- | -------- | ------------------- |
| id            | uuid     | Primary Key         |
| specialists   | uuid     | FK → specialists.id |
| file_name     | string   |                     |
| file_size     | int      |                     |
| display_order | int      |                     |
| mime_type     | enum     |                     |
| media_type    | enum     |                     |
| uploaded_at   | datetime |                     |
| deleted_at    | datetime | Nullable            |
| created_at    | datetime |                     |
| updated_at    | datetime |                     |

---

## 3. `platform_fee`

| Column Name             | Type     | Notes       |
| ----------------------- | -------- | ----------- |
| id                      | uuid     | Primary Key |
| tier_name               | enum     |             |
| min_value               | int      |             |
| max_value               | int      |             |
| platform_fee_percentage | decimal  |             |
| created_at              | datetime |             |
| updated_at              | datetime |             |

---

## 4. `service_offerings`

| Column Name | Type     | Notes               |
| ----------- | -------- | ------------------- |
| id          | uuid     | Primary Key         |
| specialists | uuid     | FK → specialists.id |
| created_at  | datetime |                     |
| updated_at  | datetime |                     |

---

### Relationships Summary

* **specialists → media**: One-to-Many
* **specialists → service_offerings**: One-to-Many
* **platform_fee**: Standalone (used for pricing logic)

---

