import React from 'react';
import './ProductCard.css';

// Dumb/Presentational Component
export const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <div className="img-container">
                <img src={product.thumbnail} alt={product.title} loading="lazy" />
                <span className="category-badge">{product.category}</span>
            </div>
            <div className="product-info">
                <h3>{product.title}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="description">{product.description}</p>
                <div className="product-meta">
                    <span className="rating">★ {product.rating}</span>
                    <span className="stock">{product.stock} in stock</span>
                </div>
            </div>
            <button className="add-to-cart">Add to Cart</button>
        </div>
    );
};
