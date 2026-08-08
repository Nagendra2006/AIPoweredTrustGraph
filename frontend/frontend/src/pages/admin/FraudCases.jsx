import React, { useState, useEffect, useContext } from 'react';
import { fraudService } from '../../services/fraudService';
import Navbar from '../../components/Navbar';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const FraudCases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            let res;
            if (user?.role === 'ADMIN') {
                res = await fraudService.getAllFraudCases();
            } else {
                res = await fraudService.getSellerFraudCases();
            }
            if (res.status) {
                setCases(res.data);
            }
        } catch (err) {
            console.error("Failed to load fraud cases");
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'HIGH': return 'var(--danger-color)';
            case 'MEDIUM': return 'var(--warning-color)';
            case 'LOW': return 'var(--success-color)';
            default: return 'var(--text-muted)';
        }
    };

    if (loading) return <div className="loading-screen">Scanning for Fraud...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="card-header">
                    <h2>Fraud Detection Insights</h2>
                    <ShieldAlert size={24} style={{ color: 'var(--danger-color)' }} />
                </div>
                
                <div className="glass-card wide-card">
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                        AI-powered trust evaluations for recent orders. Orders with HIGH risk should be reviewed manually before fulfillment.
                    </p>
                    <div className="table-responsive">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Risk Score</th>
                                    <th>Risk Level</th>
                                    <th>Decision</th>
                                    <th>AI Explanation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cases.map(c => (
                                    <tr key={c.id}>
                                        <td>#{c.orderId}</td>
                                        <td>{c.productName}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ 
                                                    width: '50px', 
                                                    height: '6px', 
                                                    background: '#e2e8f0',
                                                    borderRadius: '3px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{ 
                                                        height: '100%', 
                                                        width: `${Math.min(c.riskScore * 100, 100)}%`,
                                                        background: getRiskColor(c.riskLevel)
                                                    }}></div>
                                                </div>
                                                {c.riskScore.toFixed(2)}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.25rem',
                                                color: getRiskColor(c.riskLevel),
                                                fontWeight: '600'
                                            }}>
                                                {c.riskLevel === 'HIGH' && <AlertTriangle size={14} />}
                                                {c.riskLevel}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${c.decision === 'BLOCK' ? 'badge-cancelled' : c.decision === 'FLAG_FOR_REVIEW' ? 'badge-assigned' : 'badge-delivered'}`}>
                                                {c.decision}
                                            </span>
                                        </td>
                                        <td style={{ maxWidth: '300px', fontSize: '0.85rem' }}>{c.explanation}</td>
                                    </tr>
                                ))}
                                {cases.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center">No fraud cases detected. System looks healthy!</td>
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

export default FraudCases;
