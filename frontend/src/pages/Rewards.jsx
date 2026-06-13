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

    // Updated icon function with proper mapping
    const getIconForCategory = (category, name) => {
        const rewardName = (name || '').toLowerCase();
        const cat = (category || '').toLowerCase();
        
        // Cap specific - 🧢
        if (rewardName.includes('cap') || rewardName.includes('hat')) {
            return '🧢';
        }
        
        // T-Shirt specific - 👕
        if (rewardName.includes('t-shirt') || rewardName.includes('tshirt') || rewardName.includes('shirt')) {
            return '👕';
        }
        
        // Backpack specific - 🎒
        if (rewardName.includes('backpack') || rewardName.includes('bag')) {
            return '🎒';
        }
        
        // Cutlery set - 🍴
        if (rewardName.includes('cutlery') || rewardName.includes('fork') || rewardName.includes('spoon') || rewardName.includes('bamboo')) {
            return '🍴';
        }
        
        // Notebook / Paper - 📓
        if (rewardName.includes('notebook') || rewardName.includes('paper') || rewardName.includes('book')) {
            return '📓';
        }
        
        // Seeds / Plants - 🌱
        if (rewardName.includes('seed') || rewardName.includes('plant') || rewardName.includes('tree') || rewardName.includes('organic') || cat === 'eco') {
            return '🌱';
        }
        
        // Vouchers / Events - 🎫
        if (rewardName.includes('voucher') || rewardName.includes('workshop') || rewardName.includes('meal') || 
            rewardName.includes('event') || rewardName.includes('pass') || cat === 'vouchers') {
            return '🎫';
        }
        
        // Merchandise default - 👕
        if (cat === 'merchandise') {
            return '👕';
        }
        
        return '🎁';
    };

    const fetchRewards = useCallback(async () => {
        try {
            const token = localStorage.getItem('access_token');
            
            const response = await axios.get(`https://green-kerala-api.onrender.com/api/rewards/?_=${Date.now()}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            
            let rewardsArray = [];
            
            if (Array.isArray(response.data)) {
                rewardsArray = response.data;
            } else if (response.data.results && Array.isArray(response.data.results)) {
                rewardsArray = response.data.results;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                rewardsArray = response.data.data;
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

    // Auto-refresh every 10 seconds
    useEffect(() => {
        fetchRewards();
        refreshPoints(); // Refresh points from context
        
        const interval = setInterval(() => {
            fetchRewards();
            refreshPoints();
        }, 10000);
        
        return () => clearInterval(interval);
    }, [fetchRewards, refreshPoints]);

    // FIXED: Redemption with PointsContext
    const handleRedeem = async (reward) => {
        console.log('Redeeming reward:', reward);
        console.log('User points:', points);
        console.log('Points required:', reward.points_required);
        
        if (points >= reward.points_required) {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    setRedeemedMessage(`❌ Please login to redeem rewards`);
                    setTimeout(() => setRedeemedMessage(''), 4000);
                    return;
                }
                
                // Try different request formats
                const formatsToTry = [
                    { reward: reward.id },
                    { reward_id: reward.id },
                    { reward: reward.id, points_spent: reward.points_required },
                    { id: reward.id, reward_id: reward.id }
                ];
                
                let success = false;
                let lastError = null;
                
                for (const data of formatsToTry) {
                    try {
                        console.log('Trying format:', data);
                        const response = await axios.post(
                            'https://green-kerala-api.onrender.com/api/redemptions/', 
                            data,
                            { 
                                headers: { 
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                } 
                            }
                        );
                        console.log('Success with format:', data, response.data);
                        success = true;
                        
                        // Deduct points using PointsContext
                        deductPoints(reward.points_required);
                        
                        setRedeemedMessage(`🎉 Success! You redeemed: ${reward.name}!`);
                        fetchRewards(); // Refresh to update stock
                        refreshPoints(); // Refresh points
                        break;
                    } catch (err) {
                        lastError = err;
                        console.log('Failed with format:', data, err.response?.data);
                    }
                }
                
                if (!success) {
                    throw lastError;
                }
                
            } catch (error) {
                console.error('Redemption error:', error);
                console.error('Error response:', error.response?.data);
                
                if (error.response?.status === 404) {
                    setRedeemedMessage(`❌ API endpoint not found. Please contact support.`);
                } else if (error.response?.status === 401) {
                    setRedeemedMessage(`❌ Please login again to redeem rewards.`);
                } else if (error.response?.status === 400) {
                    const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Invalid request';
                    setRedeemedMessage(`❌ ${errorMsg}`);
                } else {
                    setRedeemedMessage(`❌ Failed to redeem. Please try again.`);
                }
            }
            setTimeout(() => setRedeemedMessage(''), 4000);
        } else {
            setRedeemedMessage(`❌ Need ${reward.points_required - points} more points for ${reward.name}`);
            setTimeout(() => setRedeemedMessage(''), 4000);
        }
    };

    const handleViewChallenge = () => {
        alert("🎯 Weekly Challenge: Collect 10kg waste this week!\n\nComplete the challenge to earn 100 bonus points!");
    };

    const handleRedeemOffer = () => {
        alert("⚡ Limited Time Offer!\n\nDouble points on all waste pickups!\n\nValid for next 3 days only.");
    };

    const handleDonateBooks = () => {
        alert("📚 Donate Books/Waste\n\nEarn +50 points!");
    };

    const handleParticipateCleanup = () => {
        alert("🏖️ Participate in Cleanup\n\nEarn +100 points!");
    };

    const handlePlantTree = () => {
        alert("🌳 Plant a Tree\n\nEarn +75 points!");
    };

    const handleReferFriend = () => {
        const referralLink = `https://harithamission-frontend.onrender.com/register?ref=${user?.username || 'friend'}`;
        navigator.clipboard.writeText(referralLink);
        alert("👥 Refer a Friend\n\nEarn +200 points!\n\nReferral link copied!");
    };

    const handleCompleteMission = () => {
        alert("🎯 Complete a Mission\n\nEarn +150 points!");
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

            {/* Hero Banner with Points */}
            <div className="card border-0 rounded-4 mb-5 overflow-hidden shadow-lg" 
                 style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
                <div className="card-body p-5 text-white text-center">
                    <div className="mb-3"><span className="display-1">🏆</span></div>
                    <h2 className="fw-bold mb-2">Your Eco Points Balance</h2>
                    <div className="display-1 fw-bold my-3">{points.toLocaleString()}</div>
                    <p className="lead mb-0">🌟 Keep up the great work! You're making a difference.</p>
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

            {/* Rewards Grid */}
            <div className="row g-4 mb-5">
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
                            <p>Check back soon for exciting eco-friendly rewards!</p>
                        </div>
                    </div>
                ) : (
                    filteredRewards.map(reward => (
                        <div key={reward.id} className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow-sm h-100 rounded-4 hover-card">
                                <div className="card-body p-4 text-center">
                                    <div className="mb-3"><span className="display-1">{reward.icon}</span></div>
                                    <h4 className="fw-bold mb-2">{reward.name}</h4>
                                    <p className="text-muted small mb-3">{reward.description}</p>
                                    <div className="mb-3">
                                        <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">🪙 {reward.points_required} points</span>
                                        <span className={`badge ${reward.stock > 20 ? 'bg-secondary' : 'bg-warning'} ms-2 px-3 py-2 rounded-pill`}>📦 Stock: {reward.stock}</span>
                                    </div>
                                    {reward.is_popular && <div className="mb-2"><span className="badge bg-danger rounded-pill px-3">🔥 Popular</span></div>}
                                    <button 
                                        className={`btn w-100 py-2 fw-bold rounded-pill ${points >= reward.points_required && reward.stock > 0 ? 'btn-success' : 'btn-secondary'}`}
                                        onClick={() => handleRedeem(reward)}
                                        disabled={points < reward.points_required || reward.stock === 0}
                                    >
                                        {points >= reward.points_required && reward.stock > 0 ? '🎁 Redeem Now' : 
                                         points < reward.points_required ? `Need ${reward.points_required - points} more points` : 'Out of Stock'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Ways to Earn Points */}
            <div className="row g-4 mt-3">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h3 className="fw-bold mb-0">💚 Ways to Earn Points</h3>
                        </div>
                        <div className="card-body p-4">
                            <button onClick={handleDonateBooks} className="d-flex justify-content-between align-items-center w-100 border-0 bg-transparent p-3 mb-3 rounded-3" style={{ backgroundColor: '#E8F5E9', cursor: 'pointer' }}>
                                <span>📚 Donate Books/Waste</span>
                                <span className="badge bg-success">+50</span>
                            </button>
                            <button onClick={handleParticipateCleanup} className="d-flex justify-content-between align-items-center w-100 border-0 bg-transparent p-3 mb-3 rounded-3" style={{ backgroundColor: '#E3F2FD', cursor: 'pointer' }}>
                                <span>🏖️ Participate in Cleanup</span>
                                <span className="badge bg-success">+100</span>
                            </button>
                            <button onClick={handlePlantTree} className="d-flex justify-content-between align-items-center w-100 border-0 bg-transparent p-3 mb-3 rounded-3" style={{ backgroundColor: '#E8F5E9', cursor: 'pointer' }}>
                                <span>🌳 Plant a Tree</span>
                                <span className="badge bg-success">+75</span>
                            </button>
                            <button onClick={handleReferFriend} className="d-flex justify-content-between align-items-center w-100 border-0 bg-transparent p-3 mb-3 rounded-3" style={{ backgroundColor: '#FFF3E0', cursor: 'pointer' }}>
                                <span>👥 Refer a Friend</span>
                                <span className="badge bg-success">+200</span>
                            </button>
                            <button onClick={handleCompleteMission} className="d-flex justify-content-between align-items-center w-100 border-0 bg-transparent p-3 mb-3 rounded-3" style={{ backgroundColor: '#F3E5F5', cursor: 'pointer' }}>
                                <span>🎯 Complete a Mission</span>
                                <span className="badge bg-success">+150</span>
                            </button>
                        </div>
                        <div className="card-footer bg-white border-0 pb-4 px-4">
                            <div className="alert alert-info mb-0 rounded-3"><strong>💡 Pro Tip:</strong> Refer friends to earn 200 points each!</div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h3 className="fw-bold mb-0">🏆 Top Volunteers</h3>
                            <p className="text-muted mt-2">This month's eco-champions</p>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{ backgroundColor: '#FFF8E1' }}>
                                <div><span className="display-6 me-3">🥇</span> Anjali Nair</div>
                                <div className="fw-bold text-success">3,450 points</div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{ backgroundColor: '#FFF8E1' }}>
                                <div><span className="display-6 me-3">🥈</span> Rajesh Menon</div>
                                <div className="fw-bold text-success">2,890 points</div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{ backgroundColor: '#FFF8E1' }}>
                                <div><span className="display-6 me-3">🥉</span> Meera Krishnan</div>
                                <div className="fw-bold text-success">2,340 points</div>
                            </div>
                        </div>
                        <div className="card-footer bg-white border-0 pb-4 px-4">
                            <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: '#E8F5E9' }}>
                                <div><span className="fw-bold">Your Points</span></div>
                                <div><span className="fw-bold text-success">{points.toLocaleString()} pts</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Challenges */}
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="row g-0">
                            <div className="col-md-6" style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
                                <div className="p-5 text-white text-center">
                                    <div className="display-1 mb-3">🎯</div>
                                    <h3 className="fw-bold mb-3">Weekly Challenge</h3>
                                    <p className="lead">Collect 10kg waste this week</p>
                                    <button onClick={handleViewChallenge} className="btn btn-light text-success fw-bold mt-4 rounded-pill px-4">View Challenge →</button>
                                </div>
                            </div>
                            <div className="col-md-6" style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)' }}>
                                <div className="p-5 text-white text-center">
                                    <div className="display-1 mb-3">⚡</div>
                                    <h3 className="fw-bold mb-3">Limited Time Offer</h3>
                                    <p className="lead">Double points on all waste pickups!</p>
                                    <button onClick={handleRedeemOffer} className="btn btn-light text-warning fw-bold mt-4 rounded-pill px-4">Redeem Offer →</button>
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