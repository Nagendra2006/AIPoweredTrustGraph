import api from '../utils/api';

const getAllFraudCases = async () => {
    const response = await api.get('/fraud-cases');
    return response.data;
};

const getSellerFraudCases = async () => {
    const response = await api.get('/fraud-cases/seller');
    return response.data;
};

const getFraudCaseByOrderId = async (orderId) => {
    const response = await api.get(`/fraud-cases/order/${orderId}`);
    return response.data;
};

export const fraudService = {
    getAllFraudCases,
    getSellerFraudCases,
    getFraudCaseByOrderId
};
