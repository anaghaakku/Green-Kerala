import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeMembers: 0,
        missionsDone: 0,
        treesPlanted: 0,
        partnerNGOs: 12
    });
    const [loading, setLoading] = useState(true);
    const [missions, setMissions] = useState([]);

    useEffect(() => {
        fetchRealData();
        fetchMissions();
    }, []);

    const fetchRealData = async () => {
        try {
            // Fetch volunteers count
            const volunteersRes = await axios.get('https://green-kerala-api.onrender.com/api/volunteers/');
            let volunteers = [];
            if (volunteersRes.data.results) {
                volunteers = volunteersRes.data.results;
            } else if (Array.isArray(volunteersRes.data)) {
                volunteers = volunteersRes.data;
            }
            
            // Fetch missions count
            const missionsRes = await axios.get('https://green-kerala-api.onrender.com/api/missions/');
            let missionsList = [];
            if (missionsRes.data.results) {
                missionsList = missionsRes.data.results;
            } else if (Array.isArray(missionsRes.data)) {
                missionsList = missionsRes.data;
            }
            
            // Calculate total points (as trees planted approximation)
            const totalPoints = volunteers.reduce((sum, v) => sum + (v.total_points || 0), 0);
            const treesPlantedApprox = Math.floor(totalPoints / 10);
            
            setStats({
                activeMembers: volunteers.length,
                missionsDone: missionsList.filter(m => m.status === 'completed').length || missionsList.length,
                treesPlanted: treesPlantedApprox,
                partnerNGOs: 12
            });
            
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Fallback to previous hardcoded values
            setStats({
                activeMembers: 1250,
                missionsDone: 85,
                treesPlanted: 5000,
                partnerNGOs: 12
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchMissions = async () => {
        try {
            const response = await axios.get('https://green-kerala-api.onrender.com/api/missions/');
            let missionsList = [];
            if (response.data.results) {
                missionsList = response.data.results;
            } else if (Array.isArray(response.data)) {
                missionsList = response.data;
            }
            
            // Map API data to display format
            const formattedMissions = missionsList.slice(0, 6).map(mission => ({
                id: mission.id,
                title: mission.title,
                location: mission.location,
                date: new Date(mission.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                spots: mission.spots_available || 0,
                icon: getIconForMission(mission.title)
            }));
            
            setMissions(formattedMissions);
        } catch (error) {
            console.error('Error fetching missions:', error);
        }
    };

    const getIconForMission = (title) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('beach') || titleLower.includes('cleanup')) return '🏖️';
        if (titleLower.includes('tree') || titleLower.includes('plant')) return '🌳';
        if (titleLower.includes('plastic')) return '♻️';
        if (titleLower.includes('river') || titleLower.includes('water')) return '💧';
        if (titleLower.includes('organic') || titleLower.includes('farm')) return '🌾';
        if (titleLower.includes('wildlife')) return '🐘';
        return '🌱';
    };

    const handleVolunteer = () => {
        if (user) {
            window.location.href = '/missions';
        } else {
            alert('Please login first to volunteer for missions!');
            window.location.href = '/login';
        }
    };

    return (
        <div>
            <div className="text-white text-center py-5" style={{ backgroundColor: '#1B5E20' }}>
                <div className="container">
                    <h1 className="display-3 fw-bold">🌿 Welcome to HarithaMission</h1>
                    <p className="lead my-4 fs-3">Join the green revolution! Be an eco-warrior and help protect our planet.</p>
                    <button onClick={handleVolunteer} className="btn btn-light btn-lg text-success fw-bold px-4 py-2">Join Now</button>
                </div>
            </div>

            <div className="container my-5">
                <div className="row text-center">
                    <div className="col-md-3 col-6 mb-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <h2 className="display-4 fw-bold text-success">
                                    {loading ? '...' : `${stats.activeMembers}+`}
                                </h2>
                                <p className="text-muted fs-5">Active Members</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-6 mb-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <h2 className="display-4 fw-bold text-success">
                                    {loading ? '...' : `${stats.missionsDone}+`}
                                </h2>
                                <p className="text-muted fs-5">Missions Done</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-6 mb-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <h2 className="display-4 fw-bold text-success">
                                    {loading ? '...' : `${stats.treesPlanted.toLocaleString()}+`}
                                </h2>
                                <p className="text-muted fs-5">Trees Planted</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-6 mb-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <h2 className="display-4 fw-bold text-success">{stats.partnerNGOs}</h2>
                                <p className="text-muted fs-5">Partner NGOs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container my-5">
                <h2 className="text-center mb-5 fw-bold">🌱 Upcoming Eco Missions</h2>
                <div className="row">
                    {missions.length > 0 ? (
                        missions.map(mission => (
                            <div key={mission.id} className="col-md-4 mb-4">
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="card-body text-center">
                                        <div className="display-1 mb-3">{mission.icon}</div>
                                        <h5 className="card-title fw-bold fs-4">{mission.title}</h5>
                                        <p className="card-text text-muted fs-6">
                                            📍 {mission.location}<br />
                                            📅 {mission.date}<br />
                                            👥 {mission.spots} spots available
                                        </p>
                                        <button 
                                            onClick={handleVolunteer}
                                            className="btn btn-success w-100 py-2"
                                        >
                                            Volunteer Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p className="text-muted">No upcoming missions. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Get Involved Button REMOVED */}
        </div>
    );
};

export default Home;