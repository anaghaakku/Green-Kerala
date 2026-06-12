import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    
    const missions = [
        { id: 1, title: 'Beach Cleanup', location: 'Kovalam', date: 'June 10, 2026', spots: 25, icon: '🏖️' },
        { id: 2, title: 'Tree Planting', location: 'Munnar', date: 'June 15, 2026', spots: 50, icon: '🌳' },
        { id: 3, title: 'Plastic Free Village', location: 'Wayanad', date: 'June 20, 2026', spots: 30, icon: '♻️' },
        { id: 4, title: 'River Cleaning', location: 'Alappuzha', date: 'June 25, 2026', spots: 40, icon: '💧' },
        { id: 5, title: 'Organic Farming', location: 'Palakkad', date: 'July 5, 2026', spots: 35, icon: '🌾' },
        { id: 6, title: 'Wildlife Protection', location: 'Thekkady', date: 'July 12, 2026', spots: 20, icon: '🐘' },
    ];

    const handleVolunteer = () => {
        if (user) {
            window.location.href = '/waste-pickup';
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
                    <Link to="/contact" className="btn btn-light btn-lg text-success fw-bold px-4 py-2">Join Now</Link>
                </div>
            </div>

            <div className="container my-5">
                <div className="row text-center">
                    <div className="col-md-3 col-6 mb-4"><div className="card shadow-sm border-0 h-100"><div className="card-body"><h2 className="display-4 fw-bold text-success">1,250+</h2><p className="text-muted fs-5">Active Members</p></div></div></div>
                    <div className="col-md-3 col-6 mb-4"><div className="card shadow-sm border-0 h-100"><div className="card-body"><h2 className="display-4 fw-bold text-success">85</h2><p className="text-muted fs-5">Missions Done</p></div></div></div>
                    <div className="col-md-3 col-6 mb-4"><div className="card shadow-sm border-0 h-100"><div className="card-body"><h2 className="display-4 fw-bold text-success">5,000+</h2><p className="text-muted fs-5">Trees Planted</p></div></div></div>
                    <div className="col-md-3 col-6 mb-4"><div className="card shadow-sm border-0 h-100"><div className="card-body"><h2 className="display-4 fw-bold text-success">12</h2><p className="text-muted fs-5">Partner NGOs</p></div></div></div>
                </div>
            </div>

            <div className="container my-5">
                <h2 className="text-center mb-5 fw-bold">🌱 Upcoming Eco Missions</h2>
                <div className="row">
                    {missions.map(mission => (
                        <div key={mission.id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body text-center">
                                    <div className="display-1 mb-3">{mission.icon}</div>
                                    <h5 className="card-title fw-bold fs-4">{mission.title}</h5>
                                    <p className="card-text text-muted fs-6">📍 {mission.location}<br />📅 {mission.date}<br />👥 {mission.spots} spots available</p>
                                    <button 
                                        onClick={handleVolunteer}
                                        className="btn btn-success w-100 py-2"
                                    >
                                        Volunteer Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-light py-5 text-center">
                <div className="container">
                    <h2 className="mb-3">🌍 Together we can make Kerala greener</h2>
                    <p className="fs-5 mb-4">Every small action counts. Start your journey with HarithaMission today.</p>
                    <button onClick={handleVolunteer} className="btn btn-success btn-lg px-5 py-2">Get Involved</button>
                </div>
            </div>
        </div>
    );
};

export default Home;