import React, { useState } from 'react';
import { AlertCircle, Plus, Save } from 'lucide-react';
import { createProduct, updateProduct } from '../services/api';

export default function ProductForm({ onViewChange, onProductCreated, onProductUpdated, productToEdit }) {
  const isEditMode = !!productToEdit;

  const [formData, setFormData] = useState({
    name: productToEdit ? productToEdit.name : '',
    description: productToEdit ? productToEdit.description || '' : '',
    price: productToEdit ? productToEdit.price.toString() : '',
    quantity: productToEdit ? productToEdit.quantity.toString() : ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0 || !Number.isInteger(Number(formData.quantity))) {
      newErrors.quantity = 'Quantity must be a positive whole number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const productPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (isEditMode) {
        const updated = await updateProduct(productToEdit.id, productPayload);
        if (onProductUpdated) {
          onProductUpdated(updated);
        }
        onViewChange('product-detail');
      } else {
        const created = await createProduct(productPayload);
        if (onProductCreated) {
          onProductCreated(created.id);
        }
        onViewChange('products');
      }
    } catch (err) {
      console.error('Failed to submit product form:', err);
      setSubmitError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Standardized page header aligned with Dashboard and Inventory pages */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
          <p className="page-subtitle">
            {isEditMode ? `Modify details for product #${productToEdit.id}.` : 'Add a new item to your database.'}
          </p>
        </div>
      </div>

      <div className="glass-card form-wrapper" style={{ maxWidth: '600px' }}>
        {submitError && (
          <div className="error-container" style={{ margin: '0 0 1.5rem 0', padding: '1rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', maxWidth: 'none' }}>
            <AlertCircle className="error-icon" size={20} style={{ marginBottom: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Submission Failed</strong>
              <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{submitError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="e.g. Mechanical Keyboard"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-message"><AlertCircle size={14} /> {errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Provide a detailed description of the product features, specification, etc."
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="e.g. 89.99"
                value={formData.price}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {errors.price && <span className="error-message"><AlertCircle size={14} /> {errors.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Stock Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                step="1"
                className="form-input"
                placeholder="e.g. 24"
                value={formData.quantity}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {errors.quantity && <span className="error-message"><AlertCircle size={14} /> {errors.quantity}</span>}
            </div>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '1.25rem', width: '100%', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onViewChange(isEditMode ? 'product-detail' : 'products')}
              disabled={isSubmitting}
              style={{ flex: 1, padding: '0.8rem', height: '2.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ flex: 1, padding: '0.8rem', height: '2.85rem' }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px', margin: 0 }}></div>
                  {isEditMode ? 'Saving Changes...' : 'Adding Product...'}
                </>
              ) : (
                <>
                  {isEditMode ? <Save size={16} /> : <Plus size={16} />}
                  {isEditMode ? 'Save Changes' : 'Add Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

