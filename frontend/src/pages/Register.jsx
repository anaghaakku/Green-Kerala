// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';

// const Register = () => {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const { register } = useAuth();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         if (password !== confirmPassword) {
//             setError('Passwords do not match');
//             setLoading(false);
//             return;
//         }
//         if (password.length < 6) {
//             setError('Password must be at least 6 characters');
//             setLoading(false);
//             return;
//         }
//         const result = await register({ username, email, password, confirm_password: confirmPassword });
//         if (result.success) {
//             navigate('/');
//         } else {
//             setError(result.error);
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="container my-5">
//             <div className="row">
//                 <div className="col-md-6 mx-auto">
//                     <div className="card shadow-sm border-0 rounded-4">
//                         <div className="card-body p-5">
//                             <div className="text-center mb-4">
//                                 <div className="display-1">🌿</div>
//                                 <h2 className="fw-bold">Create Account</h2>
//                                 <p className="text-muted">Join HarithaMission</p>
//                             </div>
//                             {error && <div className="alert alert-danger">{error}</div>}
//                             <form onSubmit={handleSubmit}>
//                                 <div className="mb-3">
//                                     <label className="form-label fw-bold">Username *</label>
//                                     <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label className="form-label fw-bold">Email *</label>
//                                     <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label className="form-label fw-bold">Password *</label>
//                                     <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label className="form-label fw-bold">Confirm Password *</label>
//                                     <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//                                 </div>
//                                 <button type="submit" className="btn btn-success w-100 py-2 fw-bold" disabled={loading}>
//                                     {loading ? 'Creating Account...' : 'Register'}
//                                 </button>
//                             </form>
//                             <p className="text-center mt-3">Already have an account? <Link to="/login">Login</Link></p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Register;

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
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
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
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Username *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Choose a username"
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        required 
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email *</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="your@email.com"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Phone</label>
                                        <input 
                                            type="tel" 
                                            className="form-control" 
                                            placeholder="Mobile number"
                                            value={phone} 
                                            onChange={(e) => setPhone(e.target.value)} 
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">City</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Your city"
                                            value={city} 
                                            onChange={(e) => setCity(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Password *</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Min 6 characters"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Confirm Password *</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Confirm your password"
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        required 
                                    />
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