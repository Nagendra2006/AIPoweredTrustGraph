import React, { useState, useEffect, useContext } from 'react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import Navbar from '../components/Navbar';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.getAllProducts();
                if (res.status) {
                    setProducts(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleBuy = async (productId) => {
        if (!user) {
            alert("Please login to buy products");
            return;
        }
        setActionLoading(productId);
        try {
            const orderData = {
                productId: productId,
                deviceId: navigator.userAgent.substring(0, 255), // Simple mock device ID
                ipAddress: "127.0.0.1" // Mock IP for hackathon
            };
            const res = await orderService.createOrder(orderData);
            if (res.status) {
                alert("Order placed successfully!");
                navigate('/dashboard'); // redirect to dashboard to see the order
            } else {
                alert(res.message || "Failed to place order");
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "An error occurred while placing the order.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="loading-screen">Loading Catalog...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="card-header">
                    <h2>Product Catalog</h2>
                    <ShoppingBag size={24} className="text-primary" />
                </div>
                
                {products.length === 0 ? (
                    <div className="glass-card text-center">
                        <p>No products available at the moment.</p>
                    </div>
                ) : (
                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {products.map(product => (
                            <div key={product.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{product.name}</h3>
                                    <span className="badge badge-customer">{product.category}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                    {product.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Stock: {product.stockQuantity}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginBottom: '1rem' }}>
                                    Sold by: {product.sellerName}
                                </div>
                                
                                {user?.role === 'CUSTOMER' && (
                                    <button 
                                        className="btn-primary" 
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                        onClick={() => handleBuy(product.id)}
                                        disabled={actionLoading === product.id || product.stockQuantity === 0}
                                    >
                                        <ShoppingCart size={18} />
                                        {actionLoading === product.id ? 'Processing...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Buy Now'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
