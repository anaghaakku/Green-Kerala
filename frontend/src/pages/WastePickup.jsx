import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';

const WastePickup = () => {
    const { user } = useAuth();
    const { points, addPoints, refreshPoints } = usePoints();
    const [formData, setFormData] = useState({
        waste_type: '',
        weight: '',
        address: '',
        preferred_date: '',
        preferred_time: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [pickupHistory, setPickupHistory] = useState([]);

    const wastePointsMap = {
        'plastic': 10,
        'paper': 8,
        'glass': 15,
        'electronic': 25,
        'organic': 5,
        'metal': 20
    };

    useEffect(() => {
        fetchPickupHistory();
        refreshPoints();
    }, []);

    const fetchPickupHistory = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const response = await axios.get('https://green-kerala-api.onrender.com/api/pickups/', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setPickupHistory(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const calculatePoints = (wasteType, weight) => {
        const pointsPerKg = wastePointsMap[wasteType] || 10;
        return Math.floor(pointsPerKg * parseFloat(weight || 0));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
        if (e.target.name === 'waste_type' || e.target.name === 'weight') {
            const newWasteType = e.target.name === 'waste_type' ? e.target.value : formData.waste_type;
            const newWeight = e.target.name === 'weight' ? e.target.value : formData.weight;
            if (newWasteType && newWeight) {
                const earnedPoints = calculatePoints(newWasteType, newWeight);
                setMessage(`✨ You will earn ${earnedPoints} points for this pickup!`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setMessage('❌ Please login to schedule a pickup');
                setLoading(false);
                return;
            }

            const pointsEarned = calculatePoints(formData.waste_type, formData.weight);
            
            const requestData = {
                waste_type: formData.waste_type,
                weight: parseFloat(formData.weight),
                address: formData.address,
                preferred_date: formData.preferred_date,
                preferred_time: formData.preferred_time || null,
                notes: formData.notes || '',
                points_earned: pointsEarned,
                status: 'pending'
            };
            
            console.log('Sending pickup request:', requestData);
            
            const response = await axios.post(
                'https://green-kerala-api.onrender.com/api/pickups/',
                requestData,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (response.status === 200 || response.status === 201) {
                addPoints(pointsEarned);
                setMessage(`✅ Pickup scheduled successfully! You earned ${pointsEarned} points!`);
                
                setFormData({
                    waste_type: '',
                    weight: '',
                    address: '',
                    preferred_date: '',
                    preferred_time: '',
                    notes: ''
                });
                
                fetchPickupHistory();
                refreshPoints();
            }
        } catch (error) {
            console.error('Error scheduling pickup:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.status === 401) {
                setMessage('❌ Session expired. Please login again.');
            } else if (error.response?.status === 400) {
                const errorData = error.response?.data;
                if (errorData) {
                    const errorMessages = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                    setMessage(`❌ ${errorMessages}`);
                } else {
                    setMessage('❌ Invalid data. Please check your form.');
                }
            } else {
                setMessage('❌ Failed to schedule pickup. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="card border-0 rounded-4 mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #1B5E20, #4CAF50)' }}>
                <div className="card-body p-4 text-white">
                    <div className="row align-items-center">
                        <div className="col-8">
                            <h5 className="mb-1">💰 Your Balance</h5>
                            <h2 className="display-4 fw-bold mb-0">{points.toLocaleString()}</h2>
                            <small>Eco Points Available</small>
                        </div>
                        <div className="col-4 text-end">
                            <span className="display-1">🏆</span>
                        </div>
                    </div>
                    <div className="progress mt-3" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
                        <div className="progress-bar bg-warning" style={{ width: `${Math.min((points / 5000) * 100, 100)}%` }}></div>
                    </div>
                    <small>Next Milestone: 5,000 points</small>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-lg rounded-4">
                        <div className="card-header bg-white border-0 pt-4">
                            <h2 className="fw-bold text-center">🗑️ Schedule Waste Pickup</h2>
                            <p className="text-center text-muted">Earn points for every kg you recycle!</p>
                        </div>
                        <div className="card-body p-4">
                            {message && (
                                <div className={`alert ${message.includes('✅') ? 'alert-success' : message.includes('✨') ? 'alert-info' : 'alert-danger'} text-center`}>
                                    {message}
                                </div>
                            )}

                            <div className="table-responsive mb-4">
                                <table className="table table-sm table-bordered">
                                    <thead className="table-success">
                                        <tr><th>Waste Type</th><th>Points per KG</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>♻️ Plastic</td><td>10 points/kg</td></tr>
                                        <tr><td>📄 Paper</td><td>8 points/kg</td></tr>
                                        <tr><td>🥃 Glass</td><td>15 points/kg</td></tr>
                                        <tr><td>💻 Electronic</td><td>25 points/kg</td></tr>
                                        <tr><td>🌿 Organic</td><td>5 points/kg</td></tr>
                                        <tr><td>🔩 Metal</td><td>20 points/kg</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Waste Type *</label>
                                        <select name="waste_type" className="form-select" value={formData.waste_type} onChange={handleChange} required>
                                            <option value="">Select waste type</option>
                                            <option value="plastic">♻️ Plastic</option>
                                            <option value="paper">📄 Paper</option>
                                            <option value="glass">🥃 Glass</option>
                                            <option value="electronic">💻 Electronic</option>
                                            <option value="organic">🌿 Organic</option>
                                            <option value="metal">🔩 Metal</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Weight (kg) *</label>
                                        <input type="number" name="weight" className="form-control" placeholder="Enter weight in kg" step="0.1" value={formData.weight} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Pickup Address *</label>
                                    <textarea name="address" className="form-control" rows="2" placeholder="Enter your full address" value={formData.address} onChange={handleChange} required></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Preferred Date *</label>
                                        <input type="date" name="preferred_date" className="form-control" value={formData.preferred_date} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Preferred Time</label>
                                        <input type="time" name="preferred_time" className="form-control" value={formData.preferred_time} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Additional Notes</label>
                                    <textarea name="notes" className="form-control" rows="2" placeholder="Any special instructions?" value={formData.notes} onChange={handleChange}></textarea>
                                </div>

                                <button type="submit" className="btn btn-success w-100 py-3 fw-bold fs-5 rounded-pill" disabled={loading}>
                                    {loading ? (
                                        <span><span className="spinner-border spinner-border-sm me-2"></span>Scheduling...</span>
                                    ) : (
                                        <span>🗑️ Schedule Pickup</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 shadow-lg rounded-4">
                        <div className="card-header bg-white border-0 pt-4">
                            <h3 className="fw-bold text-center">📋 Pickup History</h3>
                        </div>
                        <div className="card-body p-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {pickupHistory.length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    <span className="display-4">🗑️</span>
                                    <p>No pickups yet. Schedule your first pickup!</p>
                                </div>
                            ) : (
                                pickupHistory.map((pickup, index) => (
                                    <div key={index} className="border-bottom mb-3 pb-3">
                                        <div className="d-flex justify-content-between">
                                            <strong>{pickup.waste_type} - {pickup.weight}kg</strong>
                                            <span className="text-success fw-bold">+{pickup.points_earned || calculatePoints(pickup.waste_type, pickup.weight)} pts</span>
                                        </div>
                                        <small className="text-muted">{new Date(pickup.preferred_date).toLocaleDateString()}</small>
                                        <div>
                                            <span className={`badge ${pickup.status === 'completed' ? 'bg-success' : pickup.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                                                {pickup.status || 'pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WastePickup;