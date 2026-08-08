import api from '../utils/api';

const getProfile = async () => {
    const response = await api.get('/users/profile');
    return response.data;
};

const updateProfile = async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
};

const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

const toggleUserStatus = async (id) => {
    const response = await api.put(`/users/${id}/status`);
    return response.data;
};

export const userService = {
    getProfile,
    updateProfile,
    getAllUsers,
    toggleUserStatus
};
