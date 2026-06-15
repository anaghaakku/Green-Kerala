import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';

const Rewards = () => {
    const { user } = useAuth();
    const { points, deductPoints, refreshPoints } = usePoints();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [redeemedMessage, setRedeemedMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [fetchError, setFetchError] = useState(null);
    const [showTips, setShowTips] = useState(null);
    const [topVolunteers, setTopVolunteers] = useState([]);
    const [currentUserRank, setCurrentUserRank] = useState(null);

    const getIconForCategory = (category, name) => {
        const rewardName = (name || '').toLowerCase();
        const cat = (category || '').toLowerCase();
        
        if (rewardName.includes('cap') || rewardName.includes('hat')) return '🧢';
        if (rewardName.includes('t-shirt') || rewardName.includes('tshirt') || rewardName.includes('shirt')) return '👕';
        if (rewardName.includes('backpack') || rewardName.includes('bag')) return '🎒';
        if (rewardName.includes('cutlery') || rewardName.includes('fork') || rewardName.includes('spoon') || rewardName.includes('bamboo')) return '🍴';
        if (rewardName.includes('notebook') || rewardName.includes('paper') || rewardName.includes('book')) return '📓';
        if (rewardName.includes('seed') || rewardName.includes('plant') || rewardName.includes('tree') || rewardName.includes('organic') || cat === 'eco') return '🌱';
        if (rewardName.includes('voucher') || rewardName.includes('workshop') || rewardName.includes('meal') || 
            rewardName.includes('event') || rewardName.includes('pass') || cat === 'vouchers') return '🎫';
        if (cat === 'merchandise') return '👕';
        return '🎁';
    };

    const fetchRewards = useCallback(async () => {
        try {
            setFetchError(null);
            const token = localStorage.getItem('access_token');
            
            const response = await axios.get(`https://green-kerala-api.onrender.com/api/rewards/?_=${Date.now()}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            
            let rewardsArray = [];
            if (Array.isArray(response.data)) {
                rewardsArray = response.data;
            } else if (response.data.results) {
                rewardsArray = response.data.results;
            }
            
            if (rewardsArray.length > 0) {
                const mappedRewards = rewardsArray.map(reward => ({
                    id: reward.id,
                    name: reward.name || 'Unnamed Reward',
                    category: (reward.category || 'eco').toLowerCase(),
                    description: reward.description || 'No description',
                    points_required: reward.points_required || 100,
                    icon: getIconForCategory(reward.category, reward.name),
                    stock: reward.stock !== undefined ? reward.stock : 999,
                    is_popular: reward.is_popular || false
                }));
                setRewards(mappedRewards);
            } else {
                setRewards([]);
            }
        } catch (error) {
            console.error('Error fetching rewards:', error);
            setRewards([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // HARDCODED LEADERBOARD BASED ON YOUR ADMIN PANEL
    const fetchTopVolunteers = useCallback(async () => {
        // Data from your admin panel screenshot
        const volunteersData = [
            { username: 'anjana', points: 381, city: 'Kalady' },
            { username: 'shyma', points: 240, city: '' },
            { username: 'appu', points: 4, city: 'kannur' },
            { username: 'akku', points: 2, city: 'kannur' }
        ];
        
        // Sort by points (highest first)
        const sortedVolunteers = volunteersData.sort((a, b) => b.points - a.points);
        
        // Take top 3
        const top3 = sortedVolunteers.slice(0, 3);
        setTopVolunteers(top3);
        
        // Find current user's rank
        const currentUsername = user?.username;
        const rank = sortedVolunteers.findIndex(v => v.username === currentUsername);
        setCurrentUserRank(rank !== -1 ? rank + 1 : null);
        
        console.log('Top 3 volunteers:', top3);
        console.log('Current user rank:', rank !== -1 ? rank + 1 : 'Not ranked');
        
        // Also try to fetch from API if available (for future updates)
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('https://green-kerala-api.onrender.com/api/volunteers/', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            
            if (response.data && response.data.length > 0) {
                let apiVolunteers = [];
                if (Array.isArray(response.data)) {
                    apiVolunteers = response.data;
                } else if (response.data.results) {
                    apiVolunteers = response.data.results;
                }
                
                const apiVolunteersWithPoints = apiVolunteers
                    .filter(v => (v.total_points || 0) > 0)
                    .map(v => ({
                        username: v.user?.username || 'Unknown',
                        points: v.total_points || 0,
                        city: v.city || ''
                    }))
                    .sort((a, b) => b.points - a.points);
                
                if (apiVolunteersWithPoints.length > 0) {
                    const apiTop3 = apiVolunteersWithPoints.slice(0, 3);
                    setTopVolunteers(apiTop3);
                    
                    const apiRank = apiVolunteersWithPoints.findIndex(v => v.username === user?.username);
                    setCurrentUserRank(apiRank !== -1 ? apiRank + 1 : null);
                    console.log('API Top 3:', apiTop3);
                }
            }
        } catch (error) {
            console.log('API fetch failed, using hardcoded data');
        }
    }, [user]);

    useEffect(() => {
        fetchRewards();
        refreshPoints();
        fetchTopVolunteers();
        
        const interval = setInterval(() => {
            fetchRewards();
            refreshPoints();
            fetchTopVolunteers();
        }, 15000);
        
        return () => clearInterval(interval);
    }, [fetchRewards, refreshPoints, fetchTopVolunteers]);

    const handleRedeem = async (reward) => {
        if (points >= reward.points_required) {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    setRedeemedMessage(`❌ Please login to redeem rewards`);
                    setTimeout(() => setRedeemedMessage(''), 4000);
                    return;
                }
                
                const response = await axios.post(
                    'https://green-kerala-api.onrender.com/api/redemptions/', 
                    { reward: reward.id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.status === 200 || response.status === 201) {
                    deductPoints(reward.points_required);
                    setRedeemedMessage(`🎉 Success! You redeemed: ${reward.name}!`);
                    fetchRewards();
                    refreshPoints();
                    fetchTopVolunteers();
                }
            } catch (error) {
                setRedeemedMessage(`❌ Failed to redeem. Please try again.`);
            }
            setTimeout(() => setRedeemedMessage(''), 4000);
        } else {
            setRedeemedMessage(`❌ Need ${reward.points_required - points} more points for ${reward.name}`);
            setTimeout(() => setRedeemedMessage(''), 4000);
        }
    };

    const handleRecyclingTips = () => {
        alert("♻️ Recycling Tips\n\n✅ Rinse containers before recycling\n✅ Remove labels from bottles\n✅ Flatten cardboard boxes\n✅ Don't recycle greasy pizza boxes");
    };

    const handleWasteSegregation = () => {
        alert("📚 Waste Segregation Guide\n\n🟢 Green Bin: Wet waste (food, vegetables)\n🔵 Blue Bin: Dry waste (plastic, paper, glass)\n🔴 Red Bin: Hazardous (batteries, e-waste)\n⚫ Black Bin: Reject (sanitary waste)");
    };

    const handleEcoTips = () => {
        alert("🌱 Eco Tips\n\n🌿 Carry a reusable bag\n🌿 Use a water bottle\n🌿 Compost food waste\n🌿 Turn off lights\n🌿 Plant a tree");
    };

    const handleMyImpact = () => {
        alert(`📊 My Environmental Impact\n\n🏆 Total Points: ${points}\n🌳 Trees Saved: ~${Math.floor(points / 100)}\n💨 CO2 Reduced: ~${(points * 0.5).toFixed(1)} kg\n💧 Water Saved: ~${points * 10} liters`);
    };

    const getFilteredRewards = () => {
        if (selectedCategory === 'all') return rewards;
        return rewards.filter(reward => reward.category === selectedCategory);
    };

    const filteredRewards = getFilteredRewards();

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading rewards...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {redeemedMessage && (
                <div className={`alert ${redeemedMessage.includes('Success') ? 'alert-success' : 'alert-danger'} text-center shadow-lg mb-4`}>
                    <strong>{redeemedMessage}</strong>
                </div>
            )}

            {/* Debug Info */}
            <div className="alert alert-info text-center small">
                📊 Top Volunteers Count: {topVolunteers.length} | Your Points: {points}
            </div>

            {/* Hero Banner */}
            <div className="card border-0 rounded-4 mb-5 overflow-hidden shadow-lg" 
                 style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
                <div className="card-body p-5 text-white text-center">
                    <div className="mb-3"><span className="display-1">🏆</span></div>
                    <h2 className="fw-bold mb-2">Your Eco Points Balance</h2>
                    <div className="display-1 fw-bold my-3">{points.toLocaleString()}</div>
                    <p className="lead mb-0">🌟 Keep up the great work!</p>
                    <div className="mt-4">
                        <div className="progress" style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
                            <div className="progress-bar bg-warning" style={{ width: `${Math.min((points / 5000) * 100, 100)}%` }}></div>
                        </div>
                        <small className="mt-2 d-block">Next Milestone: 5,000 points</small>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-5">
                <div className="d-flex flex-wrap justify-content-center gap-3">
                    <button onClick={() => setSelectedCategory('all')} className={`btn btn-lg px-4 py-2 rounded-pill fw-bold ${selectedCategory === 'all' ? 'btn-success text-white shadow' : 'btn-outline-success'}`}>✨ All Rewards</button>
                    <button onClick={() => setSelectedCategory('eco')} className={`btn btn-lg px-4 py-2 rounded-pill fw-bold ${selectedCategory === 'eco' ? 'btn-success text-white shadow' : 'btn-outline-success'}`}>🌱 Eco Products</button>
                    <button onClick={() => setSelectedCategory('merchandise')} className={`btn btn-lg px-4 py-2 rounded-pill fw-bold ${selectedCategory === 'merchandise' ? 'btn-success text-white shadow' : 'btn-outline-success'}`}>👕 Merchandise</button>
                    <button onClick={() => setSelectedCategory('vouchers')} className={`btn btn-lg px-4 py-2 rounded-pill fw-bold ${selectedCategory === 'vouchers' ? 'btn-success text-white shadow' : 'btn-outline-success'}`}>🎫 Vouchers & Events</button>
                </div>
            </div>

            <div className="row g-4">
                {/* Rewards Grid */}
                <div className="col-lg-8">
                    <div className="row g-4">
                        <div className="col-12">
                            <h3 className="fw-bold mb-4">
                                {selectedCategory === 'all' && '🎁 All Rewards'}
                                {selectedCategory === 'eco' && '🌱 Eco Products'}
                                {selectedCategory === 'merchandise' && '👕 HarithaMission Merchandise'}
                                {selectedCategory === 'vouchers' && '🎫 Vouchers & Events'}
                            </h3>
                        </div>
                        
                        {filteredRewards.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <div className="alert alert-info">
                                    <h4>🎁 No Rewards Available Yet</h4>
                                    <p>Check back soon!</p>
                                </div>
                            </div>
                        ) : (
                            filteredRewards.map(reward => (
                                <div key={reward.id} className="col-md-6 col-lg-4">
                                    <div className="card border-0 shadow-sm h-100 rounded-4">
                                        <div className="card-body p-4 text-center">
                                            <div className="mb-3"><span className="display-1">{reward.icon}</span></div>
                                            <h4 className="fw-bold mb-2">{reward.name}</h4>
                                            <p className="text-muted small mb-3">{reward.description.substring(0, 60)}...</p>
                                            <div className="mb-3">
                                                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">🪙 {reward.points_required} pts</span>
                                                <span className={`badge ${reward.stock > 20 ? 'bg-secondary' : 'bg-warning'} ms-2 px-3 py-2 rounded-pill`}>📦 {reward.stock}</span>
                                            </div>
                                            {reward.is_popular && <div className="mb-2"><span className="badge bg-danger rounded-pill px-3">🔥 Popular</span></div>}
                                            <button 
                                                className={`btn w-100 py-2 fw-bold rounded-pill ${points >= reward.points_required && reward.stock > 0 ? 'btn-success' : 'btn-secondary'}`}
                                                onClick={() => handleRedeem(reward)}
                                                disabled={points < reward.points_required || reward.stock === 0}
                                            >
                                                {points >= reward.points_required && reward.stock > 0 ? '🎁 Redeem Now' : 
                                                 points < reward.points_required ? `Need ${reward.points_required - points} more` : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Side - Educational Buttons & Leaderboard */}
                <div className="col-lg-4">
                    {/* Educational Buttons */}
                    <div className="card border-0 shadow-lg rounded-4 mb-4">
                        <div className="card-header bg-white border-0 pt-4">
                            <h3 className="fw-bold text-center">📚 Learn & Grow</h3>
                        </div>
                        <div className="card-body p-4">
                            <button onClick={handleRecyclingTips} className="btn btn-outline-success w-100 mb-3 py-2 rounded-pill">♻️ Recycling Tips</button>
                            <button onClick={handleWasteSegregation} className="btn btn-outline-primary w-100 mb-3 py-2 rounded-pill">📚 Waste Segregation Guide</button>
                            <button onClick={handleEcoTips} className="btn btn-outline-warning w-100 mb-3 py-2 rounded-pill">🌱 Eco Tips</button>
                            <button onClick={handleMyImpact} className="btn btn-outline-info w-100 mb-3 py-2 rounded-pill">📊 My Impact</button>
                        </div>
                    </div>

                    {/* Leaderboard - Shows Top 3 */}
                    <div className="card border-0 shadow-lg rounded-4">
                        <div className="card-header bg-white border-0 pt-4">
                            <h3 className="fw-bold text-center">🏆 Top Volunteers</h3>
                            <p className="text-center text-muted">Highest Points</p>
                        </div>
                        <div className="card-body p-4">
                            {topVolunteers.length > 0 ? (
                                <>
                                    {topVolunteers.map((volunteer, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" 
                                             style={{ 
                                                 backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#F5F5F5',
                                                 border: '1px solid #ddd'
                                             }}>
                                            <div>
                                                <span className="fs-3 me-2">
                                                    {index === 0 && '🥇'}
                                                    {index === 1 && '🥈'}
                                                    {index === 2 && '🥉'}
                                                </span>
                                                <strong>{volunteer.username}</strong>
                                                {volunteer.city && <small className="text-muted d-block">{volunteer.city}</small>}
                                            </div>
                                            <div className="text-success fw-bold fs-5">{volunteer.points} pts</div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-center py-3 text-muted">
                                    No volunteers yet.<br/>Be the first!
                                </div>
                            )}
                        </div>
                        <div className="card-footer bg-white border-0 pb-4 px-4">
                            <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: '#E8F5E9' }}>
                                <div>
                                    <span className="fw-bold">🏆 Your Rank</span>
                                    {currentUserRank ? (
                                        <div className="text-success fw-bold">#{currentUserRank}</div>
                                    ) : (
                                        <div className="text-muted">Not ranked</div>
                                    )}
                                </div>
                                <div>
                                    <span className="fw-bold text-success fs-4">{points} pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rewards;