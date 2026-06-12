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
        if (user) {
            fetchMyRegistrations();
        }
    }, [user]);

    const fetchMissions = async () => {
        try {
            const response = await axios.get('https://green-kerala-api.onrender.com/api/missions/');
            setMissions(response.data);
        } catch (error) {
            console.error('Error fetching missions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRegistrations = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('https://green-kerala-api.onrender.com/api/registrations/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegisteredMissions(response.data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const handleJoinMission = async (missionId) => {
        if (!user) {
            alert('Please login first to join missions!');
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            await axios.post('https://green-kerala-api.onrender.com/api/registrations/', {
                mission: missionId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setMessage('✅ Successfully joined the mission! You earned 150 points!');
            setTimeout(() => setMessage(''), 5000);
            
            // Refresh missions to update spots
            fetchMissions();
            fetchMyRegistrations();
            
        } catch (error) {
            console.error('Error joining mission:', error);
            alert(error.response?.data?.detail || 'Failed to join mission');
        }
    };

    const isRegistered = (missionId) => {
        return registeredMissions.some(reg => reg.mission === missionId);
    };

    const getStatusBadge = (status) => {
        const colors = {
            'upcoming': 'bg-warning',
            'ongoing': 'bg-info',
            'completed': 'bg-success',
            'cancelled': 'bg-danger'
        };
        return colors[status] || 'bg-secondary';
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
            {/* Hero Section */}
            <div className="text-white text-center py-5 rounded-4 mb-5" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
                <div className="container">
                    <div className="display-1 mb-3">🌍</div>
                    <h1 className="display-3 fw-bold">Eco Missions</h1>
                    <p className="lead fs-4 mt-3">Join eco-missions and earn 150 points per mission!</p>
                    <p>Help us make Kerala greener by participating in our eco-friendly missions.</p>
                </div>
            </div>

            {/* Message Alert */}
            {message && (
                <div className="alert alert-success text-center mb-4">
                    {message}
                </div>
            )}

            {/* Missions Grid */}
            <div className="row g-4">
                {missions.length === 0 ? (
                    <div className="col-12 text-center">
                        <p>No missions available at the moment. Check back soon!</p>
                    </div>
                ) : (
                    missions.map(mission => (
                        <div key={mission.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm border-0 rounded-4 hover-card">
                                <div className="card-body p-4">
                                    <div className="text-center mb-3">
                                        <span className="display-1">{getMissionIcon(mission.title)}</span>
                                    </div>
                                    <h4 className="fw-bold text-center mb-2">{mission.title}</h4>
                                    <p className="text-muted text-center small">{mission.description}</p>
                                    
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span><i className="bi bi-geo-alt"></i> 📍 {mission.location}</span>
                                            <span><i className="bi bi-calendar"></i> 📅 {mission.date}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span><i className="bi bi-clock"></i> ⏰ {mission.time}</span>
                                            <span><i className="bi bi-people"></i> 👥 {mission.spots_available} / {mission.spots_total} spots</span>
                                        </div>
                                        
                                        <div className="progress mb-3" style={{ height: '8px' }}>
                                            <div 
                                                className="progress-bar bg-success" 
                                                style={{ width: `${((mission.spots_total - mission.spots_available) / mission.spots_total) * 100}%` }}
                                            ></div>
                                        </div>
                                        
                                        <span className={`badge ${getStatusBadge(mission.status)} mb-3`}>
                                            {mission.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleJoinMission(mission.id)}
                                        className={`btn w-100 py-2 fw-bold rounded-pill mt-2 ${
                                            isRegistered(mission.id) ? 'btn-secondary' : 
                                            mission.spots_available > 0 && mission.status === 'upcoming' ? 'btn-success' : 'btn-secondary'
                                        }`}
                                        disabled={isRegistered(mission.id) || mission.spots_available <= 0 || mission.status !== 'upcoming'}
                                    >
                                        {isRegistered(mission.id) ? '✅ Already Joined' : 
                                         mission.spots_available <= 0 ? '❌ No Spots Left' :
                                         mission.status !== 'upcoming' ? '📅 Mission Closed' :
                                         '🌿 Join Mission (+150 points)'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* How It Works */}
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card border-0 bg-light rounded-4">
                        <div className="card-body p-5 text-center">
                            <h3 className="fw-bold mb-4">📋 How It Works</h3>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <div className="display-3 mb-2">1️⃣</div>
                                    <h5>Browse Missions</h5>
                                    <p className="text-muted">Find eco-missions near you</p>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="display-3 mb-2">2️⃣</div>
                                    <h5>Join Mission</h5>
                                    <p className="text-muted">Click "Join Mission" to register</p>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="display-3 mb-2">3️⃣</div>
                                    <h5>Earn Points</h5>
                                    <p className="text-muted">Get 150 points per mission + rewards!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to get icon based on mission title
const getMissionIcon = (title) => {
    const icons = {
        'Beach Cleanup': '🏖️',
        'Tree Planting': '🌳',
        'Plastic Free Village': '♻️',
        'River Cleaning': '💧',
        'Organic Farming': '🌾',
        'Wildlife Protection': '🐘'
    };
    return icons[title] || '🌿';
};

export default Missions;