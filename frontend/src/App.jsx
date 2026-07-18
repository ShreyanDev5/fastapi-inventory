import React, { useState } from 'react';
import { LayoutDashboard, List, PlusCircle, Package, Check } from 'lucide-react';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSelectProduct = (id) => {
    setSelectedProductId(id);
  };

  const handleProductCreated = (id) => {
    setSelectedProductId(id);
    showToast('Product added successfully!');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setCurrentView('edit-product');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="animate-slide-up">
            <Home onViewChange={setCurrentView} />
          </div>
        );
      case 'products':
        return (
          <div className="animate-slide-up">
            <ProductList 
              onViewChange={setCurrentView} 
              onSelectProduct={handleSelectProduct} 
            />
          </div>
        );
      case 'product-detail':
        return (
          <ProductDetail 
            productId={selectedProductId} 
            onViewChange={setCurrentView} 
            onEditProduct={handleEditProduct}
            onProductDeleted={() => {
              setSelectedProductId(null);
              showToast('Product deleted successfully!');
            }}
          />
        );
      case 'create-product':
        return (
          <div className="animate-slide-up">
            <ProductForm 
              onViewChange={setCurrentView} 
              onProductCreated={handleProductCreated} 
              productToEdit={null}
            />
          </div>
        );
      case 'edit-product':
        return (
          <div className="animate-slide-up">
            <ProductForm 
              onViewChange={setCurrentView} 
              productToEdit={editingProduct}
              onProductUpdated={(updatedProduct) => {
                setSelectedProductId(updatedProduct.id);
                showToast('Product updated successfully!');
              }}
            />
          </div>
        );
      default:
        return (
          <div className="animate-slide-up">
            <Home onViewChange={setCurrentView} />
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-icon">
            <Package size={20} />
          </div>
          <span className="brand-name">Inventory Tracker</span>
        </div>

        <nav>
          <ul className="nav-links">
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentView('home')}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'products' || currentView === 'product-detail' || currentView === 'edit-product' ? 'active' : ''}`}
                onClick={() => setCurrentView('products')}
              >
                <List size={18} />
                <span>Inventory</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'create-product' ? 'active' : ''}`}
                onClick={() => {
                  setEditingProduct(null);
                  setCurrentView('create-product');
                }}
              >
                <PlusCircle size={18} />
                <span>Add Product</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main viewport */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Action Notification Toast */}
      {toast && (
        <div className="toast-notification">
          <Check size={16} style={{ color: 'var(--success)' }} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

