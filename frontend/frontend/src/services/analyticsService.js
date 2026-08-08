import api from '../utils/api';

const getAnalytics = async () => {
    const response = await api.get('/analytics');
    return response.data;
};

export const analyticsService = {
    getAnalytics
};
