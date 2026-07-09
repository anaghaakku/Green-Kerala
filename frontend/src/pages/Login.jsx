import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMessage, setForgotMessage] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setForgotMessage('');
        
        try {
            
            const response = await axios.get('https://green-kerala-api.onrender.com/api/users/');
            let users = [];
            if (response.data.results) {
                users = response.data.results;
            } else if (Array.isArray(response.data)) {
                users = response.data;
            }
            
            const userExists = users.find(u => u.email === forgotEmail);
            
            if (userExists) {
                
                setForgotMessage(` Password reset link sent to ${forgotEmail}. Please check your email.`);
                setForgotEmail('');
                setTimeout(() => {
                    setShowForgotPassword(false);
                    setForgotMessage('');
                }, 3000);
            } else {
                setForgotMessage(' No account found with this email address.');
            }
        } catch (error) {
            console.error('Error:', error);
            setForgotMessage(' Something went wrong. Please try again.');
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-5">
                            {!showForgotPassword ? (
                                <>
                                    <div className="text-center mb-4">
                                        <div className="display-1">🔐</div>
                                        <h2 className="fw-bold">Welcome Back</h2>
                                        <p className="text-muted">Login to your account</p>
                                    </div>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Username</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Enter your username"
                                                value={username} 
                                                onChange={(e) => setUsername(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Password</label>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                placeholder="Enter your password"
                                                value={password} 
                                                onChange={(e) => setPassword(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        <div className="text-end mb-3">
                                            <button 
                                                type="button" 
                                                className="btn btn-link text-success p-0"
                                                onClick={() => setShowForgotPassword(true)}
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="btn btn-success w-100 py-2 fw-bold" 
                                            disabled={loading}
                                        >
                                            {loading ? 'Logging in...' : 'Login'}
                                        </button>
                                    </form>
                                    <p className="text-center mt-3">
                                        Don't have an account? <Link to="/register">Register</Link>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="text-center mb-4">
                                        <div className="display-1">🔑</div>
                                        <h2 className="fw-bold">Forgot Password?</h2>
                                        <p className="text-muted">Enter your email to reset password</p>
                                    </div>
                                    {forgotMessage && (
                                        <div className={`alert ${forgotMessage.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                                            {forgotMessage}
                                        </div>
                                    )}
                                    <form onSubmit={handleForgotPassword}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Email Address</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                placeholder="Enter your registered email"
                                                value={forgotEmail} 
                                                onChange={(e) => setForgotEmail(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="btn btn-success w-100 py-2 fw-bold" 
                                            disabled={forgotLoading}
                                        >
                                            {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                                        </button>
                                    </form>
                                    <div className="text-center mt-3">
                                        <button 
                                            type="button" 
                                            className="btn btn-link text-muted"
                                            onClick={() => {
                                                setShowForgotPassword(false);
                                                setForgotMessage('');
                                            }}
                                        >
                                            ← Back to Login
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;