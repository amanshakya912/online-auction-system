import axios from "axios";
import Helper from "./Helper";

axios.defaults.baseURL = Helper.API_URL
const token = localStorage.getItem('token');
const userid = localStorage.getItem('id');

const signIn = async (data) => {
    try {
        const res = await axios.post('/signin', data)
        return res?.data
    } catch (error) {
        throw error   
    }
}
const signUp = async (data) => {
    try {
        const res = await axios.post('/signup', data);
        return res?.data;
    } catch (error) {
        throw error;
    }
};

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

const placeBid = async (productId, bidAmount) => {
    try {
        const response = await axios.post('/product/placeBid', {
            productId,
            bidAmount,
            userId: userid
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        // Handle successful bid
        console.log('Bid placed successfully:', response.data);
    } catch (error) {
        if (error.response) {
            // Handle errors returned by the API
            console.log('Error placing bid:', error.response.data.error);
        } else {
            // Handle other errors
            console.log('Error:', error.message);
        }
    }
};

const getUser = async(username) => {
    try {
        const res = await axios.get(`/user?userName=${username}`)
        return res?.data;
    } catch(e) {
        return e;
    }
}

export default {
    signIn,
    signUp,
    addProduct,
    getProducts,
    getProductBySlug,
    placeBid,
    getUser
}