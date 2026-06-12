import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Rewards = () => {
    const { user } = useAuth();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPoints, setUserPoints] = useState(1250);
    const [redeemedMessage, setRedeemedMessage] = useState('');

    useEffect(() => {
        fetchRewards();
        fetchUserPoints();
    }, []);

    const fetchRewards = async () => {
        try {
            const response = await axios.get('https://green-kerala-api.onrender.com/api/rewards/');
            if (Array.isArray(response.data)) {
                setRewards(response.data);
            } else {
                // Fallback default rewards if API returns nothing
                setRewards([
                    { id: 1, name: 'Organic Seed Packets', category: 'eco', description: 'Heirloom vegetable seeds', points_required: 100, icon: '🌱', stock: 50, is_popular: true },
                    { id: 2, name: 'Native Tree Sapling', category: 'eco', description: 'Mango, Jackfruit or Guava sapling', points_required: 250, icon: '🌳', stock: 30, is_popular: true },
                    { id: 3, name: 'Home Compost Kit', category: 'eco', description: 'Complete composting bin', points_required: 500, icon: '🗑️', stock: 20, is_popular: false },
                    { id: 4, name: 'Jute Eco Bag', category: 'merchandise', description: 'Handmade organic jute bag', points_required: 150, icon: '🛍️', stock: 100, is_popular: true },
                    { id: 5, name: 'HarithaMission T-Shirt', category: 'merchandise', description: '100% organic cotton T-shirt', points_required: 300, icon: '👕', stock: 50, is_popular: true },
                    { id: 6, name: 'Bamboo Toothbrush Set', category: 'merchandise', description: 'Pack of 4 bamboo toothbrushes', points_required: 100, icon: '🪥', stock: 80, is_popular: true },
                    { id: 7, name: '₹100 Plant Nursery Voucher', category: 'vouchers', description: 'Shop at partner nurseries', points_required: 500, icon: '🎫', stock: 25, is_popular: false },
                    { id: 8, name: 'Free Compost Workshop', category: 'vouchers', description: '2-hour hands-on workshop', points_required: 800, icon: '📚', stock: 20, is_popular: false },
                ]);
            }
        } catch (error) {
            console.error('Error fetching rewards:', error);
            // Set default rewards on error
            setRewards([
                { id: 1, name: 'Organic Seed Packets', category: 'eco', description: 'Heirloom vegetable seeds', points_required: 100, icon: '🌱', stock: 50, is_popular: true },
                { id: 2, name: 'Native Tree Sapling', category: 'eco', description: 'Fruit tree sapling', points_required: 250, icon: '🌳', stock: 30, is_popular: true },
                { id: 3, name: 'Home Compost Kit', category: 'eco', description: 'Composting bin', points_required: 500, icon: '🗑️', stock: 20, is_popular: false },
                { id: 4, name: 'Jute Eco Bag', category: 'merchandise', description: 'Handmade jute bag', points_required: 150, icon: '🛍️', stock: 100, is_popular: true },
                { id: 5, name: 'HarithaMission T-Shirt', category: 'merchandise', description: 'Organic cotton T-shirt', points_required: 300, icon: '👕', stock: 50, is_popular: true },
                { id: 6, name: 'Bamboo Toothbrush Set', category: 'merchandise', description: 'Pack of 4 bamboo toothbrushes', points_required: 100, icon: '🪥', stock: 80, is_popular: true },
                { id: 7, name: '₹100 Plant Nursery Voucher', category: 'vouchers', description: 'Shop at nurseries', points_required: 500, icon: '🎫', stock: 25, is_popular: false },
                { id: 8, name: 'Free Compost Workshop', category: 'vouchers', description: '2-hour workshop', points_required: 800, icon: '📚', stock: 20, is_popular: false },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPoints = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                const response = await axios.get('https://green-kerala-api.onrender.com/api/volunteer-profile/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserPoints(response.data.total_points || 1250);
            }
        } catch (error) {
            console.error('Error fetching points:', error);
        }
    };

    const handleRedeem = (reward) => {
        if (userPoints >= reward.points_required) {
            setRedeemedMessage(`🎉 Success! You redeemed: ${reward.name} for ${reward.points_required} points!`);
            setUserPoints(userPoints - reward.points_required);
            setTimeout(() => setRedeemedMessage(''), 4000);
        } else {
            setRedeemedMessage(`❌ Need ${reward.points_required - userPoints} more points to redeem ${reward.name}`);
            setTimeout(() => setRedeemedMessage(''), 4000);
        }
    };

    // Handle View Challenge button
    const handleViewChallenge = () => {
        alert("🎯 Weekly Challenge: Collect 10kg waste this week!\n\nCurrent progress: 4kg/10kg\n\nComplete the challenge to earn 100 bonus points!\n\nSchedule a waste pickup today!");
    };

    // Handle Redeem Offer button
    const handleRedeemOffer = () => {
        alert("⚡ Limited Time Offer!\n\nDouble points on all waste pickups!\n\nValid for next 3 days only.\n\nSchedule a pickup now to earn DOUBLE points!");
    };

    const getFilteredRewards = () => {
        return rewards;
    };

    const filteredRewards = getFilteredRewards();
    const ecoRewards = rewards.filter(r => r.category === 'eco');
    const merchandiseRewards = rewards.filter(r => r.category === 'merchandise');
    const vouchersRewards = rewards.filter(r => r.category === 'vouchers');

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
            {/* Success/Error Message */}
            {redeemedMessage && (
                <div className={`alert ${redeemedMessage.includes('Success') ? 'alert-success' : 'alert-danger'} text-center shadow-lg mb-4`} 
                     style={{ position: 'sticky', top: '20px', zIndex: 1000 }}>
                    <strong>{redeemedMessage}</strong>
                </div>
            )}

            {/* Hero Banner with User Points */}
            <div className="card border-0 rounded-4 mb-5 overflow-hidden shadow-lg" 
                 style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
                <div className="card-body p-5 text-white text-center">
                    <div className="mb-3">
                        <span className="display-1">🏆</span>
                    </div>
                    <h2 className="fw-bold mb-2">Your Eco Points Balance</h2>
                    <div className="display-1 fw-bold my-3">{userPoints.toLocaleString()}</div>
                    <p className="lead mb-0">🌟 Keep up the great work! You're making a difference.</p>
                    <div className="mt-4">
                        <div className="progress" style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
                            <div className="progress-bar bg-warning" style={{ width: `${(userPoints / 5000) * 100}%` }}></div>
                        </div>
                        <small className="mt-2 d-block">Next Milestone: 5,000 points</small>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-5">
                <div className="d-flex flex-wrap justify-content-center gap-3">
                    <button className="btn btn-success btn-lg px-4 py-2 rounded-pill fw-bold shadow">
                        ✨ All Rewards
                    </button>
                    <button className="btn btn-outline-success btn-lg px-4 py-2 rounded-pill fw-bold">
                        🌱 Eco Products
                    </button>
                    <button className="btn btn-outline-success btn-lg px-4 py-2 rounded-pill fw-bold">
                        👕 Merchandise
                    </button>
                    <button className="btn btn-outline-success btn-lg px-4 py-2 rounded-pill fw-bold">
                        🎫 Vouchers & Events
                    </button>
                </div>
            </div>

            {/* Rewards Grid */}
            <div className="row g-4 mb-5">
                <div className="col-12">
                    <h3 className="fw-bold mb-4">🎁 All Rewards</h3>
                </div>
                
                {filteredRewards.map(reward => (
                    <div key={reward.id} className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm h-100 rounded-4 hover-card">
                            <div className="card-body p-4 text-center">
                                <div className="mb-3">
                                    <span className="display-1">{reward.icon}</span>
                                </div>
                                <h4 className="fw-bold mb-2">{reward.name}</h4>
                                <p className="text-muted small mb-3">{reward.description}</p>
                                <div className="mb-3">
                                    <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">
                                        🪙 {reward.points_required.toLocaleString()} points
                                    </span>
                                    <span className={`badge ${reward.stock > 20 ? 'bg-secondary' : 'bg-warning'} ms-2 px-3 py-2 rounded-pill`}>
                                        📦 Stock: {reward.stock}
                                    </span>
                                </div>
                                {reward.is_popular && (
                                    <div className="mb-2">
                                        <span className="badge bg-danger rounded-pill px-3">🔥 Popular</span>
                                    </div>
                                )}
                                <button 
                                    className={`btn w-100 py-2 fw-bold rounded-pill ${userPoints >= reward.points_required && reward.stock > 0 ? 'btn-success' : 'btn-secondary'}`}
                                    onClick={() => handleRedeem(reward)}
                                    disabled={userPoints < reward.points_required || reward.stock === 0}
                                >
                                    {userPoints >= reward.points_required && reward.stock > 0 ? '🎁 Redeem Now' : 
                                     userPoints < reward.points_required ? `Need ${reward.points_required - userPoints} more points` : 
                                     'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ways to Earn Points */}
            <div className="row g-4 mt-3">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h3 className="fw-bold mb-0">💚 Ways to Earn Points</h3>
                            <p className="text-muted mt-2">Complete these actions and earn rewards</p>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded-3" style={{ backgroundColor: '#E8F5E9' }}>
                                <div className="d-flex align-items-center"><span className="display-6 me-3">📚</span><span className="fw-semibold">Donate Books/Waste</span></div>
                                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">+50</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded-3" style={{ backgroundColor: '#E3F2FD' }}>
                                <div className="d-flex align-items-center"><span className="display-6 me-3">🏖️</span><span className="fw-semibold">Participate in Cleanup</span></div>
                                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">+100</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded-3" style={{ backgroundColor: '#E8F5E9' }}>
                                <div className="d-flex align-items-center"><span className="display-6 me-3">🌳</span><span className="fw-semibold">Plant a Tree</span></div>
                                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">+75</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded-3" style={{ backgroundColor: '#FFF3E0' }}>
                                <div className="d-flex align-items-center"><span className="display-6 me-3">👥</span><span className="fw-semibold">Refer a Friend</span></div>
                                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">+200</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded-3" style={{ backgroundColor: '#F3E5F5' }}>
                                <div className="d-flex align-items-center"><span className="display-6 me-3">🎯</span><span className="fw-semibold">Complete a Mission</span></div>
                                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">+150</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded-3" style={{ backgroundColor: '#FFEBEE' }}>
                                <div className="d-flex align-items-center"><span className="display-6 me-3">🏆</span><span className="fw-semibold">Weekly Challenge</span></div>
                                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">+100</span>
                            </div>
                        </div>
                        <div className="card-footer bg-white border-0 pb-4 px-4">
                            <div className="alert alert-info mb-0 rounded-3">
                                <strong>💡 Pro Tip:</strong> Refer friends to earn 200 points each!
                            </div>
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
                                <div className="d-flex align-items-center"><div className="text-center me-3" style={{ width: '50px' }}><span className="display-6">🥇</span></div><div><div className="fw-bold">Anjali Nair</div><small className="text-success">🏅 Eco Warrior</small></div></div>
                                <div className="text-end"><div className="fw-bold text-success">3,450</div><small className="text-muted">points</small></div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{ backgroundColor: '#FFF8E1' }}>
                                <div className="d-flex align-items-center"><div className="text-center me-3" style={{ width: '50px' }}><span className="display-6">🥈</span></div><div><div className="fw-bold">Rajesh Menon</div><small className="text-secondary">🌿 Green Hero</small></div></div>
                                <div className="text-end"><div className="fw-bold text-success">2,890</div><small className="text-muted">points</small></div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{ backgroundColor: '#FFF8E1' }}>
                                <div className="d-flex align-items-center"><div className="text-center me-3" style={{ width: '50px' }}><span className="display-6">🥉</span></div><div><div className="fw-bold">Meera Krishnan</div><small className="text-warning">⭐ Nature Lover</small></div></div>
                                <div className="text-end"><div className="fw-bold text-success">2,340</div><small className="text-muted">points</small></div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{ backgroundColor: '#F5F5F5' }}>
                                <div className="d-flex align-items-center"><div className="text-center me-3" style={{ width: '50px' }}><span className="badge bg-secondary rounded-circle p-2" style={{ width: '35px', height: '35px', lineHeight: '25px' }}>4</span></div><div><div className="fw-bold">Arjun Dev</div></div></div>
                                <div className="text-end"><div className="fw-bold text-success">1,980</div><small className="text-muted">points</small></div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{ backgroundColor: '#F5F5F5' }}>
                                <div className="d-flex align-items-center"><div className="text-center me-3" style={{ width: '50px' }}><span className="badge bg-secondary rounded-circle p-2" style={{ width: '35px', height: '35px', lineHeight: '25px' }}>5</span></div><div><div className="fw-bold">Lakshmi Nair</div></div></div>
                                <div className="text-end"><div className="fw-bold text-success">1,650</div><small className="text-muted">points</small></div>
                            </div>
                        </div>
                        <div className="card-footer bg-white border-0 pb-4 px-4">
                            <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: '#E8F5E9' }}>
                                <div><span className="fw-bold">Your Rank</span><div className="small text-muted">Keep going!</div></div>
                                <div className="text-end"><span className="fw-bold text-success">#8</span><div className="small text-muted">{userPoints.toLocaleString()} pts</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Challenges Section */}
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="row g-0">
                            <div className="col-md-6" style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
                                <div className="p-5 text-white text-center h-100 d-flex flex-column justify-content-center">
                                    <div className="display-1 mb-3">🎯</div>
                                    <h3 className="fw-bold mb-3">Weekly Challenge</h3>
                                    <p className="lead">Collect 10kg waste this week</p>
                                    <div className="mt-3">
                                        <div className="progress mb-2" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-warning" style={{ width: '40%' }}></div>
                                        </div>
                                        <small>4kg collected / 10kg target</small>
                                    </div>
                                    <button 
                                        onClick={handleViewChallenge}
                                        className="btn btn-light text-success fw-bold mt-4 rounded-pill px-4"
                                    >
                                        View Challenge →
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6" style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)' }}>
                                <div className="p-5 text-white text-center h-100 d-flex flex-column justify-content-center">
                                    <div className="display-1 mb-3">⚡</div>
                                    <h3 className="fw-bold mb-3">Limited Time Offer</h3>
                                    <p className="lead">Double points on all waste pickups!</p>
                                    <div className="mt-3">
                                        <span className="badge bg-light text-warning fs-6 px-4 py-2 rounded-pill">Ends in 3 days</span>
                                    </div>
                                    <button 
                                        onClick={handleRedeemOffer}
                                        className="btn btn-light text-warning fw-bold mt-4 rounded-pill px-4"
                                    >
                                        Redeem Offer →
                                    </button>
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