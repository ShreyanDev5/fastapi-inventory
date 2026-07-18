/**
 * API Service for Inventory Tracker
 * Connects React frontend directly to the FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000';

/**
 * GET /
 * Welcome root route
 */
export async function getWelcomeMessage() {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch welcome message from server');
  }
  return response.json();
}

/**
 * GET /products
 * Get all products in the database
 */
export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

/**
 * GET /products/{id}
 * Get a specific product by ID
 */
export async function getProductById(productId) {
  const numericId = Number(productId);
  const response = await fetch(`${API_BASE_URL}/products/${numericId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    throw new Error('Failed to fetch product details');
  }
  return response.json();
}

/**
 * POST /products
 * Create a new product
 */
export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity)
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to create product' }));
    throw new Error(errorData.detail || 'Failed to create product');
  }
  return response.json();
}

/**
 * POST /products/{id}/restock
 * Restock a product by increasing its quantity
 */
export async function restockProduct(productId, amount = 10) {
  const numericId = Number(productId);
  const numericAmount = Number(amount);

  const response = await fetch(`${API_BASE_URL}/products/${numericId}/restock?amount=${numericAmount}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to restock product' }));
    throw new Error(errorData.detail || 'Failed to restock product');
  }
  return response.json();
}

/**
 * PUT /products/{id}
 * Update an existing product by ID
 */
export async function updateProduct(productId, productData) {
  const numericId = Number(productId);

  const response = await fetch(`${API_BASE_URL}/products/${numericId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity)
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to update product' }));
    throw new Error(errorData.detail || 'Failed to update product');
  }
  return response.json();
}

/**
 * DELETE /products/{id}
 * Delete a product by ID
 */
export async function deleteProduct(productId) {
  const numericId = Number(productId);

  const response = await fetch(`${API_BASE_URL}/products/${numericId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to delete product' }));
    throw new Error(errorData.detail || 'Failed to delete product');
  }
  return response.json();
}
