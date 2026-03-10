import React from 'react';
import './ProductSkeleton.css';

// Presentational/Dumb component for loading state
export const ProductSkeleton = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-img"></div>
            <div className="skeleton-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-price"></div>
                <div className="skeleton-desc"></div>
                <div className="skeleton-desc short"></div>
                <div className="skeleton-meta">
                    <div className="skeleton-badge"></div>
                    <div className="skeleton-badge alt"></div>
                </div>
            </div>
            <div className="skeleton-btn"></div>
        </div>
    );
};
