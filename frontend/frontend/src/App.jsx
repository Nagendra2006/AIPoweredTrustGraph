import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UserManagement from './pages/admin/UserManagement';
import Products from './pages/Products';
import ManageProducts from './pages/seller/ManageProducts';
import MyOrders from './pages/customer/MyOrders';
import SellerOrders from './pages/seller/Orders';
import AssignedOrders from './pages/delivery/AssignedOrders';
import FraudCases from './pages/admin/FraudCases';
import TrustGraph from './pages/admin/TrustGraph';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          
          <Route path="/seller/products" element={
            <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
              <ManageProducts />
            </ProtectedRoute>
          } />

          <Route path="/customer/orders" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <MyOrders />
            </ProtectedRoute>
          } />

          <Route path="/seller/orders" element={
            <ProtectedRoute allowedRoles={['SELLER']}>
              <SellerOrders />
            </ProtectedRoute>
          } />

          <Route path="/delivery/orders" element={
            <ProtectedRoute allowedRoles={['DELIVERY_PARTNER']}>
              <AssignedOrders />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />

          <Route path="/fraud-cases" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SELLER']}>
              <FraudCases />
            </ProtectedRoute>
          } />

          <Route path="/admin/graph" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <TrustGraph />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
