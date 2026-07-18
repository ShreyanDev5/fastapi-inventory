from sqlalchemy import Column, Integer, String, Float
from database import Base

# Database model for the "products" table
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)      # Unique ID (primary key)
    name = Column(String, nullable=False)                  # Product name (required)
    description = Column(String)                           # Product description (optional)
    price = Column(Float, nullable=False)                  # Price (required)
    quantity = Column(Integer, default=0)                  # Stock quantity (defaults to 0)
