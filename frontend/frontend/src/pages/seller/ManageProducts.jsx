import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import Navbar from '../../components/Navbar';
import { Package, Edit2, Trash2, Plus } from 'lucide-react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stockQuantity: '', category: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await productService.getMyProducts();
            if (res.status) {
                setProducts(res.data);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load products' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        try {
            let res;
            if (editingId) {
                res = await productService.updateProduct(editingId, formData);
            } else {
                res = await productService.createProduct(formData);
            }

            if (res.status) {
                setMessage({ type: 'success', text: editingId ? 'Product updated' : 'Product created' });
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', description: '', price: '', stockQuantity: '', category: '' });
                fetchProducts();
            } else {
                setMessage({ type: 'error', text: res.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Action failed' });
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            category: product.category
        });
        setEditingId(product.id);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        
        try {
            const res = await productService.deleteProduct(id);
            if (res.status) {
                setProducts(products.filter(p => p.id !== id));
                setMessage({ type: 'success', text: 'Product deleted' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete product' });
        }
    };

    if (loading) return <div className="loading-screen">Loading Your Products...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="card-header">
                    <h2>Manage Inventory</h2>
                    <button className="btn-primary" style={{ width: 'auto', margin: 0, padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', description: '', price: '', stockQuantity: '', category: '' }); }}>
                        {showForm ? 'Cancel' : <><Plus size={18} /> Add Product</>}
                    </button>
                </div>

                {message.text && (
                    <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
                        {message.text}
                    </div>
                )}

                {showForm && (
                    <div className="glass-card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea name="description" className="form-input" value={formData.description} onChange={handleInputChange} required rows="3" style={{ resize: 'vertical' }}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Price ($)</label>
                                    <input type="number" step="0.01" min="0.01" name="price" className="form-input" value={formData.price} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Stock Quantity</label>
                                    <input type="number" min="0" name="stockQuantity" className="form-input" value={formData.stockQuantity} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <input type="text" name="category" className="form-input" value={formData.category} onChange={handleInputChange} required />
                            </div>
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Save Changes' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="glass-card wide-card">
                    <div className="table-responsive">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td><span className="badge badge-seller">{product.category}</span></td>
                                        <td>${product.price.toFixed(2)}</td>
                                        <td>{product.stockQuantity}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn-icon" style={{ color: 'var(--primary-color)' }} onClick={() => handleEdit(product)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="btn-icon btn-danger" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center">No products found. Start by adding one!</td>
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

export default ManageProducts;
