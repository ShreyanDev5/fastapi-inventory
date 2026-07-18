import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Edit3, Trash2 } from 'lucide-react';
import { getProductById, deleteProduct } from '../services/api';

export default function ProductDetail({ productId, onViewChange, onEditProduct, onProductDeleted }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProductDetails() {
      if (!productId) {
        setError('No product selected.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error(`Failed to load product #${productId}:`, err);
        setError(err.message || 'Failed to retrieve product details.');
      } finally {
        setLoading(false);
      }
    }

    loadProductDetails();
  }, [productId]);

  // Dismiss card if user clicks on the backdrop/overlay itself
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('detail-view-overlay') || e.target === e.currentTarget) {
      onViewChange('products');
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return {
        label: 'Out of Stock',
        badgeClass: 'badge-danger',
        desc: 'Out of stock. Reorder immediately.'
      };
    }
    if (quantity <= 10) {
      return {
        label: 'Low Stock Alert',
        badgeClass: 'badge-warning',
        desc: 'Reorder soon. Stock levels are running low.'
      };
    }
    return {
      label: 'Good Stock Levels',
      badgeClass: 'badge-success',
      desc: 'Sufficient inventory available for regular sales.'
    };
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteProduct(product.id);
      if (onProductDeleted) {
        onProductDeleted();
      }
      onViewChange('products');
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError(err.message || 'Failed to delete the product.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <button className="btn btn-secondary" onClick={() => onViewChange('products')}>
            <ArrowLeft size={16} /> Back to Products
          </button>
        </div>
        <div className="error-container">
          <AlertTriangle className="error-icon" size={32} />
          <h3>Product Lookup Error</h3>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => onViewChange('products')}>
            View All Products
          </button>
        </div>
      </div>
    );
  }

  const stockInfo = getStockStatus(product.quantity);

  return (
    <div className="detail-view-overlay animate-fade-in" onClick={handleOutsideClick} style={{ minHeight: '100vh', cursor: 'default' }}>
      {/* Back button header (stops propagation so clicking it doesn't double-trigger back action) */}
      <div className="page-header" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-secondary" onClick={() => onViewChange('products')}>
          <ArrowLeft size={16} /> Back to Products
        </button>
      </div>

      {/* Main Card (stops propagation to prevent click dismissal) */}
      <div className="glass-card detail-card animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ padding: '2.5rem', maxWidth: '700px', width: '100%' }}>
        <div className="detail-header" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {product.name}
              </h2>
              {/* Product ID inside card */}
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.9rem' }}>
                Product ID: #{product.id}
              </p>
            </div>
            <span className={`badge ${stockInfo.badgeClass}`} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
              {stockInfo.label}
            </span>
          </div>
        </div>

        {/* Premium iOS-style List Details Card */}
        <div className="detail-list" style={{ marginBottom: '2.5rem' }}>
          <div className="detail-row">
            <span className="detail-label-ios">Price Per Unit</span>
            <span className="detail-value-highlight">${parseFloat(product.price).toFixed(2)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label-ios">Current Stock</span>
            <span className="detail-value-ios">{product.quantity} units</span>
          </div>

          <div className="detail-row">
            <span className="detail-label-ios">Stock Status Detail</span>
            <span className="detail-value-ios" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'right', maxWidth: '60%' }}>
              {stockInfo.desc}
            </span>
          </div>

          <div className="detail-row-column">
            <span className="detail-label-ios" style={{ marginBottom: '0.5rem' }}>Description</span>
            <div className="detail-description-box">
              {product.description || 'No description provided for this product.'}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div style={{ display: 'flex', gap: '1.25rem', width: '100%', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => onEditProduct(product)}
            style={{ flex: 1, padding: '0.8rem', height: '2.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
          >
            <Edit3 size={16} /> Edit Product
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleDelete}
            style={{ flex: 1, padding: '0.8rem', height: '2.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
          >
            <Trash2 size={16} /> Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}
