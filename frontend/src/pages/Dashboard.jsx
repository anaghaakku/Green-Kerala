import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <div className="display-1">👤</div>
                                <h2 className="fw-bold">Welcome, {user?.username}!</h2>
                                <p className="text-muted">Your eco-journey starts here</p>
                            </div>
                            <div className="row g-4">
                                <div className="col-md-6"><Link to="/waste-pickup" className="text-decoration-none"><div className="card bg-success text-white text-center h-100"><div className="card-body"><div className="display-4">🗑️</div><h4>Schedule Waste Pickup</h4></div></div></Link></div>
                                <div className="col-md-6"><Link to="/rewards" className="text-decoration-none"><div className="card bg-warning text-white text-center h-100"><div className="card-body"><div className="display-4">🎁</div><h4>Redeem Rewards</h4></div></div></Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;