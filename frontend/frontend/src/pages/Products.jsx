import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import Navbar from '../components/Navbar';
import { ShoppingBag } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Stock: {product.stockQuantity}
                                    </span>
                                </div>
                                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                                    Sold by: {product.sellerName}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
