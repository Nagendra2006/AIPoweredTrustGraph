import api from '../utils/api';

const getAllProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

const getMyProducts = async () => {
    const response = await api.get('/products/seller');
    return response.data;
};

const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

const updateProduct = async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export const productService = {
    getAllProducts,
    getProductById,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
