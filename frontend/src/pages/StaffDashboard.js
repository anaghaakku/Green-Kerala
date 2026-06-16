import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const [staffData, setStaffData] = useState(null);
    const [pendingWork, setPendingWork] = useState([]);
    const [completedWork, setCompletedWork] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const staffInfo = localStorage.getItem('staff_data');
        const staffId = localStorage.getItem('staff_id');
        const staffName = localStorage.getItem('staff_name');
        
        if (!staffId || !staffName) {
            navigate('/staff-login');
            return;
        }
        
        if (staffInfo) {
            setStaffData(JSON.parse(staffInfo));
        } else {
            setStaffData({ id: staffId, name: staffName });
        }
        
        fetchStaffWork(staffId);
    }, []);

    const fetchStaffWork = async (staffId) => {
        try {
            // For now, use empty data - you can add real API later
            setPendingWork([
                { id: 1, mission_title: 'Beach Cleanup', mission_location: 'Kovalam', duty_date: '2026-06-20', duty_time: '08:00:00', status: 'pending' },
                { id: 2, mission_title: 'Tree Plantation', mission_location: 'Munnar', duty_date: '2026-06-25', duty_time: '09:30:00', status: 'confirmed' }
            ]);
            setCompletedWork([
                { id: 3, mission_title: 'City Cleanup', mission_location: 'Kochi', duty_date: '2026-06-15', duty_time: '07:00:00', status: 'completed' }
            ]);
        } catch (error) {
            console.error('Error fetching work:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateWorkStatus = async (workId, status) => {
        setMessage(`✅ Work ${status} successfully!`);
        // Update local state
        setPendingWork(prev => prev.filter(w => w.id !== workId));
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('staff_logged_in');
        localStorage.removeItem('staff_id');
        localStorage.removeItem('staff_name');
        localStorage.removeItem('staff_data');
        navigate('/staff-login');
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Header */}
            <div className="card border-0 rounded-4 mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #1B5E20, #4CAF50)' }}>
                <div className="card-body p-4 text-white">
                    <div className="row align-items-center">
                        <div className="col-8">
                            <h4>👋 Welcome, {staffData?.name || 'Staff'}!</h4>
                            <p className="mb-0">Staff ID: {staffData?.id || 'N/A'}</p>
                            <p className="mb-0">✅ Available for duty</p>
                        </div>
                        <div className="col-4 text-end">
                            <button onClick={handleLogout} className="btn btn-light text-success btn-sm rounded-pill">Logout</button>
                        </div>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} text-center`}>
                    {message}
                </div>
            )}

            {/* Stats */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm rounded-4 text-center">
                        <div className="card-body p-4">
                            <div className="display-4">📋</div>
                            <h2 className="fw-bold text-warning">{pendingWork.length}</h2>
                            <p className="text-muted">Pending Work</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm rounded-4 text-center">
                        <div className="card-body p-4">
                            <div className="display-4">✅</div>
                            <h2 className="fw-bold text-success">{completedWork.length}</h2>
                            <p className="text-muted">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm rounded-4 text-center">
                        <div className="card-body p-4">
                            <div className="display-4">🎯</div>
                            <h2 className="fw-bold text-info">{pendingWork.length + completedWork.length}</h2>
                            <p className="text-muted">Total Work</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Work */}
            <div className="card border-0 shadow-lg rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4">
                    <h3 className="fw-bold">📋 Pending Work</h3>
                </div>
                <div className="card-body p-4">
                    {pendingWork.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            <span className="display-4">🎉</span>
                            <p>No pending work! You're all caught up.</p>
                        </div>
                    ) : (
                        pendingWork.map(work => (
                            <div key={work.id} className="border-bottom mb-3 pb-3">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <h5 className="fw-bold">{work.mission_title}</h5>
                                        <p className="text-muted small">
                                            📍 {work.mission_location}<br />
                                            📅 {new Date(work.duty_date).toLocaleDateString()} at {work.duty_time}
                                        </p>
                                    </div>
                                    <div className="col-md-3">
                                        <span className={`badge ${work.status === 'pending' ? 'bg-warning' : 'bg-info'} fs-6 px-3 py-2`}>
                                            {work.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        <button 
                                            className="btn btn-success btn-sm rounded-pill"
                                            onClick={() => updateWorkStatus(work.id, 'completed')}
                                        >
                                            ✅ Complete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Completed Work */}
            {completedWork.length > 0 && (
                <div className="card border-0 shadow-lg rounded-4">
                    <div className="card-header bg-white border-0 pt-4">
                        <h3 className="fw-bold">✅ Completed Work</h3>
                    </div>
                    <div className="card-body p-4">
                        {completedWork.map(work => (
                            <div key={work.id} className="border-bottom mb-3 pb-3">
                                <div className="row align-items-center">
                                    <div className="col-md-8">
                                        <h5 className="fw-bold">{work.mission_title}</h5>
                                        <p className="text-muted small">
                                            📍 {work.mission_location}<br />
                                            📅 {new Date(work.duty_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        <span className="badge bg-success fs-6 px-3 py-2">✅ COMPLETED</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;