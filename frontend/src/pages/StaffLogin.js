import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
    const [staffId, setStaffId] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simple validation
        if (!staffId || !name) {
            setError('Please enter Staff ID and Name');
            setLoading(false);
            return;
        }

        // Store in localStorage (no API call for now)
        localStorage.setItem('staff_logged_in', 'true');
        localStorage.setItem('staff_id', staffId);
        localStorage.setItem('staff_name', name);
        
        setLoading(false);
        navigate('/staff-dashboard');
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
                                        type="text" 
                                        className="form-control" 
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
                                        className="form-control" 
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