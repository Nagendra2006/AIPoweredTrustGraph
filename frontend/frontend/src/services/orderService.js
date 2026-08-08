import api from '../utils/api';

const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

const getMyOrders = async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
};

const getUnassignedOrders = async () => {
    const response = await api.get('/orders/unassigned');
    return response.data;
};

const assignDeliveryPartner = async (orderId, dpId) => {
    const response = await api.put(`/orders/${orderId}/assign/${dpId}`);
    return response.data;
};

const updateOrderStatus = async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status?status=${status}`);
    return response.data;
};

export const orderService = {
    createOrder,
    getMyOrders,
    getUnassignedOrders,
    assignDeliveryPartner,
    updateOrderStatus
};
