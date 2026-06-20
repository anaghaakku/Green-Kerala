import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const [staffData, setStaffData] = useState(null);
    const [missionDuties, setMissionDuties] = useState([]);
    const [wasteDuties, setWasteDuties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const staffInfo = localStorage.getItem('staff_data');
        const staffId = localStorage.getItem('staff_id');
        const token = localStorage.getItem('access_token');
        
        if (!staffId) {
            navigate('/staff-login');
            return;
        }
        
        if (staffInfo) {
            try {
                setStaffData(JSON.parse(staffInfo));
            } catch (e) {
                fetchStaffProfile(staffId, token);
            }
        } else {
            fetchStaffProfile(staffId, token);
        }
        
        fetchStaffDuties(staffId, token);
    }, []);

    const fetchStaffProfile = async (staffId, token) => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(
                `https://green-kerala-api.onrender.com/api/staffapp/staff/${staffId}/`,
                { headers }
            );
            setStaffData(response.data);
            localStorage.setItem('staff_data', JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching staff profile:', error);
        }
    };

    const fetchStaffDuties = async (staffId, token) => {
        try {
            setLoading(true);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const missionRes = await axios.get(
                `https://green-kerala-api.onrender.com/api/staffapp/mission-duties/?staff_id=${staffId}`,
                { headers }
            );
            setMissionDuties(missionRes.data.results || missionRes.data || []);
            
            const wasteRes = await axios.get(
                `https://green-kerala-api.onrender.com/api/staffapp/waste-pickup-duties/?staff_id=${staffId}`,
                { headers }
            );
            setWasteDuties(wasteRes.data.results || wasteRes.data || []);
            
        } catch (error) {
            console.error('Error fetching duties:', error);
            if (error.response?.status === 401) {
                setMessage('❌ Session expired. Please login again.');
                setTimeout(() => navigate('/staff-login'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (type, dutyId, status) => {
        try {
            const token = localStorage.getItem('access_token');
            const endpoint = type === 'mission' 
                ? `https://green-kerala-api.onrender.com/api/staffapp/mission-duties/${dutyId}/`
                : `https://green-kerala-api.onrender.com/api/staffapp/waste-pickup-duties/${dutyId}/`;
            
            await axios.patch(endpoint, 
                { status: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setMessage(`✅ Status updated to ${status}`);
            fetchStaffDuties(localStorage.getItem('staff_id'), token);
        } catch (error) {
            console.error('Update error:', error);
            setMessage('❌ Failed to update status');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('staff_logged_in');
        localStorage.removeItem('staff_id');
        localStorage.removeItem('staff_name');
        localStorage.removeItem('staff_data');
        localStorage.removeItem('access_token');
        navigate('/staff-login');
    };

    const allDuties = [...missionDuties, ...wasteDuties];
    const pendingDuties = allDuties.filter(d => 
        d.status === 'pending' || d.status === 'confirmed' || d.status === 'in_progress'
    );
    const completedDuties = allDuties.filter(d => 
        d.status === 'completed'
    );

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-success"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    // Default profile image if none uploaded
    const profileImage = staffData?.profile_picture 
        ? `https://green-kerala-api.onrender.com${staffData.profile_picture}`
        : `https://ui-avatars.com/api/?name=${staffData?.name || 'Staff'}&background=2E7D32&color=fff&size=100`;

    return (
        <div className="container py-5">
            {/* Profile Card with Picture */}
            <div className="card border-0 rounded-4 mb-4 shadow-lg">
                <div className="card-body p-4">
                    <div className="row align-items-center">
                        <div className="col-md-2 text-center">
                            {/* Profile Picture */}
                            <img 
                                src={profileImage}
                                alt={staffData?.name || 'Staff'}
                                className="rounded-circle border border-4 border-success"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="col-md-10">
                            <div className="row">
                                <div className="col-md-4">
                                    <label className="text-muted small">Staff ID</label>
                                    <p className="fw-bold fs-5">{staffData?.id || localStorage.getItem('staff_id')}</p>
                                </div>
                                <div className="col-md-4">
                                    <label className="text-muted small">Name</label>
                                    <p className="fw-bold fs-5">{staffData?.name || localStorage.getItem('staff_name')}</p>
                                </div>
                                <div className="col-md-4">
                                    <label className="text-muted small">Role</label>
                                    <p className="fw-bold fs-5">
                                        <span className="badge bg-success">{staffData?.role || 'Staff'}</span>
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <label className="text-muted small">Email</label>
                                    <p className="fw-bold">{staffData?.email || 'N/A'}</p>
                                </div>
                                <div className="col-md-4">
                                    <label className="text-muted small">Phone</label>
                                    <p className="fw-bold">{staffData?.phone || 'N/A'}</p>
                                </div>
                                <div className="col-md-4">
                                    <label className="text-muted small">Status</label>
                                    <p className="fw-bold">
                                        {staffData?.is_available ? (
                                            <span className="badge bg-success">✅ Available</span>
                                        ) : (
                                            <span className="badge bg-danger">❌ Unavailable</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Welcome Header */}
            <div className="card border-0 rounded-4 mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #1B5E20, #4CAF50)' }}>
                <div className="card-body p-4 text-white">
                    <div className="row align-items-center">
                        <div className="col-8">
                            <h4>👋 Welcome, {staffData?.name || 'Staff'}!</h4>
                            <p className="mb-0">Staff ID: {staffData?.id || localStorage.getItem('staff_id')}</p>
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
                            <h2 className="fw-bold text-warning">{pendingDuties.length}</h2>
                            <p className="text-muted">Pending Work</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm rounded-4 text-center">
                        <div className="card-body p-4">
                            <div className="display-4">✅</div>
                            <h2 className="fw-bold text-success">{completedDuties.length}</h2>
                            <p className="text-muted">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm rounded-4 text-center">
                        <div className="card-body p-4">
                            <div className="display-4">🎯</div>
                            <h2 className="fw-bold text-info">{allDuties.length}</h2>
                            <p className="text-muted">Total Duties</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* No Duties */}
            {allDuties.length === 0 && (
                <div className="card border-0 shadow-lg rounded-4">
                    <div className="card-body p-5 text-center">
                        <div className="display-3 mb-3">🎉</div>
                        <h3>No Duties Assigned</h3>
                        <p className="text-muted">You have no pending or completed duties.</p>
                    </div>
                </div>
            )}

            {/* Mission Duties */}
            {missionDuties.length > 0 && (
                <div className="card border-0 shadow-lg rounded-4 mb-4">
                    <div className="card-header bg-white border-0 pt-4">
                        <h3 className="fw-bold">🎯 Mission Duties</h3>
                    </div>
                    <div className="card-body p-4">
                        {missionDuties.map(duty => (
                            <div key={duty.id} className="border-bottom mb-3 pb-3">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <h5 className="fw-bold">{duty.mission_title || `Mission #${duty.mission}`}</h5>
                                        <p className="text-muted small">
                                            📍 {duty.mission_location || 'N/A'}<br />
                                            📅 {duty.duty_date ? new Date(duty.duty_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="col-md-3">
                                        <span className={`badge ${duty.status === 'pending' ? 'bg-warning' : duty.status === 'completed' ? 'bg-success' : 'bg-info'} fs-6 px-3 py-2`}>
                                            {duty.status ? duty.status.toUpperCase() : 'PENDING'}
                                        </span>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        {duty.status !== 'completed' && (
                                            <button 
                                                className="btn btn-success btn-sm rounded-pill"
                                                onClick={() => updateStatus('mission', duty.id, 'completed')}
                                            >
                                                ✅ Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Waste Pickup Duties */}
            {wasteDuties.length > 0 && (
                <div className="card border-0 shadow-lg rounded-4 mb-4">
                    <div className="card-header bg-white border-0 pt-4">
                        <h3 className="fw-bold">🗑️ Waste Pickup Duties</h3>
                    </div>
                    <div className="card-body p-4">
                        {wasteDuties.map(duty => (
                            <div key={duty.id} className="border-bottom mb-3 pb-3">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <h5 className="fw-bold">Pickup #{duty.waste_pickup}</h5>
                                        <p className="text-muted small">
                                            📍 {duty.pickup_address || 'N/A'}<br />
                                            📅 {duty.duty_date ? new Date(duty.duty_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="col-md-3">
                                        <span className={`badge ${duty.status === 'pending' ? 'bg-warning' : duty.status === 'completed' ? 'bg-success' : 'bg-info'} fs-6 px-3 py-2`}>
                                            {duty.status ? duty.status.toUpperCase() : 'PENDING'}
                                        </span>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        {duty.status !== 'completed' && (
                                            <button 
                                                className="btn btn-success btn-sm rounded-pill"
                                                onClick={() => updateStatus('waste', duty.id, 'completed')}
                                            >
                                                ✅ Complete
                                            </button>
                                        )}
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