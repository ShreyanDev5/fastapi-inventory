# <img src="frontend/public/favicon.svg" width="28" height="28" style="vertical-align: middle;" /> FastAPI Inventory

Full-stack inventory management app with a Python FastAPI backend, PostgreSQL database, and React dashboard frontend.

---

## Key Features

* **Product CRUD**: Create, read, update, and delete inventory items.
* **Stock Management**: Restock product quantities via custom endpoint.
* **DB Seeding**: Automatically creates tables and seeds demo products on startup if empty.
* **Interactive Dashboard**: Real-time stock tracking, product search, and low-stock indicators.
* **Swagger API Docs**: Interactive API documentation at `/docs`.

---

## Tech Stack

* **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Pydantic v2, PostgreSQL (`psycopg2`), Uvicorn
* **Frontend**: React (Vite), Vanilla CSS
* **Tooling**: Antigravity (AI agent for UI development)

---

## Key Technical Design

* **Safe DB Sessions**: Uses a generator (`get_db`) with `yield` and FastAPI `Depends` to open/close PostgreSQL sessions per request, preventing session leaks.
* **Schema Validation**: Pydantic v2 validates request payloads before SQLAlchemy executes database operations.
* **CORS Security**: Explicitly allows requests from the React frontend (`http://localhost:5173`).

---

## Screenshots

| | |
| :---: | :---: |
| **Home Page** | **All Products** |
| <img src="frontend/public/home_page.png" width="380" alt="Home Page"> | <img src="frontend/public/all_product_page.png" width="380" alt="All Products"> |
| **Product Details** | **Add Product** |
| <img src="frontend/public/product_details_card.png" width="380" alt="Product Details"> | <img src="frontend/public/add_product_page.png" width="380" alt="Add Product"> |

---

## Project Structure

```
fastapi-inventory/
├── backend/
│   ├── database.py   # DB connection, sessionmaker & get_db generator
│   ├── main.py       # FastAPI routes, CORS & startup seeding
│   ├── models.py     # SQLAlchemy Product database model
│   └── schemas.py    # Pydantic v2 request/response schemas
└── frontend/         # React SPA dashboard
```

---

## Local Setup

### Prerequisites
* **Python 3.10+** | **Node.js 18+** | **PostgreSQL** running locally

### 1. Database & Environment Setup
Create database `inventory_db` in PostgreSQL:
```sql
CREATE DATABASE inventory_db;
```
Configure environment variables:
```bash
cp backend/.env.example backend/.env
# Set DATABASE_URL=postgresql://postgres:your_password@localhost:5432/inventory_db in backend/.env
```

### 2. Backend Setup
```bash
cd backend
source ../.venv/bin/activate  # Windows PowerShell: ..\.venv\Scripts\Activate.ps1
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
uvicorn main:app --reload
```
* **API Docs**: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install && npm run dev
```
* **App URL**: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Connectivity check |
| `GET` | `/products` | Fetch all products |
| `GET` | `/products/{id}` | Fetch product by ID |
| `POST` | `/products` | Create product (HTTP 201) |
| `PUT` | `/products/{id}` | Update product details |
| `DELETE` | `/products/{id}` | Delete product by ID |
| `POST` | `/products/{id}/restock` | Restock quantity (`amount` query param, default 10) |


