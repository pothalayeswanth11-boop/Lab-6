import React from 'react';
import { ProductsPage } from './pages/ProductsPage';
import './App.css';

// Root component for future routing
function App() {
  return (
    <div className="app">
      {/* Ready for react-router-dom <Routes> here */}
      <ProductsPage />
    </div>
  );
}

export default App;
