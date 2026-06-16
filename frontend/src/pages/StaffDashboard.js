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
        if (!staffInfo) {
            navigate('/staff-login');
            return;
        }
        setStaffData(JSON.parse(staffInfo));
        fetchStaffWork();
    }, []);

    const fetchStaffWork = async () => {
        try {
            // Fetch pending duties for this staff
            const staffId = localStorage.getItem('staff_id');
            const response = await axios.get(`https://green-kerala-api.onrender.com/api/staffapp/staff-duties/?staff_id=${staffId}`);
            
            const pending = response.data.filter(d => d.status === 'pending' || d.status === 'confirmed');
            const completed = response.data.filter(d => d.status === 'completed');
            
            setPendingWork(pending);
            setCompletedWork(completed);
        } catch (error) {
            console.error('Error fetching work:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateWorkStatus = async (workId, status) => {
        try {
            await axios.patch(`https://green-kerala-api.onrender.com/api/staffapp/staff-duties/${workId}/`, {
                status: status
            });
            setMessage(`✅ Work ${status} successfully!`);
            fetchStaffWork();
        } catch (error) {
            setMessage('❌ Failed to update status');
        }
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
                            <p className="mb-0">Status: {staffData?.is_available ? '✅ Available' : '❌ Unavailable'}</p>
                        </div>
                        <div className="col-4 text-end">
                            <button onClick={handleLogout} className="btn btn-light text-success btn-sm">Logout</button>
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
                                        {work.status === 'pending' && (
                                            <button 
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => updateWorkStatus(work.id, 'in_progress')}
                                            >
                                                Start
                                            </button>
                                        )}
                                        {work.status === 'in_progress' && (
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                onClick={() => updateWorkStatus(work.id, 'completed')}
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;