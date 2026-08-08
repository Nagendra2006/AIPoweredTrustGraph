import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Users, Home, ShoppingBag, Package, ShoppingCart, PackageSearch, Truck, ShieldAlert, Network } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar glass-nav">
            <div className="nav-brand">
                <Link to="/dashboard">TrustGraph</Link>
            </div>
            <div className="nav-links">
                <Link to="/dashboard" className="nav-item">
                    <Home size={18} /> Dashboard
                </Link>
                
                <Link to="/products" className="nav-item">
                    <ShoppingBag size={18} /> Products
                </Link>
                
                {user.role === 'CUSTOMER' && (
                    <Link to="/customer/orders" className="nav-item">
                        <ShoppingCart size={18} /> My Orders
                    </Link>
                )}

                {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                    <Link to="/seller/products" className="nav-item">
                        <Package size={18} /> Inventory
                    </Link>
                )}

                {user.role === 'SELLER' && (
                    <Link to="/seller/orders" className="nav-item">
                        <PackageSearch size={18} /> Orders
                    </Link>
                )}

                {user.role === 'DELIVERY_PARTNER' && (
                    <Link to="/delivery/orders" className="nav-item">
                        <Truck size={18} /> Deliveries
                    </Link>
                )}

                {(user.role === 'ADMIN' || user.role === 'SELLER') && (
                    <Link to="/fraud-cases" className="nav-item">
                        <ShieldAlert size={18} /> Trust & Safety
                    </Link>
                )}

                {user.role === 'ADMIN' && (
                    <Link to="/admin/graph" className="nav-item">
                        <Network size={18} /> Neo4j Graph
                    </Link>
                )}
                
                {user.role === 'ADMIN' && (
                    <Link to="/admin/users" className="nav-item">
                        <Users size={18} /> Users
                    </Link>
                )}
                
                <Link to="/profile" className="nav-item">
                    <User size={18} /> Profile
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
