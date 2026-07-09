import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
        if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
        if (!/[0-9]/.test(password)) errors.push('At least one number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('At least one special character');
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setErrors({});

        const newErrors = {};

        if (!username || username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address (e.g., name@domain.com)';
        }

        if (!phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!city || city.trim().length < 2) {
            newErrors.city = 'City is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordErrors = validatePassword(password);
            if (passwordErrors.length > 0) {
                newErrors.password = `Password must have: ${passwordErrors.join(', ')}`;
            }
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        const result = await register({ 
            username, 
            email, 
            phone, 
            city, 
            password, 
            confirm_password: confirmPassword 
        });

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const hasError = (field) => errors[field] ? true : false;

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <div className="display-1">🌿</div>
                                <h2 className="fw-bold">Create Account</h2>
                                <p className="text-muted">Join HarithaMission</p>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit} noValidate>
                                {/* Username */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Username *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${hasError('username') ? 'is-invalid' : ''}`}
                                        placeholder="Choose a username (min 3 characters)"
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        required 
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback">{errors.username}</div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email *</label>
                                    <input 
                                        type="email" 
                                        className={`form-control ${hasError('email') ? 'is-invalid' : ''}`}
                                        placeholder="your@email.com"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

                                {/* Phone and City */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Phone *</label>
                                        <input 
                                            type="tel" 
                                            className={`form-control ${hasError('phone') ? 'is-invalid' : ''}`}
                                            placeholder="10-digit mobile number"
                                            value={phone} 
                                            onChange={(e) => setPhone(e.target.value)} 
                                            required
                                        />
                                        {errors.phone && (
                                            <div className="invalid-feedback">{errors.phone}</div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">City *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${hasError('city') ? 'is-invalid' : ''}`}
                                            placeholder="Your city"
                                            value={city} 
                                            onChange={(e) => setCity(e.target.value)} 
                                            required
                                        />
                                        {errors.city && (
                                            <div className="invalid-feedback">{errors.city}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Password *</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${hasError('password') ? 'is-invalid' : ''}`}
                                        placeholder="Min 8 characters with uppercase, lowercase, number & special char"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">{errors.password}</div>
                                    )}
                                    <small className="text-muted">
                                        Must include: uppercase, lowercase, number, and special character (!@#$%^&*)
                                    </small>
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Confirm Password *</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${hasError('confirmPassword') ? 'is-invalid' : ''}`}
                                        placeholder="Confirm your password"
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        required 
                                    />
                                    {errors.confirmPassword && (
                                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-success w-100 py-2 fw-bold" 
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Register'}
                                </button>
                            </form>

                            <p className="text-center mt-3">
                                Already have an account? <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;