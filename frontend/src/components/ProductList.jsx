import React, { useState, useEffect } from 'react';
import { Search, Plus, Inbox, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { getProducts } from '../services/api';

export default function ProductList({ onViewChange, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch products. Please check if backend is online.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const handleRowClick = (productId) => {
    onSelectProduct(productId);
    onViewChange('product-detail');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term)) ||
      product.id.toString().includes(term)
    );
  });

  // Sort the filtered products list
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortConfig.key === 'id') {
      return sortConfig.direction === 'asc' ? a.id - b.id : b.id - a.id;
    }
    if (sortConfig.key === 'price') {
      return sortConfig.direction === 'asc' ? a.price - b.price : b.price - a.price;
    }
    if (sortConfig.key === 'quantity') {
      // Sorts by numerical quantity (represents stock status)
      return sortConfig.direction === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
    }
    return 0;
  });

  const getStockBadge = (quantity) => {
    if (quantity === 0) {
      return <span className="badge badge-danger">Out of stock</span>;
    }
    if (quantity <= 10) {
      return <span className="badge badge-warning">Low stock ({quantity})</span>;
    }
    return <span className="badge badge-success">In stock ({quantity})</span>;
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown size={14} style={{ opacity: 0.3, marginLeft: '0.25rem' }} />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} style={{ color: 'var(--primary)', marginLeft: '0.25rem' }} />
      : <ChevronDown size={14} style={{ color: 'var(--primary)', marginLeft: '0.25rem' }} />;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading inventory items...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">Search and manage products in stock.</p>
        </div>
        {/* Minimalist icon-only Plus button */}
        <button 
          className="btn btn-primary" 
          onClick={() => onViewChange('create-product')}
          style={{ padding: '0.625rem', width: '2.5rem', height: '2.5rem' }}
          title="Add Product"
          aria-label="Add Product"
        >
          <Plus size={18} />
        </button>
      </div>

      {error && (
        <div className="error-container">
          <AlertTriangle className="error-icon" size={32} />
          <h3>Error Loading Products</h3>
          <p style={{ marginTop: '0.5rem' }}>{error}</p>
        </div>
      )}

      {!error && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="filter-bar">
            <div className="search-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by ID, name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="empty-container">
              <Inbox size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3>No products found</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {products.length === 0 
                  ? "Get started by adding your first product to the database!" 
                  : "No products matched your search."}
              </p>
              {products.length === 0 && (
                <button 
                  className="btn btn-primary" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => onViewChange('create-product')}
                >
                  <Plus size={18} /> Add First Product
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th 
                      style={{ width: '100px', cursor: 'pointer', userSelect: 'none' }} 
                      onClick={() => handleSort('id')}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        ID {renderSortIcon('id')}
                      </span>
                    </th>
                    <th>Product Name</th>
                    <th 
                      style={{ width: '140px', cursor: 'pointer', userSelect: 'none' }} 
                      onClick={() => handleSort('price')}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        Price {renderSortIcon('price')}
                      </span>
                    </th>
                    <th 
                      style={{ width: '200px', cursor: 'pointer', userSelect: 'none' }} 
                      onClick={() => handleSort('quantity')}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        Stock Status {renderSortIcon('quantity')}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((product) => (
                    <tr 
                      key={product.id} 
                      onClick={() => handleRowClick(product.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>#{product.id}</td>
                      <td>
                        <div className="product-row-name">{product.name}</div>
                        <div className="product-row-description">{product.description || 'No description provided'}</div>
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td>
                        {getStockBadge(product.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

