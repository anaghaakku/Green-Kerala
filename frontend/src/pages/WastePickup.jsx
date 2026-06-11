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
        preferred_time: 'morning'
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('https://green-kerala-api.onrender.com/api/pickups/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus('success');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('error');
        }
    };

    const wasteTypes = [
        { value: 'plastic', label: '🥤 Plastic Waste', points: 30 },
        { value: 'paper', label: '📰 Paper & Cardboard', points: 25 },
        { value: 'glass', label: '🥂 Glass Bottles', points: 40 },
        { value: 'metal', label: '🔩 Metal Scrap', points: 50 },
        { value: 'ewaste', label: '💻 E-Waste', points: 60 },
    ];

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-lg-7 mx-auto">
                    <h1 className="text-center mb-4 fw-bold">🗑️ Waste Collection Service</h1>
                    <p className="text-center text-muted mb-5">Schedule a free waste collection pickup. Earn eco-points for every kg you recycle!</p>
                    
                    <div className="row mb-5">
                        <div className="col-md-4 mb-3"><div className="card bg-success text-white text-center"><div className="card-body"><div className="display-4">🚛</div><h5>Free Pickup</h5></div></div></div>
                        <div className="col-md-4 mb-3"><div className="card bg-info text-white text-center"><div className="card-body"><div className="display-4">🪙</div><h5>Earn Points</h5></div></div></div>
                        <div className="col-md-4 mb-3"><div className="card bg-warning text-white text-center"><div className="card-body"><div className="display-4">♻️</div><h5>100% Recycling</h5></div></div></div>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h3 className="mb-4 fw-bold">📝 Schedule Waste Pickup</h3>
                            {status === 'success' && <div className="alert alert-success">✅ Pickup request submitted successfully!</div>}
                            {status === 'error' && <div className="alert alert-danger">❌ Failed to submit. Please try again.</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3"><label className="form-label fw-bold">Waste Type *</label><select name="waste_type" className="form-select" value={formData.waste_type} onChange={handleChange}>{wasteTypes.map(w => <option key={w.value} value={w.value}>{w.label} (+{w.points} pts)</option>)}</select></div>
                                <div className="mb-3"><label className="form-label fw-bold">Weight *</label><select name="estimated_weight" className="form-select" value={formData.estimated_weight} onChange={handleChange}><option value="1-5">1-5 kg</option><option value="5-10">5-10 kg</option><option value="10-20">10-20 kg</option><option value="20+">20+ kg</option></select></div>
                                <div className="mb-3"><label className="form-label fw-bold">Address *</label><textarea name="address" className="form-control" rows="2" value={formData.address} onChange={handleChange} required></textarea></div>
                                <div className="row"><div className="col-md-6 mb-3"><input type="text" name="city" className="form-control" placeholder="City" value={formData.city} onChange={handleChange} required /></div><div className="col-md-6 mb-3"><input type="text" name="pincode" className="form-control" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required /></div></div>
                                <div className="mb-3"><label className="form-label fw-bold">Preferred Date *</label><input type="date" name="preferred_date" className="form-control" value={formData.preferred_date} onChange={handleChange} required /></div>
                                <button type="submit" className="btn btn-success w-100 py-3 fw-bold fs-5">🚛 Schedule Pickup</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WastePickup;