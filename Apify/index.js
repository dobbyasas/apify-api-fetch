"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
function fetchProducts(minPrice, maxPrice) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = `https://api.ecommerce.com/products?minPrice=${minPrice}&maxPrice=${maxPrice}`;
        try {
            const response = yield (0, node_fetch_1.default)(apiUrl);
            return yield response.json();
        }
        catch (error) {
            console.error("Error when fetching data: ", error);
            throw error;
        }
    });
}
function fetchSegment(minPrice, maxPrice, products) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchProducts(minPrice, maxPrice);
        if (response.count < 1000) {
            products.push(...response.products);
        }
        else {
            const midPrice = Math.floor((minPrice + maxPrice) / 2);
            yield fetchSegment(minPrice, midPrice, products);
            yield fetchSegment(midPrice + 1, maxPrice, products);
        }
    });
}
function getAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        let products = [];
        try {
            yield fetchSegment(0, 100000, products);
            return products;
        }
        catch (error) {
            console.error("Error when fetching products: ", error);
            return [];
        }
    });
}
getAllProducts().then(products => {
    console.log('Total products fetched: §{products.lenght}');
}).catch(error => {
    console.error("Failed fetching products: ", error);
});
