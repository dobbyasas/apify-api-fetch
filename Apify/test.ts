import fetch from 'node-fetch';

interface Product {
    id: number;
    price: number;
}

interface ApiResponse {
    total: number;
    count: number;
    products: Product[];
}

function mockFetchProducts(minPrice: number, maxPrice: number): Promise<ApiResponse> {
    let numberOfProducts: number;
    if (maxPrice - minPrice > 1000) {
        numberOfProducts = 1000;
    } else {
        numberOfProducts = Math.floor(Math.random() * 1000);
    }

    let products: Product[] = Array.from({ length: numberOfProducts }, (_, index) => ({ 
        id: index, 
        price: Math.random() * (maxPrice - minPrice) + minPrice 
    }));

    return Promise.resolve({
        total: numberOfProducts,
        count: products.length,
        products: products
    });
}

async function fetchSegment(minPrice: number, maxPrice: number, products: Product[]): Promise<void> {
    const response = await mockFetchProducts(minPrice, maxPrice);

    if (response.count < 1000) {
        products.push(...response.products);
    } else {
        const midPrice = Math.floor((minPrice + maxPrice) / 2);
        await fetchSegment(minPrice, midPrice, products);
        await fetchSegment(midPrice + 1, maxPrice, products);
    }
}

async function getAllProducts(): Promise<Product[]> {
    let products: Product[] = [];

    try {
        await fetchSegment(0, 100000, products);
        return products;
    } catch (error) {
        console.error("Error when fetching products: ", error);
        return [];
    }
}

getAllProducts().then(products => {
    console.log(`Total products fetched: ${products.length}`);
}).catch(error => {
    console.error("Failed fetching products: ", error);
});
