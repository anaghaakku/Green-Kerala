import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2E7D32' }}>
            <div className="container">
                <Link className="navbar-brand fw-bold fs-3" to="/">
                    🌿 HarithaMission
                </Link>
                
                {/* Mobile Toggle Button */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                {/* Collapsible Menu */}
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/waste-pickup" onClick={() => setIsOpen(false)}>🗑️ Waste Pickup</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/rewards" onClick={() => setIsOpen(false)}>🎁 Rewards</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/compost-guide" onClick={() => setIsOpen(false)}>🌱 Compost Guide</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
                       
                                <li className="nav-item"><Link className="nav-link" to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/dashboard" onClick={() => setIsOpen(false)}>📊 Dashboard</Link></li>
                                <li className="nav-item"><span className="nav-link text-success">👤 {user.username}</span></li>
                                <li className="nav-item">
                                    <button onClick={() => { logout(); setIsOpen(false); }} className="nav-link btn btn-link text-danger">
                                        🚪 Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/rewards" onClick={() => setIsOpen(false)}>🎁 Rewards</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/compost-guide" onClick={() => setIsOpen(false)}>🌱 Compost Guide</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
                                <li className="nav-item"><Link className="nav-link btn btn-success text-white px-3 mx-1" to="/login" onClick={() => setIsOpen(false)}>🔐 Login</Link></li>
                                <li className="nav-item"><Link className="nav-link btn btn-outline-light px-3 mx-1" to="/register" onClick={() => setIsOpen(false)}>📝 Register</Link></li>
                                <li className="nav-item"><Link className="nav-link btn btn-warning text-dark px-3 mx-1" to="/staff-login" onClick={() => setIsOpen(false)}>👨‍💼 Staff</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;