# <img src="frontend/public/favicon.svg" width="28" height="28" style="vertical-align: middle;" /> FastAPI Inventory

A full-stack inventory management app featuring a FastAPI backend and a React frontend. It provides product CRUD operations, stock management, and automatic database seeding.

---

## ✨ Features

*   **Product CRUD**: Create, view, update, and delete products.
*   **Stock Management**: Dedicated restocking endpoint to increase product quantities.
*   **Database Seeding**: Automatically creates database tables and seeds demo products on startup.
*   **Interactive UI**: Glassmorphic dashboard featuring a responsive layout and smooth transitions.
*   **Auto-Generated Docs**: Self-documenting API using Swagger UI and ReDoc.

---

## 📸 Preview

| Home Dashboard | Product Details | Add Product |
| :---: | :---: | :---: |
| <img src="frontend/public/all_product_page.png" width="280" alt="Home Dashboard"> | <img src="frontend/public/product_details_card.png" width="280" alt="Product Details"> | <img src="frontend/public/add_product_page.png" width="200" alt="Add Product"> |

---

## 🛠️ Tech Stack

*   **Backend**: Python, FastAPI, SQLAlchemy ORM, Pydantic v2, PostgreSQL (psycopg2), Uvicorn
*   **Frontend**: React (Vite), Vanilla CSS (Glassmorphism layout)
*   **AI Tools**: Cursor, Windsurf, Codex, GitHub Copilot, Antigravity
*   **Testing & Tools**: Postman, Swagger UI, ReDoc

---

## 📁 Structure

*   `backend/` – FastAPI REST API, SQLAlchemy models, and schemas
*   `frontend/` – React dashboard frontend SPA
*   `.venv/` – Local Python virtual environment

---

## 🚀 Setup

### Prerequisites
*   **Python 3.10+**
*   **Node.js 18+**
*   **PostgreSQL** (running locally)

### Database Setup
1. Create a database named `inventory_db` in PostgreSQL:
   ```sql
   CREATE DATABASE inventory_db;
   ```
2. Verify or update the database connection string in `backend/database.py`:
   ```python
   DB_URL = "postgresql://postgres:<your_password>@localhost:5432/inventory_db"
   ```

### Backend
```bash
cd backend

# Windows (PowerShell)
..\.venv\Scripts\Activate.ps1

# Windows (CMD)
..\.venv\Scripts\activate.bat

# macOS/Linux
source ../.venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2 pydantic

# Run backend
uvicorn main:app --reload
```
*   **API Docs (Swagger UI)**: `http://localhost:8000/docs`
*   *Note: Seeds demo products on startup if the database is empty.*

### Frontend
```bash
cd frontend
npm install && npm run dev
```
*   **App**: `http://localhost:5173`

---

## 🔌 API

All communication between the frontend React application and the FastAPI server is handled by the API client.

*   `GET /products` – Get all products
*   `GET /products/{id}` – Get product details
*   `POST /products` – Create product
*   `PUT /products/{id}` – Update product
*   `DELETE /products/{id}` – Delete product
*   `POST /products/{id}/restock?amount=...` – Restock product quantity

---

## 🏛️ Architecture

*   **Design**: Clean layered-style architecture (`main/routing -> schemas -> database/models -> CRUD operations`).
*   **Data Flow**: Pydantic schemas validate requests before SQLAlchemy models execute DB operations.
*   **Service/DB Layer**: Handles automatic session management, database transaction safety, and seeding of demo products when the database is empty.

---

> **Note**: The frontend of this project was built using AI tools.
