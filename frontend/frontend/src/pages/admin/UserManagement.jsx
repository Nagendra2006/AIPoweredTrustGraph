import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Navbar from '../../components/Navbar';
import { Check, X, ShieldAlert } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await userService.getAllUsers();
            if (res.status) {
                setUsers(res.data);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load users' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await userService.toggleUserStatus(id);
            if (res.status) {
                setUsers(users.map(u => u.id === id ? res.data : u));
                setMessage({ type: 'success', text: `User status updated for ${res.data.email}` });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update user status' });
        }
    };

    if (loading) return <div className="loading-screen">Loading Users...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="glass-card wide-card">
                    <div className="card-header">
                        <h2>User Management</h2>
                        <ShieldAlert size={24} className="text-primary" />
                    </div>
                    {message.text && (
                        <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
                            {message.text}
                        </div>
                    )}
                    <div className="table-responsive">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td><span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span></td>
                                        <td>
                                            <span className={`badge ${user.active ? 'badge-success' : 'badge-danger'}`}>
                                                {user.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className={`btn-icon ${user.active ? 'btn-danger' : 'btn-success'}`}
                                                onClick={() => handleToggleStatus(user.id)}
                                                title={user.active ? "Deactivate User" : "Activate User"}
                                            >
                                                {user.active ? <X size={16} /> : <Check size={16} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
