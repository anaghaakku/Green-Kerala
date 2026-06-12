// import { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// const WastePickup = () => {
//     const { user } = useAuth();
//     const [formData, setFormData] = useState({
//         waste_type: 'plastic',
//         estimated_weight: '1-5',
//         address: '',
//         city: '',
//         pincode: '',
//         preferred_date: '',
//         preferred_time: 'morning'
//     });
//     const [status, setStatus] = useState('');

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setStatus('submitting');
//         try {
//             const token = localStorage.getItem('access_token');
//             await axios.post('https://green-kerala-api.onrender.com/api/pickups/', formData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setStatus('success');
//             setTimeout(() => setStatus(''), 3000);
//         } catch (error) {
//             setStatus('error');
//         }
//     };

//     const wasteTypes = [
//         { value: 'plastic', label: '🥤 Plastic Waste', points: 30 },
//         { value: 'paper', label: '📰 Paper & Cardboard', points: 25 },
//         { value: 'glass', label: '🥂 Glass Bottles', points: 40 },
//         { value: 'metal', label: '🔩 Metal Scrap', points: 50 },
//         { value: 'ewaste', label: '💻 E-Waste', points: 60 },
//     ];

//     return (
//         <div className="container my-5">
//             <div className="row">
//                 <div className="col-lg-7 mx-auto">
//                     <h1 className="text-center mb-4 fw-bold">🗑️ Waste Collection Service</h1>
//                     <p className="text-center text-muted mb-5">Schedule a free waste collection pickup. Earn eco-points for every kg you recycle!</p>
                    
//                     <div className="row mb-5">
//                         <div className="col-md-4 mb-3"><div className="card bg-success text-white text-center"><div className="card-body"><div className="display-4">🚛</div><h5>Free Pickup</h5></div></div></div>
//                         <div className="col-md-4 mb-3"><div className="card bg-info text-white text-center"><div className="card-body"><div className="display-4">🪙</div><h5>Earn Points</h5></div></div></div>
//                         <div className="col-md-4 mb-3"><div className="card bg-warning text-white text-center"><div className="card-body"><div className="display-4">♻️</div><h5>100% Recycling</h5></div></div></div>
//                     </div>

//                     <div className="card shadow-sm border-0">
//                         <div className="card-body p-4">
//                             <h3 className="mb-4 fw-bold">📝 Schedule Waste Pickup</h3>
//                             {status === 'success' && <div className="alert alert-success">✅ Pickup request submitted successfully!</div>}
//                             {status === 'error' && <div className="alert alert-danger">❌ Failed to submit. Please try again.</div>}
//                             <form onSubmit={handleSubmit}>
//                                 <div className="mb-3"><label className="form-label fw-bold">Waste Type *</label><select name="waste_type" className="form-select" value={formData.waste_type} onChange={handleChange}>{wasteTypes.map(w => <option key={w.value} value={w.value}>{w.label} (+{w.points} pts)</option>)}</select></div>
//                                 <div className="mb-3"><label className="form-label fw-bold">Weight *</label><select name="estimated_weight" className="form-select" value={formData.estimated_weight} onChange={handleChange}><option value="1-5">1-5 kg</option><option value="5-10">5-10 kg</option><option value="10-20">10-20 kg</option><option value="20+">20+ kg</option></select></div>
//                                 <div className="mb-3"><label className="form-label fw-bold">Address *</label><textarea name="address" className="form-control" rows="2" value={formData.address} onChange={handleChange} required></textarea></div>
//                                 <div className="row"><div className="col-md-6 mb-3"><input type="text" name="city" className="form-control" placeholder="City" value={formData.city} onChange={handleChange} required /></div><div className="col-md-6 mb-3"><input type="text" name="pincode" className="form-control" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required /></div></div>
//                                 <div className="mb-3"><label className="form-label fw-bold">Preferred Date *</label><input type="date" name="preferred_date" className="form-control" value={formData.preferred_date} onChange={handleChange} required /></div>
//                                 <button type="submit" className="btn btn-success w-100 py-3 fw-bold fs-5">🚛 Schedule Pickup</button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WastePickup;


import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WastePickup = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        waste_type: 'plastic',
        estimated_weight: '1-5',
        address: '',
        city: '',
        pincode: '',
        preferred_date: '',
        preferred_time: 'morning',
        notes: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        // Check if user is logged in
        const token = localStorage.getItem('access_token');
        if (!token) {
            setStatus('error');
            alert('Please login first to schedule waste pickup');
            return;
        }

        // Validate required fields
        if (!formData.address || !formData.city || !formData.pincode || !formData.preferred_date) {
            setStatus('error');
            alert('Please fill all required fields');
            return;
        }

        try {
            const response = await axios.post('https://green-kerala-api.onrender.com/api/pickups/', {
                waste_type: formData.waste_type,
                estimated_weight: formData.estimated_weight,
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                preferred_date: formData.preferred_date,
                preferred_time: formData.preferred_time,
                notes: formData.notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Pickup created:', response.data);
            setStatus('success');
            // Reset form
            setFormData({
                waste_type: 'plastic',
                estimated_weight: '1-5',
                address: '',
                city: '',
                pincode: '',
                preferred_date: '',
                preferred_time: 'morning',
                notes: ''
            });
            setTimeout(() => setStatus(''), 5000);
            
        } catch (error) {
            console.error('Error details:', error.response?.data);
            setStatus('error');
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to submit. Please try again.';
            alert(errorMsg);
        }
    };

    const wasteTypes = [
        { value: 'plastic', label: '🥤 Plastic Waste', points: 30 },
        { value: 'paper', label: '📰 Paper & Cardboard', points: 25 },
        { value: 'glass', label: '🥂 Glass Bottles', points: 40 },
        { value: 'metal', label: '🔩 Metal Scrap', points: 50 },
        { value: 'ewaste', label: '💻 E-Waste', points: 60 },
        { value: 'organic', label: '🍂 Organic Waste', points: 20 },
        { value: 'mixed', label: '📦 Mixed Recyclables', points: 35 }
    ];

    const weightOptions = [
        { value: '1-5', label: '1-5 kg', points: 50 },
        { value: '5-10', label: '5-10 kg', points: 100 },
        { value: '10-20', label: '10-20 kg', points: 200 },
        { value: '20+', label: '20+ kg', points: 350 }
    ];

    const timeOptions = [
        { value: 'morning', label: 'Morning (9AM - 12PM)' },
        { value: 'afternoon', label: 'Afternoon (2PM - 5PM)' },
        { value: 'evening', label: 'Evening (5PM - 7PM)' }
    ];

    const selectedWaste = wasteTypes.find(w => w.value === formData.waste_type);
    const selectedWeight = weightOptions.find(w => w.value === formData.estimated_weight);
    const estimatedPoints = (selectedWaste?.points || 0) + (selectedWeight?.points || 0);

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-lg-7 mx-auto">
                    <h1 className="text-center mb-4 fw-bold">🗑️ Waste Collection Service</h1>
                    <p className="text-center text-muted mb-5">
                        Schedule a free waste collection pickup. Earn eco-points for every kg you recycle!
                    </p>

                    {/* Info Cards */}
                    <div className="row mb-5">
                        <div className="col-md-4 mb-3">
                            <div className="card bg-success text-white text-center h-100">
                                <div className="card-body">
                                    <div className="display-4">🚛</div>
                                    <h5>Free Pickup</h5>
                                    <small>No charges</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card bg-info text-white text-center h-100">
                                <div className="card-body">
                                    <div className="display-4">🪙</div>
                                    <h5>Earn Points</h5>
                                    <small>Up to 350 points</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card bg-warning text-white text-center h-100">
                                <div className="card-body">
                                    <div className="display-4">♻️</div>
                                    <h5>100% Recycling</h5>
                                    <small>Eco-friendly</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estimated Points Banner */}
                    <div className="alert alert-success text-center mb-4">
                        <strong>🎁 Estimated Points: +{estimatedPoints} points</strong>
                        <br />
                        <small>Points calculated based on waste type and weight</small>
                    </div>

                    {/* Pickup Form */}
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h3 className="mb-4 fw-bold">📝 Schedule Waste Pickup</h3>
                            
                            {status === 'success' && (
                                <div className="alert alert-success">
                                    ✅ Pickup request submitted successfully! Our team will contact you soon.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="alert alert-danger">
                                    ❌ Failed to submit. Please try again.
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Waste Type *</label>
                                    <select 
                                        name="waste_type" 
                                        className="form-select" 
                                        value={formData.waste_type} 
                                        onChange={handleChange}
                                        required
                                    >
                                        {wasteTypes.map(w => (
                                            <option key={w.value} value={w.value}>{w.label} (+{w.points} pts)</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Estimated Weight *</label>
                                    <select 
                                        name="estimated_weight" 
                                        className="form-select" 
                                        value={formData.estimated_weight} 
                                        onChange={handleChange}
                                        required
                                    >
                                        {weightOptions.map(w => (
                                            <option key={w.value} value={w.value}>{w.label} (+{w.points} pts)</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Address *</label>
                                    <textarea 
                                        name="address" 
                                        className="form-control" 
                                        rows="2" 
                                        value={formData.address} 
                                        onChange={handleChange}
                                        placeholder="Enter your full address"
                                        required
                                    ></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">City *</label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            className="form-control" 
                                            value={formData.city} 
                                            onChange={handleChange}
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Pincode *</label>
                                        <input 
                                            type="text" 
                                            name="pincode" 
                                            className="form-control" 
                                            value={formData.pincode} 
                                            onChange={handleChange}
                                            placeholder="Pincode"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Preferred Date *</label>
                                        <input 
                                            type="date" 
                                            name="preferred_date" 
                                            className="form-control" 
                                            value={formData.preferred_date} 
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Preferred Time *</label>
                                        <select 
                                            name="preferred_time" 
                                            className="form-select" 
                                            value={formData.preferred_time} 
                                            onChange={handleChange}
                                            required
                                        >
                                            {timeOptions.map(t => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Additional Notes (Optional)</label>
                                    <textarea 
                                        name="notes" 
                                        className="form-control" 
                                        rows="2" 
                                        value={formData.notes} 
                                        onChange={handleChange}
                                        placeholder="Any special instructions..."
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-success w-100 py-3 fw-bold fs-5"
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting' ? 'Submitting...' : '🚛 Schedule Pickup'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Waste Collection Guidelines */}
                    <div className="card shadow-sm border-0 mt-4">
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-3">♻️ Waste Collection Guidelines</h4>
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="text-success fw-bold">✅ Accepted Items</h6>
                                    <ul className="list-unstyled">
                                        <li>✓ Plastic bottles, containers, bags</li>
                                        <li>✓ Paper, newspapers, cardboard</li>
                                        <li>✓ Glass bottles and jars</li>
                                        <li>✓ Metal cans, tin containers</li>
                                        <li>✓ Electronic waste (mobiles, batteries)</li>
                                        <li>✓ Organic kitchen waste</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-danger fw-bold">❌ Not Accepted</h6>
                                    <ul className="list-unstyled">
                                        <li>✗ Hazardous chemicals</li>
                                        <li>✗ Medical waste</li>
                                        <li>✗ Sanitary waste</li>
                                        <li>✗ Paint cans with residue</li>
                                    </ul>
                                </div>
                            </div>
                            <hr />
                            <small className="text-muted">Please rinse plastic containers before disposal. Flatten cardboard boxes to save space.</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WastePickup;