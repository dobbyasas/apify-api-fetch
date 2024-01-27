const fetch = require('node-fetch');

function mockFetchProducts(minPrice, maxPrice) {
    let numberOfProducts;
    if (maxPrice - minPrice > 1000) {
        numberOfProducts = 1000;
    } else {
        numberOfProducts = Math.floor(Math.random() * 1000);
    }

    let products = Array.from({ length: numberOfProducts }, (_, index) => ({ id: index, price: Math.random() * (maxPrice - minPrice) + minPrice }));

    return Promise.resolve({
        total: numberOfProducts,
        count: products.length,
        products: products
    });
}

async function fetchSegment(minPrice, maxPrice, products) {
    const response = await mockFetchProducts(minPrice, maxPrice);

    if (response.count < 1000) {
        products.push(...response.products);
    } else {
        const midPrice = Math.floor((minPrice + maxPrice) / 2);
        await fetchSegment(minPrice, midPrice, products);
        await fetchSegment(midPrice + 1, maxPrice, products);
    }
}

async function getAllProducts() {
    let products = [];

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