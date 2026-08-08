import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import Navbar from '../../components/Navbar';
import { Truck, CheckCircle } from 'lucide-react';

const AssignedOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await orderService.getMyOrders();
            if (res.status) {
                setOrders(res.data);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load assigned orders' });
        } finally {
            setLoading(false);
        }
    };

    const markDelivered = async (orderId) => {
        if (!window.confirm("Are you sure this order has been delivered?")) return;
        try {
            const res = await orderService.updateOrderStatus(orderId, 'DELIVERED');
            if (res.status) {
                setMessage({ type: 'success', text: `Order #${orderId} marked as DELIVERED.` });
                fetchOrders();
            } else {
                setMessage({ type: 'error', text: res.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update order status' });
        }
    };

    if (loading) return <div className="loading-screen">Loading Deliveries...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="card-header">
                    <h2>Assigned Deliveries</h2>
                    <Truck size={24} className="text-primary" />
                </div>

                {message.text && (
                    <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
                        {message.text}
                    </div>
                )}
                
                <div className="glass-card wide-card">
                    <div className="table-responsive">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Address (IP Placeholder)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.customerName}</td>
                                        <td>{order.ipAddress}</td>
                                        <td>
                                            <span className={`badge badge-${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.status !== 'DELIVERED' && (
                                                <button 
                                                    className="btn-primary" 
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto', margin: 0 }}
                                                    onClick={() => markDelivered(order.id)}
                                                >
                                                    <CheckCircle size={14} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} /> 
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center">No orders assigned to you yet.</td>
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

export default AssignedOrders;
