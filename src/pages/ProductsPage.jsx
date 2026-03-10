import React from 'react';
import { ProductContainer } from '../containers/ProductContainer';

// Page component to support future routing and nested routing
export const ProductsPage = () => {
    return (
        <div className="page-wrapper">
            <header className="page-header">
                <h1>MiniShop Store</h1>
                <p>Your one-stop destination for everything electronics, fashion, and more.</p>
            </header>
            <main>
                {/* Render our smart container */}
                <ProductContainer />
            </main>
        </div>
    );
};
