# <img src="frontend/public/favicon.svg" width="28" height="28" style="vertical-align: middle;" /> FastAPI Inventory

A full-stack inventory management web application built with FastAPI, PostgreSQL, and React. It features complete product CRUD operations, stock restocking, automatic database seeding, and interactive Swagger API documentation.

[![API Docs](https://img.shields.io/badge/API_Docs-Interactive_Swagger-009688?style=flat-square)](http://localhost:8000/docs)
[![Frontend](https://img.shields.io/badge/Frontend-React_19-61dafb?style=flat-square)](http://localhost:5173)

---

## Preview

| Home Dashboard | Product Catalog |
| :---: | :---: |
| <img src="frontend/public/home_page.png" width="380" alt="Home Dashboard" /> | <img src="frontend/public/all_product_page.png" width="380" alt="Product Catalog" /> |
| **Product Details View** | **Add Product Form** |
| <img src="frontend/public/product_details_card.png" width="380" alt="Product Details View" /> | <img src="frontend/public/add_product_page.png" width="380" alt="Add Product Form" /> |

---

## Features

- **Product Lifecycle Management**: Create, view, update, and delete inventory items with real-time state synchronization.
- **Dedicated Stock Restocking**: Adjust and increment stock levels using atomic restock endpoints.
- **Automated Database Seeding**: Automatically initialize database schemas and populate sample catalog records on startup if tables are empty.
- **Interactive UI Dashboard**: Monitor stock health, search products instantly, and track low-stock items.
- **Interactive API Documentation**: Explore and execute REST endpoints directly via auto-generated Swagger UI.

---

## Tech Stack

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Pydantic v2, PostgreSQL (`psycopg2`), Uvicorn
- **Frontend**: React 19, Vite, Lucide Icons, Vanilla CSS
- **AI Tooling**: Antigravity (Pair programming and UI/UX design)

---

## API Reference

Base path: `/` (Interactive documentation available at `http://localhost:8000/docs`)

| Method | Endpoint | Description | Request Format |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Service health and connectivity check | None |
| `GET` | `/products` | Retrieve all inventory products | None |
| `GET` | `/products/{id}` | Retrieve product details by ID | None |
| `POST` | `/products` | Create a new product entry (HTTP 201) | JSON (`{ name, description, price, quantity }`) |
| `PUT` | `/products/{id}` | Update an existing product | JSON (`{ name, description, price, quantity }`) |
| `DELETE` | `/products/{id}` | Remove a product from inventory | None |
| `POST` | `/products/{id}/restock` | Increment product quantity | Query param `?amount=10` |

---

## Project Structure

```text
fastapi-inventory/
├── backend/
│   ├── .env.example       # Example PostgreSQL connection string
│   ├── database.py        # Database engine, sessionmaker & get_db generator
│   ├── main.py            # FastAPI application routes, CORS & startup seeding
│   ├── models.py          # SQLAlchemy Product database model
│   └── schemas.py         # Pydantic v2 request and response schemas
├── frontend/
│   ├── public/            # Static assets and screenshot previews
│   ├── src/
│   │   ├── components/    # Reusable React UI views and forms
│   │   ├── services/      # API client functions
│   │   ├── App.jsx        # Root application layout and routing
│   │   ├── index.css      # Core styles and design tokens
│   │   └── main.jsx       # React application entry point
│   ├── index.html         # HTML root document
│   ├── package.json       # Frontend package configuration
│   └── vite.config.js     # Vite bundler configuration
└── README.md              # Project documentation
```

---

## Getting Started

### Prerequisites

- **Python**: `3.10+`
- **Node.js**: `18.0+` & `npm`
- **PostgreSQL**: `14+` running locally

### 1. Database & Environment Setup

Create the PostgreSQL database:
```sql
CREATE DATABASE inventory_db;
```

Copy the environment file:
- **PowerShell (Windows)**:
  ```powershell
  Copy-Item backend\.env.example backend\.env
  ```
- **CMD (Windows)**:
  ```cmd
  copy backend\.env.example backend\.env
  ```
- **Unix / macOS**:
  ```bash
  cp backend/.env.example backend/.env
  ```

Set your PostgreSQL connection string in `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/inventory_db
```

### 2. Backend Setup

- **PowerShell (Windows)**:
  ```powershell
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  cd backend
  pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
  uvicorn main:app --reload
  ```
- **CMD (Windows)**:
  ```cmd
  python -m venv .venv
  .venv\Scripts\activate.bat
  cd backend
  pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
  uvicorn main:app --reload
  ```
- **Unix / macOS**:
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  cd backend
  pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
  uvicorn main:app --reload
  ```

*API Documentation: `http://localhost:8000/docs`*

### 3. Frontend Setup

- **All Platforms**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

*Web Application: `http://localhost:5173`*

---

## Author

**Shreyan Sardar**
- **Portfolio**: [shreyandev.vercel.app](https://shreyandev.vercel.app)
- **GitHub**: [@ShreyanDev5](https://github.com/ShreyanDev5)
- **LinkedIn**: [shreyansardar](https://www.linkedin.com/in/shreyansardar/)
