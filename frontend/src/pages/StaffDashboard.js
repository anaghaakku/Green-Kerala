import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const [assignedPickups, setAssignedPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const staffId = localStorage.getItem('staff_id');
    const staffName = localStorage.getItem('staff_name');

    useEffect(() => {
        if (!staffId) {
            navigate('/staff-login');
            return;
        }
        fetchAssignedPickups();
    }, []);

    const fetchAssignedPickups = async () => {
        try {
            const response = await axios.get(`https://green-kerala-api.onrender.com/api/staff-pickups/${staffId}/`);
            setAssignedPickups(response.data);
        } catch (error) {
            console.error('Error fetching pickups:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (pickupId, status) => {
        try {
            await axios.put(`https://green-kerala-api.onrender.com/api/update-pickup-status/${pickupId}/`, {
                status: status,
                staff_id: staffId
            });
            fetchAssignedPickups();
            alert(`Pickup marked as ${status}`);
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const logout = () => {
        localStorage.removeItem('staff_logged_in');
        localStorage.removeItem('staff_id');
        localStorage.removeItem('staff_name');
        navigate('/staff-login');
    };

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border"></div><p>Loading...</p></div>;
    }

    return (
        <div className="container my-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">👨‍💼 Staff Dashboard</h3>
                    <p>Welcome, {staffName} (ID: {staffId})</p>
                </div>
                <div className="card-body">
                    <button onClick={logout} className="btn btn-danger float-end">Logout</button>
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-header bg-success text-white">
                    <h4>📋 My Assigned Pickups</h4>
                </div>
                <div className="card-body">
                    {assignedPickups.length === 0 ? (
                        <p className="text-muted">No assigned pickups.</p>
                    ) : (
                        assignedPickups.map(pickup => (
                            <div key={pickup.id} className="border rounded p-3 mb-3">
                                <p><strong>Request #{pickup.id}</strong></p>
                                <p>📍 {pickup.address}</p>
                                <p>🗑️ {pickup.waste_type}</p>
                                <p>👤 {pickup.volunteer_name}</p>
                                <p>Status: 
                                    <span className={`badge ms-2 ${pickup.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                        {pickup.status}
                                    </span>
                                </p>
                                <div className="mt-2">
                                    {pickup.status === 'pending' && (
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => updateStatus(pickup.id, 'confirmed')}>
                                            Mark Confirmed
                                        </button>
                                    )}
                                    {pickup.status === 'confirmed' && (
                                        <button className="btn btn-sm btn-success" onClick={() => updateStatus(pickup.id, 'completed')}>
                                            Mark Completed
                                        </button>
                                    )}
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