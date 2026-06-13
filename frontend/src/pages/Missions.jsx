import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Missions = () => {
    const { user } = useAuth();
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registeredMissions, setRegisteredMissions] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchMissions();
        fetchMyRegistrations();
    }, []);

    const fetchMissions = async () => {
        try {
            // Using the exact endpoint from your screenshot
            const response = await axios.get('https://green-kerala-api.onrender.com/api/missions/');
            
            console.log('Missions API Response:', response.data);
            
            let missionsArray = [];
            // Handle paginated response (results array)
            if (response.data.results && Array.isArray(response.data.results)) {
                missionsArray = response.data.results;
            } else if (Array.isArray(response.data)) {
                missionsArray = response.data;
            }
            
            console.log('Missions found:', missionsArray.length);
            setMissions(missionsArray);
        } catch (error) {
            console.error('Error fetching missions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRegistrations = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const response = await axios.get('https://green-kerala-api.onrender.com/api/mission-registrations/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            let registrationsArray = [];
            if (response.data.results && Array.isArray(response.data.results)) {
                registrationsArray = response.data.results;
            } else if (Array.isArray(response.data)) {
                registrationsArray = response.data;
            }
            
            setRegisteredMissions(registrationsArray.map(r => r.mission));
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const handleRegister = async (missionId) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setMessage('❌ Please login to register for missions');
                setTimeout(() => setMessage(''), 3000);
                return;
            }

            const response = await axios.post(
                'https://green-kerala-api.onrender.com/api/mission-registrations/',
                { mission: missionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 201) {
                setMessage('✅ Successfully registered for mission!');
                fetchMyRegistrations();
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('❌ Failed to register. Please try again.');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const isRegistered = (missionId) => {
        return registeredMissions.includes(missionId);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading missions...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold">🎯 Our Missions</h1>
                <p className="lead text-muted">Join eco-missions and earn points!</p>
            </div>

            {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} text-center`}>
                    {message}
                </div>
            )}

            {missions.length === 0 ? (
                <div className="alert alert-info text-center">
                    <h4>📢 No Missions Available</h4>
                    <p>Check back soon for new eco-missions!</p>
                </div>
            ) : (
                <div className="row g-4">
                    {missions.map(mission => (
                        <div key={mission.id} className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow-lg rounded-4 h-100">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">
                                            {mission.status || 'ongoing'}
                                        </span>
                                        <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill">
                                            🏆 {mission.spots_available || 0} spots left
                                        </span>
                                    </div>
                                    
                                    <h3 className="fw-bold mb-2">{mission.title}</h3>
                                    <p className="text-muted mb-3">{mission.description}</p>
                                    
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="me-2">📍</span>
                                            <span>{mission.location}</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="me-2">📅</span>
                                            <span>{new Date(mission.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span className="me-2">⏰</span>
                                            <span>{mission.time}</span>
                                        </div>
                                    </div>
                                    
                                    {isRegistered(mission.id) ? (
                                        <button className="btn btn-secondary w-100 py-2 rounded-pill" disabled>
                                            ✅ Already Registered
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-success w-100 py-2 rounded-pill"
                                            onClick={() => handleRegister(mission.id)}
                                            disabled={mission.spots_available <= 0}
                                        >
                                            {mission.spots_available > 0 ? '🎯 Register Now' : 'Sold Out'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Missions;