import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const [staffName, setStaffName] = useState('');
    const [staffId, setStaffId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem('staff_id');
        const name = localStorage.getItem('staff_name');
        
        if (!id || !name) {
            navigate('/staff-login');
            return;
        }
        
        setStaffId(id);
        setStaffName(name);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('staff_logged_in');
        localStorage.removeItem('staff_id');
        localStorage.removeItem('staff_name');
        navigate('/staff-login');
    };

    return (
        <div className="container py-5">
            <div className="card border-0 rounded-4 mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #1B5E20, #4CAF50)' }}>
                <div className="card-body p-4 text-white">
                    <div className="row align-items-center">
                        <div className="col-8">
                            <h4>👋 Welcome, {staffName || 'Staff'}!</h4>
                            <p className="mb-0">Staff ID: {staffId}</p>
                            <p className="mb-0">✅ You are logged in</p>
                        </div>
                        <div className="col-4 text-end">
                            <button onClick={handleLogout} className="btn btn-light text-success btn-sm rounded-pill">Logout</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card shadow-sm rounded-4 text-center">
                        <div className="card-body p-4">
                            <div className="display-4">📋</div>
                            <h2 className="fw-bold text-warning">2</h2>
                            <p className="text-muted">Pending Work</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm rounded-4 text-center">
                        <div className="card-body p-4">
                            <div className="display-4">✅</div>
                            <h2 className="fw-bold text-success">1</h2>
                            <p className="text-muted">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm rounded-4 text-center">
                        <div className="card-body p-4">
                            <div className="display-4">🎯</div>
                            <h2 className="fw-bold text-info">3</h2>
                            <p className="text-muted">Total Work</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-lg rounded-4 mt-4">
                <div className="card-header bg-white border-0 pt-4">
                    <h3 className="fw-bold">📋 Your Tasks</h3>
                </div>
                <div className="card-body p-4">
                    <div className="border-bottom mb-3 pb-3">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h5 className="fw-bold">Beach Cleanup</h5>
                                <p className="text-muted small">📍 Kovalam | 📅 June 20, 2026</p>
                            </div>
                            <div className="col-md-4 text-end">
                                <span className="badge bg-warning fs-6 px-3 py-2">PENDING</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-bottom mb-3 pb-3">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h5 className="fw-bold">Tree Plantation</h5>
                                <p className="text-muted small">📍 Munnar | 📅 June 25, 2026</p>
                            </div>
                            <div className="col-md-4 text-end">
                                <span className="badge bg-warning fs-6 px-3 py-2">PENDING</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h5 className="fw-bold">City Cleanup</h5>
                                <p className="text-muted small">📍 Kochi | 📅 June 15, 2026</p>
                            </div>
                            <div className="col-md-4 text-end">
                                <span className="badge bg-success fs-6 px-3 py-2">COMPLETED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;