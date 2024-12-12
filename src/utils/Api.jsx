import axios from "axios";
import Helper from "./Helper";

axios.defaults.baseURL = Helper.API_URL

const addProduct = async (details) => {
    try {
        const res = await axios.post('/add-product', details)
        return res?.data;
    } catch (e) {
        return e;
    }
}

const getProducts = async () => {
    try {
        const res = await axios.get('/products')
        return res?.data;
    } catch (e) {
        return e;
    }
}

const getProductBySlug = async (slug) => {
    try {
        const res = await axios.get(`/product/${slug}`)
        return res?.data;
    } catch(e) {
        return e;
    }
}

export default {
    addProduct,
    getProducts,
    getProductBySlug
}