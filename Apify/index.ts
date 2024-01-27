import fetch from 'node-fetch';

interface ApiResponse {
    total: number;
    count: number;
    products: any[];
}

async function fetchProducts(minPrice: number, maxPrice: number): Promise<ApiResponse> {
    const apiUrl = `https://api.ecommerce.com/products?minPrice=${minPrice}&maxPrice=${maxPrice}`;

    try {
        const response = await fetch(apiUrl);
        return await response.json() as ApiResponse;
    }
    catch (error) {
        console.error("Error when fetching data: ", error);
        throw error;
    }
}

async function  fetchSegment(minPrice: number, maxPrice: number, products: any[]): Promise<void> {
    const response = await fetchProducts(minPrice, maxPrice);

    if (response.count < 1000) {
        products.push(...response.products);
    }
    else {
        const midPrice = Math.floor((minPrice + maxPrice) / 2);
        await fetchSegment(minPrice, midPrice, products);
        await fetchSegment(midPrice + 1, maxPrice, products);
    }
}

async function getAllProducts(): Promise<any[]> {
    let products: any[] = [];

    try {
        await fetchSegment(0, 100000, products);
        return products;
    }
    catch (error) {
        console.error("Error when fetching products: ", error);
        return [];
    }
}

getAllProducts().then(products => {
    console.log('Total products fetched: §{products.lenght}');
}).catch(error => {
    console.error("Failed fetching products: ", error);
});