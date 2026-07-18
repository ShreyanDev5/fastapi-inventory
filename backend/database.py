import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from a .env file if python-dotenv is installed
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# PostgreSQL connection URL (fallback to local defaults if DATABASE_URL is not set)
DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/inventory_db")

# SQLAlchemy engine to connect to the database
engine = create_engine(DB_URL)

# Session creator for database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for database models
Base = declarative_base()

# Dependency to open/close db sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
