import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <div className="display-1">🔐</div>
                                <h2 className="fw-bold">Welcome Back</h2>
                                <p className="text-muted">Login to your account</p>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Username</label>
                                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Password</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-success w-100 py-2 fw-bold" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                            <p className="text-center mt-3">Don't have an account? <Link to="/register">Register</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;