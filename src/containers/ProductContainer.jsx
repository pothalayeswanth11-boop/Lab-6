import React, { useState, useEffect, useRef } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { productService } from '../services/api';
import './ProductContainer.css';

// Container/Smart Component
export const ProductContainer = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Use a ref to store the current AbortController so we can abort previous fetches on new ones
    // This solves race conditions where an older request finishes after a newer one
    const abortControllerRef = useRef(null);

    const loadProducts = async () => {
        // 1. Abort previous fetch if it's still running
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // 2. Create new controller for this fetch
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);
        try {
            // Simulate artificial delay to visible skeleton UI and demonstrate race conditions
            await new Promise(resolve => setTimeout(resolve, 800));

            const data = await productService.fetchProducts(controller.signal);

            // 3. Prevent stale state updates:
            // Check if this request wasn't aborted before updating state 
            if (!controller.signal.aborted) {
                setProducts(data);
                setLoading(false);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        let isMounted = true;

        // Initial load
        if (isMounted) {
            loadProducts();
        }

        // Cleanup function that runs on unmount
        return () => {
            isMounted = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [refreshTrigger]); // Will re-run when refreshTrigger changes

    const handleRefresh = () => {
        productService.clearCache(); // Clear in-memory cache
        setRefreshTrigger(prev => prev + 1); // Trigger re-render and re-fetch
    };

    const handleRaceConditionTest = () => {
        // Spamming this button will trigger multiple rapid fetches.
        // Thanks to the AbortController pattern, only the FINAL request
        // will resolve and update the UI, preventing race conditions.
        loadProducts();
    };

    if (error) {
        return (
            <div className="product-error">
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={handleRefresh} className="btn-refresh">Try Again</button>
            </div>
        );
    }

    return (
        <div className="product-container-wrapper">
            <div className="product-header">
                <h2>Our Products</h2>
                <div className="actions">
                    <span className="attempts" title="Shows closure state over memory">
                        API Attempts: {productService.getFetchAttempts()}
                    </span>
                    <button
                        onClick={handleRefresh}
                        className="btn-refresh"
                        disabled={loading}
                        title="Clears cache and forces new network request"
                    >
                        {loading ? 'Refreshing...' : 'Force Refresh'}
                    </button>
                    <button
                        onClick={handleRaceConditionTest}
                        className="btn-test"
                        title="Spam this to test AbortController race condition handling"
                    >
                        Spam Fetch (Test Race)
                    </button>
                </div>
            </div>

            <div className="product-grid">
                {loading ? (
                    // Render Skeleton UI while loading
                    Array.from({ length: 8 }).map((_, idx) => <ProductSkeleton key={idx} />)
                ) : (
                    // Render actual products when loaded
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
};
