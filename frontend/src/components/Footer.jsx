import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5 py-4">
            <div className="container text-center">
                <p className="mb-2 fs-5">🌿 HarithaMission - Together for a Greener Kerala</p>
                <div>
                    <Link to="/" className="text-white me-3 text-decoration-none">Home</Link>
                    <Link to="/about" className="text-white me-3 text-decoration-none">About</Link>
                    <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
                </div>
                <p className="mt-3 mb-0 small">&copy; 2026 HarithaMission. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;