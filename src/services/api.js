// src/services/api.js

export const createProductService = () => {
    // Closure state
    let cache = null;
    let lastFetchTimestamp = null;
    let fetchAttempts = 0;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

    const fetchProducts = async (signal) => {
        fetchAttempts++;
        console.log(`API Fetch attempt #${fetchAttempts}`);

        const now = Date.now();
        // Check in-memory cache
        if (cache && lastFetchTimestamp && (now - lastFetchTimestamp < CACHE_DURATION)) {
            console.log('Returning data from memory cache');
            return cache;
        }

        try {
            console.log('Fetching new data from network');
            // Using async/await and promise chains
            const response = await fetch('https://dummyjson.com/products', { signal });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Update cache
            cache = data.products;
            lastFetchTimestamp = Date.now();

            return cache;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted to prevent race condition');
            }
            throw error;
        }
    };

    return {
        fetchProducts,
        getFetchAttempts: () => fetchAttempts,
        clearCache: () => {
            cache = null;
            lastFetchTimestamp = null;
            console.log('Cache cleared');
        }
    };
};

export const productService = createProductService();
