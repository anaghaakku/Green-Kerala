// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const StaffDashboard = () => {
//     const [staffData, setStaffData] = useState(null);
//     const [missionDuties, setMissionDuties] = useState([]);
//     const [wasteDuties, setWasteDuties] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const staffInfo = localStorage.getItem('staff_data');
//         const staffId = localStorage.getItem('staff_id');
//         const token = localStorage.getItem('access_token');
        
//         console.log('Staff ID:', staffId);
//         console.log('Token exists:', !!token);
        
//         if (!staffId) {
//             navigate('/staff-login');
//             return;
//         }
        
//         if (staffInfo) {
//             setStaffData(JSON.parse(staffInfo));
//         }
        
//         fetchStaffDuties(staffId, token);
//     }, []);

//     const fetchStaffDuties = async (staffId, token) => {
//         try {
//             setLoading(true);
            
//             // ✅ USE THE TOKEN FOR AUTHENTICATION
//             const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
//             console.log('Fetching with headers:', headers);
            
//             const missionRes = await axios.get(
//                 `https://green-kerala-api.onrender.com/api/staffapp/mission-duties/?staff_id=${staffId}`,
//                 { headers }
//             );
            
//             console.log('Mission Duties Response:', missionRes.data);
            
//             // ✅ Handle paginated response (results array)
//             const missionData = missionRes.data.results || missionRes.data || [];
//             setMissionDuties(missionData);
            
//             const wasteRes = await axios.get(
//                 `https://green-kerala-api.onrender.com/api/staffapp/waste-pickup-duties/?staff_id=${staffId}`,
//                 { headers }
//             );
            
//             console.log('Waste Duties Response:', wasteRes.data);
            
//             // ✅ Handle paginated response (results array)
//             const wasteData = wasteRes.data.results || wasteRes.data || [];
//             setWasteDuties(wasteData);
            
//         } catch (error) {
//             console.error('Error fetching duties:', error);
//             if (error.response?.status === 401) {
//                 setMessage('❌ Session expired. Please login again.');
//                 setTimeout(() => navigate('/staff-login'), 2000);
//             } else {
//                 setMessage('❌ Failed to load duties');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateStatus = async (type, dutyId, status) => {
//         try {
//             const token = localStorage.getItem('access_token');
//             const endpoint = type === 'mission' 
//                 ? `https://green-kerala-api.onrender.com/api/staffapp/mission-duties/${dutyId}/`
//                 : `https://green-kerala-api.onrender.com/api/staffapp/waste-pickup-duties/${dutyId}/`;
            
//             await axios.patch(endpoint, 
//                 { status: status },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
            
//             setMessage(`✅ Status updated to ${status}`);
//             fetchStaffDuties(localStorage.getItem('staff_id'), token);
//         } catch (error) {
//             console.error('Update error:', error);
//             setMessage('❌ Failed to update status');
//         }
//         setTimeout(() => setMessage(''), 3000);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('staff_logged_in');
//         localStorage.removeItem('staff_id');
//         localStorage.removeItem('staff_name');
//         localStorage.removeItem('staff_data');
//         localStorage.removeItem('access_token');
//         navigate('/staff-login');
//     };

//     const allDuties = [...missionDuties, ...wasteDuties];
//     const pendingDuties = allDuties.filter(d => 
//         d.status === 'pending' || d.status === 'confirmed' || d.status === 'in_progress'
//     );
//     const completedDuties = allDuties.filter(d => 
//         d.status === 'completed'
//     );

//     if (loading) {
//         return (
//             <div className="text-center mt-5">
//                 <div className="spinner-border text-success"></div>
//                 <p>Loading your duties...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="container py-5">
//             <div className="card border-0 rounded-4 mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #1B5E20, #4CAF50)' }}>
//                 <div className="card-body p-4 text-white">
//                     <div className="row align-items-center">
//                         <div className="col-8">
//                             <h4>👋 Welcome, {staffData?.name || 'Staff'}!</h4>
//                             <p className="mb-0">Staff ID: {staffData?.id || localStorage.getItem('staff_id')}</p>
//                             <p className="mb-0">Role: {staffData?.role || 'Staff'}</p>
//                         </div>
//                         <div className="col-4 text-end">
//                             <button onClick={handleLogout} className="btn btn-light text-success btn-sm rounded-pill">Logout</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {message && (
//                 <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} text-center`}>
//                     {message}
//                 </div>
//             )}

//             <div className="row g-4 mb-4">
//                 <div className="col-md-4">
//                     <div className="card shadow-sm rounded-4 text-center">
//                         <div className="card-body p-4">
//                             <div className="display-4">📋</div>
//                             <h2 className="fw-bold text-warning">{pendingDuties.length}</h2>
//                             <p className="text-muted">Pending Work</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-md-4">
//                     <div className="card shadow-sm rounded-4 text-center">
//                         <div className="card-body p-4">
//                             <div className="display-4">✅</div>
//                             <h2 className="fw-bold text-success">{completedDuties.length}</h2>
//                             <p className="text-muted">Completed</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-md-4">
//                     <div className="card shadow-sm rounded-4 text-center">
//                         <div className="card-body p-4">
//                             <div className="display-4">🎯</div>
//                             <h2 className="fw-bold text-info">{allDuties.length}</h2>
//                             <p className="text-muted">Total Duties</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {allDuties.length === 0 && (
//                 <div className="card border-0 shadow-lg rounded-4">
//                     <div className="card-body p-5 text-center">
//                         <div className="display-3 mb-3">🎉</div>
//                         <h3>No Duties Assigned</h3>
//                         <p className="text-muted">You have no pending or completed duties.</p>
//                         <p className="text-muted small">Contact your supervisor for assignments.</p>
//                     </div>
//                 </div>
//             )}

//             {missionDuties.length > 0 && (
//                 <div className="card border-0 shadow-lg rounded-4 mb-4">
//                     <div className="card-header bg-white border-0 pt-4">
//                         <h3 className="fw-bold">🎯 Mission Duties</h3>
//                     </div>
//                     <div className="card-body p-4">
//                         {missionDuties.map(duty => (
//                             <div key={duty.id} className="border-bottom mb-3 pb-3">
//                                 <div className="row align-items-center">
//                                     <div className="col-md-6">
//                                         <h5 className="fw-bold">{duty.mission_title || `Mission #${duty.mission}`}</h5>
//                                         <p className="text-muted small">
//                                             📍 {duty.mission_location || 'N/A'}<br />
//                                             📅 {duty.duty_date ? new Date(duty.duty_date).toLocaleDateString() : 'N/A'}
//                                         </p>
//                                     </div>
//                                     <div className="col-md-3">
//                                         <span className={`badge ${duty.status === 'pending' ? 'bg-warning' : duty.status === 'completed' ? 'bg-success' : 'bg-info'} fs-6 px-3 py-2`}>
//                                             {duty.status ? duty.status.toUpperCase() : 'PENDING'}
//                                         </span>
//                                     </div>
//                                     <div className="col-md-3 text-end">
//                                         {duty.status !== 'completed' && (
//                                             <button 
//                                                 className="btn btn-success btn-sm rounded-pill"
//                                                 onClick={() => updateStatus('mission', duty.id, 'completed')}
//                                             >
//                                                 ✅ Complete
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {wasteDuties.length > 0 && (
//                 <div className="card border-0 shadow-lg rounded-4 mb-4">
//                     <div className="card-header bg-white border-0 pt-4">
//                         <h3 className="fw-bold">🗑️ Waste Pickup Duties</h3>
//                     </div>
//                     <div className="card-body p-4">
//                         {wasteDuties.map(duty => (
//                             <div key={duty.id} className="border-bottom mb-3 pb-3">
//                                 <div className="row align-items-center">
//                                     <div className="col-md-6">
//                                         <h5 className="fw-bold">Pickup #{duty.waste_pickup}</h5>
//                                         <p className="text-muted small">
//                                             📍 {duty.pickup_address || 'N/A'}<br />
//                                             📅 {duty.duty_date ? new Date(duty.duty_date).toLocaleDateString() : 'N/A'}
//                                         </p>
//                                     </div>
//                                     <div className="col-md-3">
//                                         <span className={`badge ${duty.status === 'pending' ? 'bg-warning' : duty.status === 'completed' ? 'bg-success' : 'bg-info'} fs-6 px-3 py-2`}>
//                                             {duty.status ? duty.status.toUpperCase() : 'PENDING'}
//                                         </span>
//                                     </div>
//                                     <div className="col-md-3 text-end">
//                                         {duty.status !== 'completed' && (
//                                             <button 
//                                                 className="btn btn-success btn-sm rounded-pill"
//                                                 onClick={() => updateStatus('waste', duty.id, 'completed')}
//                                             >
//                                                 ✅ Complete
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default StaffDashboard;


import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const [staffData, setStaffData] = useState(null);
    const [missionDuties, setMissionDuties] = useState([]);
    const [wasteDuties, setWasteDuties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [selectedDuty, setSelectedDuty] = useState(null); // For detail view
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
            setStaffData(JSON.parse(staffInfo));
        }
        
        fetchStaffDuties(staffId, token);
    }, []);

    const fetchStaffDuties = async (staffId, token) => {
        try {
            setLoading(true);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const missionRes = await axios.get(
                `https://green-kerala-api.onrender.com/api/staffapp/mission-duties/?staff_id=${staffId}`,
                { headers }
            );
            
            const missionData = missionRes.data.results || missionRes.data || [];
            setMissionDuties(missionData);
            
            const wasteRes = await axios.get(
                `https://green-kerala-api.onrender.com/api/staffapp/waste-pickup-duties/?staff_id=${staffId}`,
                { headers }
            );
            
            const wasteData = wasteRes.data.results || wasteRes.data || [];
            setWasteDuties(wasteData);
            
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
            setSelectedDuty(null); // Close detail view
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

    // ✅ Open duty detail view
    const openDutyDetails = (duty, type) => {
        setSelectedDuty({ ...duty, duty_type: type });
    };

    // ✅ Close detail view
    const closeDutyDetails = () => {
        setSelectedDuty(null);
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
                <p>Loading your duties...</p>
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
                            <p className="mb-0">Staff ID: {staffData?.id || localStorage.getItem('staff_id')}</p>
                            <p className="mb-0">Role: {staffData?.role || 'Staff'}</p>
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

            {/* Duty Details Modal */}
            {selectedDuty && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">
                                    {selectedDuty.duty_type === 'mission' ? '🎯 Mission Duty' : '🗑️ Waste Pickup Duty'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeDutyDetails}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="fw-bold">Title:</label>
                                    <p>{selectedDuty.mission_title || `Pickup #${selectedDuty.waste_pickup}`}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold">Location:</label>
                                    <p>{selectedDuty.mission_location || selectedDuty.pickup_address || 'N/A'}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold">Date:</label>
                                    <p>{selectedDuty.duty_date ? new Date(selectedDuty.duty_date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold">Time:</label>
                                    <p>{selectedDuty.duty_time || 'N/A'}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold">Status:</label>
                                    <span className={`badge ${
                                        selectedDuty.status === 'pending' ? 'bg-warning' : 
                                        selectedDuty.status === 'completed' ? 'bg-success' : 
                                        'bg-info'
                                    } fs-6 px-3 py-2`}>
                                        {selectedDuty.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </div>
                                {selectedDuty.notes && (
                                    <div className="mb-3">
                                        <label className="fw-bold">Notes:</label>
                                        <p>{selectedDuty.notes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                {selectedDuty.status !== 'completed' && (
                                    <button 
                                        className="btn btn-success rounded-pill"
                                        onClick={() => updateStatus(selectedDuty.duty_type, selectedDuty.id, 'completed')}
                                    >
                                        ✅ Complete Duty
                                    </button>
                                )}
                                <button className="btn btn-secondary rounded-pill" onClick={closeDutyDetails}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                        <p className="text-muted">Click on a duty to view details</p>
                    </div>
                    <div className="card-body p-4">
                        {missionDuties.map(duty => (
                            <div 
                                key={duty.id} 
                                className="border-bottom mb-3 pb-3 cursor-pointer"
                                style={{ cursor: 'pointer' }}
                                onClick={() => openDutyDetails(duty, 'mission')}
                            >
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
                                        <button 
                                            className="btn btn-sm btn-outline-success rounded-pill"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDutyDetails(duty, 'mission');
                                            }}
                                        >
                                            👁️ View Details
                                        </button>
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
                        <p className="text-muted">Click on a duty to view details</p>
                    </div>
                    <div className="card-body p-4">
                        {wasteDuties.map(duty => (
                            <div 
                                key={duty.id} 
                                className="border-bottom mb-3 pb-3 cursor-pointer"
                                style={{ cursor: 'pointer' }}
                                onClick={() => openDutyDetails(duty, 'waste')}
                            >
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
                                        <button 
                                            className="btn btn-sm btn-outline-success rounded-pill"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDutyDetails(duty, 'waste');
                                            }}
                                        >
                                            👁️ View Details
                                        </button>
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