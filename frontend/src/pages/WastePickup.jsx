import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';

const WastePickup = () => {
    const { user } = useAuth();
    const { points, addPoints, refreshPoints } = usePoints();
    const [formData, setFormData] = useState({
        waste_type: '',
        estimated_weight: '',
        address: '',
        city: '',
        pincode: '',
        preferred_date: '',
        preferred_time: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [pickupHistory, setPickupHistory] = useState([]);
    const [currentQuote, setCurrentQuote] = useState(0);

    const wastePointsMap = {
        'plastic': 30,
        'paper': 25,
        'glass': 40,
        'metal': 50,
        'ewaste': 60,
        'organic': 20,
        'mixed': 35
    };

    const weightChoices = [
        { value: '1-5', label: '1-5 kg (50 points)' },
        { value: '5-10', label: '5-10 kg (100 points)' },
        { value: '10-20', label: '10-20 kg (200 points)' },
        { value: '20+', label: '20+ kg (350 points)' }
    ];
    
    const timeChoices = [
        { value: 'morning', label: '🌅 Morning (9AM - 12PM)' },
        { value: 'afternoon', label: '☀️ Afternoon (2PM - 5PM)' },
        { value: 'evening', label: '🌙 Evening (5PM - 7PM)' }
    ];

    // Motivational Quotes & Eco Facts
    const quotes = [
        { text: "🌍 The Earth does not belong to us. We belong to the Earth.", author: "Chief Seattle" },
        { text: "♻️ Recycling one aluminum can saves enough energy to run a TV for 3 hours!", author: "Eco Fact" },
        { text: "🌱 The greatest threat to our planet is the belief that someone else will save it.", author: "Robert Swan" },
        { text: "💧 Every plastic bottle you recycle saves enough energy to power a laptop for 25 minutes!", author: "Eco Fact" },
        { text: "🌿 We do not inherit the earth from our ancestors; we borrow it from our children.", author: "Native American Proverb" },
        { text: "🗑️ One ton of recycled paper saves 17 trees, 7,000 gallons of water, and 4,100 kWh of electricity!", author: "Eco Fact" },
        { text: "🌟 Small acts, when multiplied by millions of people, can transform the world.", author: "Unknown" },
        { text: "🌳 A single tree can absorb up to 22 kg of CO2 per year!", author: "Eco Fact" },
        { text: "💚 Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
        { text: "♻️ Recycling one glass bottle saves enough energy to power a computer for 30 minutes!", author: "Eco Fact" }
    ];

    // Change quote every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

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

    const calculatePoints = (wasteType, weightRange) => {
        const pointsPerKg = wastePointsMap[wasteType] || 25;
        const weightPointsMap = {
            '1-5': 50,
            '5-10': 100,
            '10-20': 200,
            '20+': 350
        };
        const basePoints = weightPointsMap[weightRange] || 50;
        return pointsPerKg + basePoints;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
        if (e.target.name === 'waste_type' && formData.estimated_weight) {
            const earnedPoints = calculatePoints(e.target.value, formData.estimated_weight);
            setMessage(`✨ You will earn ${earnedPoints} points for this pickup!`);
        }
        if (e.target.name === 'estimated_weight' && formData.waste_type) {
            const earnedPoints = calculatePoints(formData.waste_type, e.target.value);
            setMessage(`✨ You will earn ${earnedPoints} points for this pickup!`);
        }
    };

    const updateVolunteerPointsInDB = async (newTotalPoints) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            
            await axios.patch(
                'https://green-kerala-api.onrender.com/api/volunteer-profile/',
                { total_points: newTotalPoints },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            console.log('✅ Points updated in database:', newTotalPoints);
        } catch (error) {
            console.error('❌ Error updating points in database:', error);
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

            const pointsEarned = calculatePoints(formData.waste_type, formData.estimated_weight);
            const newTotalPoints = points + pointsEarned;
            
            const requestData = {
                waste_type: formData.waste_type,
                estimated_weight: formData.estimated_weight,
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                preferred_date: formData.preferred_date,
                preferred_time: formData.preferred_time,
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
                await updateVolunteerPointsInDB(newTotalPoints);
                
                setMessage(`✅ Pickup scheduled successfully! You earned ${pointsEarned} points! Total points: ${newTotalPoints}`);
                
                setFormData({
                    waste_type: '',
                    estimated_weight: '',
                    address: '',
                    city: '',
                    pincode: '',
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
                    let errorMsg = '❌ ';
                    if (errorData.estimated_weight) {
                        errorMsg += `Weight: ${errorData.estimated_weight.join(', ')}. `;
                    }
                    if (errorData.preferred_time) {
                        errorMsg += `Time: ${errorData.preferred_time.join(', ')}. `;
                    }
                    setMessage(errorMsg || '❌ Invalid data');
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

    const today = new Date().toISOString().split('T')[0];

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
                            <p className="text-center text-muted">Earn points for every pickup!</p>
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
                                        <tr><th>Waste Type</th><th>Base Points</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>♻️ Plastic</td><td>30 points</td></tr>
                                        <tr><td>📄 Paper</td><td>25 points</td></tr>
                                        <tr><td>🥃 Glass</td><td>40 points</td></tr>
                                        <tr><td>🔩 Metal</td><td>50 points</td></tr>
                                        <tr><td>💻 E-Waste</td><td>60 points</td></tr>
                                        <tr><td>🌿 Organic</td><td>20 points</td></tr>
                                        <tr><td>📦 Mixed</td><td>35 points</td></tr>
                                    </tbody>
                                    <tfoot>
                                        <tr className="table-info">
                                            <td colSpan="2"><small>+ Extra points based on weight range</small></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Waste Type *</label>
                                        <select name="waste_type" className="form-select" value={formData.waste_type} onChange={handleChange} required>
                                            <option value="">Select waste type</option>
                                            <option value="plastic">♻️ Plastic Waste</option>
                                            <option value="paper">📄 Paper & Cardboard</option>
                                            <option value="glass">🥃 Glass Bottles</option>
                                            <option value="metal">🔩 Metal Scrap</option>
                                            <option value="ewaste">💻 E-Waste</option>
                                            <option value="organic">🌿 Organic Waste</option>
                                            <option value="mixed">📦 Mixed Recyclables</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Estimated Weight *</label>
                                        <select name="estimated_weight" className="form-select" value={formData.estimated_weight} onChange={handleChange} required>
                                            <option value="">Select weight range</option>
                                            {weightChoices.map(weight => (
                                                <option key={weight.value} value={weight.value}>{weight.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Address *</label>
                                    <textarea name="address" className="form-control" rows="2" placeholder="Enter street address" value={formData.address} onChange={handleChange} required></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">City *</label>
                                        <input type="text" name="city" className="form-control" placeholder="Enter city" value={formData.city} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Pincode *</label>
                                        <input type="text" name="pincode" className="form-control" placeholder="Enter pincode" value={formData.pincode} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Preferred Date *</label>
                                        <input type="date" name="preferred_date" className="form-control" min={today} value={formData.preferred_date} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Preferred Time *</label>
                                        <select name="preferred_time" className="form-select" value={formData.preferred_time} onChange={handleChange} required>
                                            <option value="">Select time slot</option>
                                            {timeChoices.map(time => (
                                                <option key={time.value} value={time.value}>{time.label}</option>
                                            ))}
                                        </select>
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
                    {/* Motivational Quote / Eco Fact Box - REPLACED Ways to Earn Points */}
                    <div className="card border-0 shadow-lg rounded-4 mb-4" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
                        <div className="card-body p-4 text-center text-white">
                            <div className="display-4 mb-3">🌿</div>
                            <h4 className="fw-bold mb-3">"{quotes[currentQuote].text}"</h4>
                            <p className="mb-0">— {quotes[currentQuote].author}</p>
                            <hr className="bg-white my-3" />
                            <div className="d-flex justify-content-center gap-2">
                                <span className="badge bg-light text-success px-3 py-2">♻️ Recycle</span>
                                <span className="badge bg-light text-success px-3 py-2">🌱 Plant Trees</span>
                                <span className="badge bg-light text-success px-3 py-2">💧 Save Water</span>
                            </div>
                        </div>
                    </div>

                    {/* Pickup History */}
                    <div className="card border-0 shadow-lg rounded-4">
                        <div className="card-header bg-white border-0 pt-4">
                            <h3 className="fw-bold text-center">📋 Pickup History</h3>
                        </div>
                        <div className="card-body p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {pickupHistory.length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    <span className="display-4">🗑️</span>
                                    <p>No pickups yet. Schedule your first pickup!</p>
                                </div>
                            ) : (
                                pickupHistory.map((pickup, index) => (
                                    <div key={index} className="border-bottom mb-3 pb-3">
                                        <div className="d-flex justify-content-between">
                                            <strong>{pickup.waste_type} - {pickup.estimated_weight}</strong>
                                            <span className="text-success fw-bold">+{pickup.points_earned} pts</span>
                                        </div>
                                        <small className="text-muted">{new Date(pickup.preferred_date).toLocaleDateString()} - {pickup.preferred_time}</small>
                                        <div>
                                            <span className={`badge ${pickup.status === 'completed' ? 'bg-success' : pickup.status === 'confirmed' ? 'bg-info' : pickup.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                                                {pickup.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="card-footer bg-white border-0 pb-4 px-4">
                            <div className="alert alert-success mb-0 rounded-3 text-center">
                                <strong>💡 Did you know?</strong> Every kg of waste recycled saves 2.5 kg of CO2 emissions!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WastePickup;