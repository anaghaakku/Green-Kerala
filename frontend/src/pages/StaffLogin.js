import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
    const [staffId, setStaffId] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!staffId || !name) {
            setError('Please enter Staff ID and Name');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://green-kerala-api.onrender.com/api/staffapp/staff-login/', {
                staff_id: parseInt(staffId),
                name: name.trim()
            });

            console.log('Login response:', response.data);

            if (response.data.success) {
                // ✅ STORE THE TOKEN
                if (response.data.access) {
                    localStorage.setItem('access_token', response.data.access);
                }
                localStorage.setItem('staff_logged_in', 'true');
                localStorage.setItem('staff_id', response.data.staff_id);
                localStorage.setItem('staff_name', response.data.name);
                if (response.data.staff) {
                    localStorage.setItem('staff_data', JSON.stringify(response.data.staff));
                }
                
                navigate('/staff-dashboard');
            } else {
                setError(response.data.message || 'Invalid Staff ID or Name');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <div className="display-1">👨‍💼</div>
                                <h2 className="fw-bold">Staff Login</h2>
                                <p className="text-muted">Waste Collection Staff Portal</p>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Staff ID</label>
                                    <input 
                                        type="number" 
                                        className="form-control form-control-lg" 
                                        value={staffId} 
                                        onChange={(e) => setStaffId(e.target.value)} 
                                        placeholder="Enter Staff ID"
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="Enter your full name"
                                        required 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-success w-100 py-2 fw-bold rounded-pill" 
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : '🔐 Login'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;