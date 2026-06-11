import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2E7D32' }}>
            <div className="container">
                <Link className="navbar-brand fw-bold fs-3" to="/">🌿 HarithaMission</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/waste-pickup">🗑️ Waste Pickup</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/rewards">🎁 Rewards</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/compost-guide">🌱 Compost Guide</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/dashboard">📊 Dashboard</Link></li>
                                <li className="nav-item"><span className="nav-link text-success">👤 {user.username}</span></li>
                                <li className="nav-item"><button onClick={logout} className="nav-link btn btn-link text-danger">Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;