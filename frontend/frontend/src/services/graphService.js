import api from '../utils/api';

const getGraphStats = async () => {
    const response = await api.get('/graph/stats');
    return response.data;
};

export const graphService = {
    getGraphStats
};
