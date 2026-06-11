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

        try {
            const response = await axios.post('https://green-kerala-api.onrender.com/api/staff/staff-login/', {
                staff_id: staffId,
                name: name
            });

            if (response.data.success) {
                localStorage.setItem('staff_logged_in', 'true');
                localStorage.setItem('staff_id', response.data.staff_id);
                localStorage.setItem('staff_name', response.data.name);
                navigate('/staff-dashboard');
            } else {
                setError('Invalid Staff ID or Name');
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6 mx-auto">
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
                                        type="text" 
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
                                    className="btn btn-primary w-100 py-2 fw-bold fs-5" 
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
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