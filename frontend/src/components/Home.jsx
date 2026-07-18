import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { getWelcomeMessage, getProducts, restockProduct } from '../services/api';

export default function Home({ onViewChange }) {
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restockingIds, setRestockingIds] = useState({});
  const [removingIds, setRemovingIds] = useState({});

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);
        
        // Concurrently fetch welcome message and products
        const [welcomeData, productsData] = await Promise.all([
          getWelcomeMessage(),
          getProducts()
        ]);
        
        setWelcomeMsg(welcomeData.message || 'API Online');
        setProducts(productsData || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Could not connect to the API. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

  const handleRestock = async (productId) => {
    try {
      setRestockingIds(prev => ({ ...prev, [productId]: true }));
      const updatedProduct = await restockProduct(productId, 10);
      
      // Trigger the slide/fade out animation on the row
      setRemovingIds(prev => ({ ...prev, [productId]: true }));
      
      // Delay updating state to let the animation complete
      setTimeout(() => {
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === productId ? updatedProduct : p)
        );
        setRemovingIds(prev => ({ ...prev, [productId]: false }));
      }, 300);
    } catch (err) {
      console.error('Failed to restock:', err);
      alert('Failed to restock product. Please check if the backend is running and supports this operation.');
    } finally {
      setRestockingIds(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard metrics...</p>
      </div>
    );
  }

  // Calculate metrics reactively
  const totalProducts = products.length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;

  // Filter items that require attention (quantity <= 10)
  const lowStockItems = products.filter(p => p.quantity <= 10);

  return (
    <div>
      {/* Redundancy-free Page Header with relocated Status Tag */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real-time status of your inventory.</p>
        </div>
        <div className="welcome-message-tag" style={{ marginTop: 0 }}>
          Status: {welcomeMsg}
        </div>
      </div>

      {/* Balanced 3-column stats grid with specific colored hover effects */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {/* Stat Card: Total Products (Blue hover) */}
        <div className="glass-card stat-card clickable-card card-primary" onClick={() => onViewChange('products')}>
          <div className="stat-icon" style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)' }}>
            <Package size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalProducts}</span>
            <span className="stat-label">Total Products</span>
          </div>
        </div>

        {/* Stat Card: Out of Stock (Red hover) */}
        <div className="glass-card stat-card clickable-card card-danger" onClick={() => onViewChange('products')}>
          <div className="stat-icon" style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-light)' }}>
            <AlertCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: outOfStockCount > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
              {outOfStockCount}
            </span>
            <span className="stat-label">Out of Stock</span>
          </div>
        </div>

        {/* Stat Card: Low Stock Alert (Yellow hover) */}
        <div className="glass-card stat-card clickable-card card-warning" onClick={() => onViewChange('products')}>
          <div className="stat-icon" style={{ color: 'var(--warning)', backgroundColor: 'var(--warning-light)' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: lowStockCount > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
              {lowStockCount}
            </span>
            <span className="stat-label">Low Stock (≤ 10)</span>
          </div>
        </div>
      </div>

      {/* Low Stock Attention Table Header */}
      <div className="page-header" style={{ marginTop: '3.5rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '1.4rem' }}>Items Requiring Attention</h2>
          <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>Products that are out of stock or running low.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        {lowStockItems.length === 0 ? (
          <div className="empty-container" style={{ padding: '2rem 1rem' }}>
            <Package size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>All Stock Levels Good</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              No products are currently low or out of stock.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>ID</th>
                  <th style={{ width: '40%' }}>Product Name</th>
                  <th style={{ width: '25%', textAlign: 'left' }}>Current Stock</th>
                  <th style={{ width: '25%', textAlign: 'right', paddingRight: '4.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((product) => {
                  const isOutOfStock = product.quantity === 0;
                  const isRestocking = restockingIds[product.id];
                  const isRemoving = removingIds[product.id];
                  
                  return (
                    <tr key={product.id} className={isRemoving ? 'row-fade-out' : ''}>
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>#{product.id}</td>
                      <td>
                        <div className="product-row-name">{product.name}</div>
                        <div className="product-row-description">
                          {isOutOfStock ? (
                            <span style={{ color: 'var(--danger)', fontWeight: 500 }}>Out of Stock</span>
                          ) : (
                            <span style={{ color: 'var(--warning)', fontWeight: 500 }}>Low Stock Alert</span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        <span className={`badge ${isOutOfStock ? 'badge-danger' : 'badge-warning'}`}>
                          {product.quantity} units
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-primary"
                          style={{
                            padding: '0.5rem 1.1rem',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            minWidth: '160px',
                            justifyContent: 'center'
                          }}
                          onClick={() => handleRestock(product.id)}
                          disabled={isRestocking}
                        >
                          {isRestocking ? (
                            <>
                              <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                              Restocking...
                            </>
                          ) : (
                            'Quick Restock (+10)'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

