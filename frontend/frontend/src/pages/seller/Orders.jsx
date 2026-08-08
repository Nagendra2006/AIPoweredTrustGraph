import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import Navbar from '../../components/Navbar';
import { PackageSearch } from 'lucide-react';

const Orders = () => {
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
            setMessage({ type: 'error', text: 'Failed to load orders' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading Orders...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="card-header">
                    <h2>Customer Orders</h2>
                    <PackageSearch size={24} className="text-primary" />
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
                                    <th>Product</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Delivery Partner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.productName}</td>
                                        <td>{order.customerName}</td>
                                        <td>${order.amount.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge badge-${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{order.deliveryPartnerName || 'Unassigned'}</td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center">No orders have been placed for your products yet.</td>
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

export default Orders;
