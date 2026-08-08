import React, { useState, useEffect } from 'react';
import { graphService } from '../../services/graphService';
import Navbar from '../../components/Navbar';
import { Network, Database, Users, MonitorSmartphone, Share2 } from 'lucide-react';

const TrustGraph = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await graphService.getGraphStats();
            if (res.status) {
                setStats(res.data);
            }
        } catch (err) {
            console.error("Failed to load graph stats");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Querying Neo4j Database...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="card-header">
                    <h2>Neo4j Trust Graph Sync</h2>
                    <Network size={24} style={{ color: 'var(--primary-color)' }} />
                </div>
                
                <div className="glass-card wide-card" style={{ marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        The Trust Graph uses a Neo4j backend to securely monitor relationship metadata. 
                        Every time an order is placed, a complex graph relationship (Customer → Order → Seller & Device/IP) is synchronized asynchronously. 
                        These relational vectors power our AI Fraud Detection algorithms.
                    </p>
                </div>

                <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                        <Users size={32} style={{ color: 'var(--primary-color)' }} />
                        <h3>{stats?.users || 0}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>User Nodes</p>
                    </div>
                    
                    <div className="glass-card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                        <Share2 size={32} style={{ color: '#8b5cf6' }} />
                        <h3>{stats?.orders || 0}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Order Nodes</p>
                    </div>
                    
                    <div className="glass-card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                        <MonitorSmartphone size={32} style={{ color: '#10b981' }} />
                        <h3>{stats?.devices || 0}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Device Nodes</p>
                    </div>

                    <div className="glass-card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                        <Database size={32} style={{ color: '#f59e0b' }} />
                        <h3>{stats?.ips || 0}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>IP Nodes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustGraph;
