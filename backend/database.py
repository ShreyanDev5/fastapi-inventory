from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# PostgreSQL connection URL
DB_URL = "postgresql://postgres:rick5@localhost:5432/inventory_db"

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
