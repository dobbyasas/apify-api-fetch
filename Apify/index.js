/**
 * This is my solution to Web Automation Dev - Home assignment
 * 
 * im, using node-fetch@2 since newer version does not allow "require" in the import 
 * - typescript would solve this issue by using import instead of const, but i already started writing code in javascript so this was easier solution for me
 * im pointing it out so you know that i know :)
 * 
 * task was overall pretty simple it took me max one hour to make, but hardest part was the fact that i cant test it really since the API doesnt exist 
 * for testing i recreated the code and mocked the API (test.js)
 */

const fetch = require(`node-fetch`);

//fetching products from the API for a given price range
async function fetchProducts(minPrice, maxPrice) {
    const apiUrl = `https://api.ecommerce.com/products?minPrice=${minPrice}&maxPrice=${maxPrice}`;

    try {
        const response = await fetch(apiUrl);
        return await response.json();
    }
    catch (error) {
        console.error("Error when fetching data: ", error);
        throw error;
    }
}

// fetch products in a specific segment
async function fetchSegment(minPrice, maxPrice, products) {
    const response = await fetchProducts(minPrice, maxPrice);

    if (response.count < 1000) {
        // If less than 1000 products are returned, add them to the products array
        products.push(...response.products);
    }
    else {
        // if 1000 products are returned, the range is divided to fetch more products
        const midPrice = Math.floor((minPrice + maxPrice) / 2);
        await fetchSegment(minPrice, midPrice, products);
        await fetchSegment(midPrice + 1, maxPrice, products);
    }
}

// start fetching (main function)
async function getAllProducts() {
    let products = [];

    try {
        await fetchSegment(0, 100000, products);
        return products;
    }
    catch (error) {
        console.error("Error when fetching products: ", error);
        return [];
    }
}

// calling the main function and logging results
getAllProducts().then(products => {
    console.log(`Total products fetched: ${products.length}`);
}).catch(error => {
    console.error("Failed fethcing products: ", error)
});