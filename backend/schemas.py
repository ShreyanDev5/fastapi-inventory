from pydantic import BaseModel
from typing import Optional

# Pydantic schema for API request validation
class Product(BaseModel):
    id: Optional[int] = None  # Optional product ID
    
    # Product fields validated by Pydantic
    name: str             # Product name
    description: str      # Product description
    price: float          # Product price (decimal)
    quantity: int         # Stock quantity (integer)
