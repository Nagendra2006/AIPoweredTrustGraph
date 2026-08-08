import React, { useState, useEffect, useContext } from 'react';
import { userService } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState({ name: '', phoneNumber: '', email: '', role: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await userService.getProfile();
                if (res.status) {
                    setProfile(res.data);
                }
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to load profile' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await userService.updateProfile({ name: profile.name, phoneNumber: profile.phoneNumber });
            if (res.status) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: res.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred while updating' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading Profile...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div className="glass-card profile-card">
                    <h2>My Profile</h2>
                    {message.text && (
                        <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <input type="text" className="form-input" value={profile.role} disabled />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input" value={profile.email} disabled />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                className="form-input" 
                                value={profile.name || ''} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input 
                                type="text" 
                                name="phoneNumber" 
                                className="form-input" 
                                value={profile.phoneNumber || ''} 
                                onChange={handleChange} 
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
