import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { Users, ShoppingCart, DollarSign, ShieldAlert, Package, Activity } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await analyticsService.getAnalytics();
            if (res.status) {
                setStats(res.data);
            }
        } catch (err) {
            console.error("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="card-header" style={{ marginBottom: '2rem' }}>
                    <h2>Welcome back, {user?.name}!</h2>
                    <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
                </div>
                
                <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    
                    {user?.role === 'ADMIN' && (
                        <>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                    <DollarSign size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>Total Revenue</p>
                                    <h3>${stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
                                </div>
                            </div>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                    <ShoppingCart size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>Total Orders</p>
                                    <h3>{stats?.totalOrders || 0}</h3>
                                </div>
                            </div>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                    <ShieldAlert size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>Fraud Alerts</p>
                                    <h3>{stats?.totalFraudCases || 0} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>({stats?.highRiskFraudCases || 0} High)</span></h3>
                                </div>
                            </div>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                                    <Users size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>Total Users</p>
                                    <h3>{stats?.totalUsers || 0}</h3>
                                </div>
                            </div>
                        </>
                    )}

                    {user?.role === 'SELLER' && (
                        <>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                    <DollarSign size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>My Revenue</p>
                                    <h3>${stats?.myRevenue?.toFixed(2) || '0.00'}</h3>
                                </div>
                            </div>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                    <Package size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>Total Products</p>
                                    <h3>{stats?.totalProducts || 0}</h3>
                                </div>
                            </div>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                                    <ShoppingCart size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>Orders Received</p>
                                    <h3>{stats?.myOrdersCount || 0}</h3>
                                </div>
                            </div>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                    <ShieldAlert size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>Fraud Cases</p>
                                    <h3>{stats?.totalFraudCases || 0}</h3>
                                </div>
                            </div>
                        </>
                    )}

                    {user?.role === 'CUSTOMER' && (
                        <>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                    <ShoppingCart size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>My Orders</p>
                                    <h3>{stats?.myOrdersCount || 0}</h3>
                                </div>
                            </div>
                            <div className="glass-card stat-card">
                                <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                    <DollarSign size={24} />
                                </div>
                                <div className="stat-content">
                                    <p>Total Spent</p>
                                    <h3>${stats?.myRevenue?.toFixed(2) || '0.00'}</h3>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {user?.role === 'DELIVERY_PARTNER' && (
                        <div className="glass-card wide-card text-center" style={{ padding: '3rem' }}>
                            <Activity size={48} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
                            <h3>Ready for Deliveries</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Check your deliveries tab for new assignments.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
