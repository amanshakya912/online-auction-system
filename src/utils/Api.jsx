import axios from "axios";
import Helper from "./Helper";

axios.defaults.baseURL = Helper.API_URL

// Request interceptor: attach token automatically
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized globally
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('id');
            window.location.href = '/sign-up';
        }
        return Promise.reject(error);
    }
);

// Exponential backoff retry for network errors
const withRetry = async (fn, maxRetries = 3, baseDelay = 500) => {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            // Only retry on network errors or 5xx, not 4xx client errors
            const isNetworkError = !error.response;
            const isServerError = error.response && error.response.status >= 500;
            if (attempt < maxRetries && (isNetworkError || isServerError)) {
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
    throw lastError;
};

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
        const res = await axios.post('/add-product', details, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const updateProduct = async (id, details) => {
    try {
        const res = await axios.put(`/product/${id}`, details)
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const deleteProduct = async (id) => {
    try {
        const res = await axios.delete(`/product/${id}`)
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const addProductDetail = async (features) => {
    try {
        const res = await axios.post('/product-detail/add', features)
        return res?.data
    } catch (e) {
        throw e;
    }
}

let productsCache = null;
let productsCacheTime = 0;
const CACHE_TTL = 5000;

const getProducts = async () => {
    if (productsCache && Date.now() - productsCacheTime < CACHE_TTL) {
        return productsCache;
    }
    try {
        const res = await axios.get('/products')
        productsCache = res?.data;
        productsCacheTime = Date.now();
        return productsCache;
    } catch (e) {
        throw e;
    }
}

const getProductBySlug = async (slug) => {
    try {
        const res = await axios.get(`/product/${slug}`)
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const getProductDetailsById = async (id) => {
    try {
        const res = await axios.get(`/product-detail/${id}`)
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const placeBid = async (productId, bidAmount) => {
    try {
        await axios.post('/product/placeBid', {
            productId,
            bidAmount
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw error
    }
};

const getUser = async (username) => {
    try {
        const res = await axios.get(`/user?userName=${username}`)
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const getUserById = async (id) => {
    try {
        const res = await axios.get(`/user?id=${id}`)
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const getProductByUser = async (id) => {
    try {
        const res = await axios.get(`/products/user/${id}`)
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const editUser = async (data) => {
    try {
        const res = await axios.put('/user/edit', data)
        return res?.data
    } catch (error) {
        throw error
    }
}

const deleteUser = async () => {
    try {
        const res = await axios.delete('/user/delete')
        return res?.data
    } catch (error) {
        throw error
    }
}

const handleAuctionEnd = async (prodId) => {
    try {
        const res = await axios.post(`/end-auction/${prodId}`)
        return res?.data
    } catch (error) {
        throw error
    }
}

const handleBuyNow = async (prodId) => {
    try {
        const res = await axios.post(`/buy-now/${prodId}`);
        return res?.data
    } catch (error) {
        throw error
    }
}

// ─── Checkout ────────────────────────────────────────────────────────────────

const initiateCheckout = async (productId) => {
    return withRetry(async () => {
        const res = await axios.post('/checkout/initiate', { productId });
        return res?.data;
    });
};

const completeCheckout = async (data) => {
    return withRetry(async () => {
        const res = await axios.post('/checkout/complete', data);
        return res?.data;
    });
};

// ─── Orders ──────────────────────────────────────────────────────────────────

const getOrders = async (params = {}) => {
    return withRetry(async () => {
        const res = await axios.get('/orders', { params });
        return res?.data;
    });
};

const getOrderById = async (orderId) => {
    return withRetry(async () => {
        const res = await axios.get(`/orders/${orderId}`);
        return res?.data;
    });
};

// ─── Email Verification ───────────────────────────────────────────────────────

const resendVerification = async () => {
    try {
        const res = await axios.post('/resend-verification');
        return res?.data;
    } catch (error) {
        throw error;
    }
};

const verifyEmail = async (token) => {
    try {
        const res = await axios.get(`/verify-email?token=${token}`);
        return res?.data;
    } catch (error) {
        throw error;
    }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

const getAdminMetrics = async () => {
    return withRetry(async () => {
        const res = await axios.get('/admin/dashboard/metrics');
        return res?.data;
    });
};

const getAdminUsers = async (params = {}) => {
    return withRetry(async () => {
        const res = await axios.get('/admin/users', { params });
        return res?.data;
    });
};

const suspendUser = async (userId, reason) => {
    try {
        const res = await axios.patch(`/admin/users/${userId}/suspend`, { reason });
        return res?.data;
    } catch (error) {
        throw error;
    }
};

const activateUser = async (userId) => {
    try {
        const res = await axios.patch(`/admin/users/${userId}/activate`);
        return res?.data;
    } catch (error) {
        throw error;
    }
};

const getUserActivity = async (userId) => {
    return withRetry(async () => {
        const res = await axios.get(`/admin/users/${userId}/activity`);
        return res?.data;
    });
};

const resetUserPassword = async (userId) => {
    try {
        const res = await axios.post(`/admin/users/${userId}/reset-password`);
        return res?.data;
    } catch (error) {
        throw error;
    }
};

const getAdminAuctions = async (params = {}) => {
    return withRetry(async () => {
        const res = await axios.get('/admin/auctions', { params });
        return res?.data;
    });
};

const getAuctionDetails = async (auctionId) => {
    return withRetry(async () => {
        const res = await axios.get(`/admin/auctions/${auctionId}`);
        return res?.data;
    });
};

const endAuctionEarly = async (auctionId, reason) => {
    try {
        const res = await axios.post(`/admin/auctions/${auctionId}/end`, { reason });
        return res?.data;
    } catch (error) {
        throw error;
    }
};

const flagAuction = async (auctionId) => {
    try {
        const res = await axios.post(`/admin/auctions/${auctionId}/flag`);
        return res?.data;
    } catch (error) {
        throw error;
    }
};

// ─── Stripe Payment Intent ────────────────────────────────────────────────────

const createPaymentIntent = async (orderId) => {
    return withRetry(async () => {
        const res = await axios.post('/payment/create-intent', { orderId });
        return res?.data;
    });
};

export default {
    signIn,
    signUp,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductDetail,
    getProductDetailsById,
    getProducts,
    getProductBySlug,
    placeBid,
    getUser,
    getUserById,
    getProductByUser,
    editUser,
    deleteUser,
    handleAuctionEnd,
    handleBuyNow,
    initiateCheckout,
    completeCheckout,
    getOrders,
    getOrderById,
    resendVerification,
    verifyEmail,
    getAdminMetrics,
    getAdminUsers,
    suspendUser,
    activateUser,
    getUserActivity,
    resetUserPassword,
    getAdminAuctions,
    getAuctionDetails,
    endAuctionEarly,
    flagAuction,
    createPaymentIntent,
}
