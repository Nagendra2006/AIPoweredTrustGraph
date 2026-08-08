import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import Navbar from '../../components/Navbar';
import { ShoppingCart } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
            console.error("Failed to load orders");
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
                    <h2>My Orders</h2>
                    <ShoppingCart size={24} className="text-primary" />
                </div>
                
                <div className="glass-card wide-card">
                    <div className="table-responsive">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Seller</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.productName}</td>
                                        <td>{order.sellerName}</td>
                                        <td>${order.amount.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge badge-${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center">You haven't placed any orders yet.</td>
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

export default MyOrders;
