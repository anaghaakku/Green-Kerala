
// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import { usePoints } from '../context/PointsContext';

// const Rewards = () => {
//     const { user } = useAuth();
//     const { points, deductPoints, refreshPoints } = usePoints();
//     const [rewards, setRewards] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [redeemedMessage, setRedeemedMessage] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('all');
//     const [fetchError, setFetchError] = useState(null);
//     const [showTips, setShowTips] = useState(null);
//     const [topVolunteers, setTopVolunteers] = useState([]);
//     const [currentUserRank, setCurrentUserRank] = useState(null);

//     const getIconForCategory = (category, name) => {
//         const rewardName = (name || '').toLowerCase();
//         const cat = (category || '').toLowerCase();
        
//         if (rewardName.includes('cap') || rewardName.includes('hat')) return '🧢';
//         if (rewardName.includes('t-shirt') || rewardName.includes('tshirt') || rewardName.includes('shirt')) return '👕';
//         if (rewardName.includes('backpack') || rewardName.includes('bag')) return '🎒';
//         if (rewardName.includes('cutlery') || rewardName.includes('fork') || rewardName.includes('spoon') || rewardName.includes('bamboo')) return '🍴';
//         if (rewardName.includes('notebook') || rewardName.includes('paper') || rewardName.includes('book')) return '📓';
//         if (rewardName.includes('seed') || rewardName.includes('plant') || rewardName.includes('tree') || rewardName.includes('organic') || cat === 'eco') return '🌱';
//         if (rewardName.includes('voucher') || rewardName.includes('workshop') || rewardName.includes('meal') || 
//             rewardName.includes('event') || rewardName.includes('pass') || cat === 'vouchers') return '🎫';
//         if (cat === 'merchandise') return '👕';
//         return '🎁';
//     };

//     const fetchRewards = useCallback(async () => {
//         try {
//             setFetchError(null);
//             const token = localStorage.getItem('access_token');
            
//             const response = await axios.get(`https://green-kerala-api.onrender.com/api/rewards/?_=${Date.now()}`, {
//                 headers: token ? { Authorization: `Bearer ${token}` } : {}
//             });
            
//             let rewardsArray = [];
//             if (Array.isArray(response.data)) {
//                 rewardsArray = response.data;
//             } else if (response.data.results) {
//                 rewardsArray = response.data.results;
//             }
            
//             if (rewardsArray.length > 0) {
//                 const mappedRewards = rewardsArray.map(reward => ({
//                     id: reward.id,
//                     name: reward.name || 'Unnamed Reward',
//                     category: (reward.category || 'eco').toLowerCase(),
//                     description: reward.description || 'No description',
//                     points_required: reward.points_required || 100,
//                     icon: getIconForCategory(reward.category, reward.name),
//                     stock: reward.stock !== undefined ? reward.stock : 999,
//                     is_popular: reward.is_popular || false
//                 }));
//                 setRewards(mappedRewards);
//             } else {
//                 setRewards([]);
//             }
//         } catch (error) {
//             console.error('Error fetching rewards:', error);
//             setRewards([]);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // Fetch real volunteers from API
//     const fetchTopVolunteers = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('access_token');
            
//             const response = await axios.get('https://green-kerala-api.onrender.com/api/volunteers/', {
//                 headers: token ? { Authorization: `Bearer ${token}` } : {}
//             });
            
//             let volunteersArray = [];
//             if (Array.isArray(response.data)) {
//                 volunteersArray = response.data;
//             } else if (response.data.results) {
//                 volunteersArray = response.data.results;
//             }
            
//             let volunteersWithPoints = volunteersArray
//                 .filter(v => (v.total_points || 0) > 0)
//                 .map(v => ({
//                     username: v.user?.username || 'Unknown',
//                     points: v.total_points || 0,
//                     city: v.city || ''
//                 }))
//                 .sort((a, b) => b.points - a.points);
            
//             // If current user has points but not in the list, add them
//             if (points > 0 && !volunteersWithPoints.some(v => v.username === user?.username)) {
//                 volunteersWithPoints.push({
//                     username: user?.username,
//                     points: points,
//                     city: ''
//                 });
//                 volunteersWithPoints.sort((a, b) => b.points - a.points);
//             }
            
//             console.log('Volunteers with points:', volunteersWithPoints);
            
//             const top3 = volunteersWithPoints.slice(0, 3);
//             setTopVolunteers(top3);
            
//             const currentUsername = user?.username;
//             const rank = volunteersWithPoints.findIndex(v => v.username === currentUsername);
//             setCurrentUserRank(rank !== -1 ? rank + 1 : null);
            
//         } catch (error) {
//             console.error('Error fetching volunteers:', error);
//             // Fallback to hardcoded data with current user's points
//             const fallbackData = [
//                 { username: 'anjana', points: 381, city: 'Kalady' },
//                 { username: 'shyma', points: points > 0 ? points : 240, city: '' },
//                 { username: 'appu', points: 4, city: 'kannur' }
//             ];
//             fallbackData.sort((a, b) => b.points - a.points);
//             setTopVolunteers(fallbackData);
//             const rank = fallbackData.findIndex(v => v.username === user?.username);
//             setCurrentUserRank(rank !== -1 ? rank + 1 : null);
//         }
//     }, [user, points]);

//     useEffect(() => {
//         fetchRewards();
//         refreshPoints();
//         fetchTopVolunteers();
        
//         const interval = setInterval(() => {
//             fetchRewards();
//             refreshPoints();
//             fetchTopVolunteers();
//         }, 15000);
        
//         return () => clearInterval(interval);
//     }, [fetchRewards, refreshPoints, fetchTopVolunteers]);

//     const handleRedeem = async (reward) => {
//         if (points >= reward.points_required) {
//             try {
//                 const token = localStorage.getItem('access_token');
//                 if (!token) {
//                     setRedeemedMessage(`❌ Please login to redeem rewards`);
//                     setTimeout(() => setRedeemedMessage(''), 4000);
//                     return;
//                 }
                
//                 const response = await axios.post(
//                     'https://green-kerala-api.onrender.com/api/redemptions/', 
//                     { reward: reward.id },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
                
//                 if (response.status === 200 || response.status === 201) {
//                     deductPoints(reward.points_required);
//                     setRedeemedMessage(`🎉 Success! You redeemed: ${reward.name}!`);
//                     fetchRewards();
//                     refreshPoints();
//                     fetchTopVolunteers();
//                 }
//             } catch (error) {
//                 setRedeemedMessage(`❌ Failed to redeem. Please try again.`);
//             }
//             setTimeout(() => setRedeemedMessage(''), 4000);
//         } else {
//             setRedeemedMessage(`❌ Need ${reward.points_required - points} more points for ${reward.name}`);
//             setTimeout(() => setRedeemedMessage(''), 4000);
//         }
//     };

//     const handleRecyclingTips = () => {
//         alert("♻️ Recycling Tips\n\n✅ Rinse containers before recycling\n✅ Remove labels from bottles\n✅ Flatten cardboard boxes\n✅ Don't recycle greasy pizza boxes\n\n💡 Recycling one aluminum can saves enough energy to power a TV for 3 hours!");
//     };

//     const handleWasteSegregation = () => {
//         alert("📚 Waste Segregation Guide\n\n🟢 Green Bin: Wet waste (food, vegetables, fruits)\n🔵 Blue Bin: Dry waste (plastic, paper, glass, metal)\n🔴 Red Bin: Hazardous (batteries, e-waste, medicines)\n⚫ Black Bin: Reject (sanitary waste, diapers, masks)\n\n⚠️ Never mix wet and dry waste!");
//     };

//     const handleEcoTips = () => {
//         alert("🌱 Eco Tips for Daily Life\n\n🌿 Carry a reusable bag - Save 500+ plastic bags per year\n🌿 Use a water bottle - Avoid 100+ plastic bottles annually\n🌿 Compost food waste - Reduces methane emissions\n🌿 Turn off lights when leaving a room\n🌿 Take shorter showers - Save thousands of liters of water\n🌿 Plant a tree - One tree absorbs 22kg CO2 per year");
//     };

//     const handleMyImpact = () => {
//         const treesSaved = Math.floor(points / 100);
//         const co2Saved = (points * 0.5).toFixed(1);
//         const waterSaved = points * 10;
//         alert(`📊 My Environmental Impact\n\n🏆 Total Points: ${points}\n🌳 Trees Saved: ~${treesSaved}\n💨 CO2 Reduced: ~${co2Saved} kg\n💧 Water Saved: ~${waterSaved} liters\n🗑️ Waste Diverted: ~${Math.floor(points / 10)} kg\n\n🌟 Keep going! Every small action counts!`);
//     };

//     const getFilteredRewards = () => {
//         if (selectedCategory === 'all') return rewards;
//         return rewards.filter(reward => reward.category === selectedCategory);
//     };

//     const filteredRewards = getFilteredRewards();

//     if (loading) {
//         return (
//             <div className="text-center mt-5">
//                 <div className="spinner-border text-success" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="mt-2">Loading rewards...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="container py-5">
//             {redeemedMessage && (
//                 <div className={`alert ${redeemedMessage.includes('Success') ? 'alert-success' : 'alert-danger'} text-center shadow-lg mb-4`}>
//                     <strong>{redeemedMessage}</strong>
//                 </div>
//             )}

//             {/* Hero Banner */}
//             <div className="card border-0 rounded-4 mb-5 overflow-hidden shadow-lg" 
//                  style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
//                 <div className="card-body p-5 text-white text-center">
//                     <div className="mb-3"><span className="display-1">🏆</span></div>
//                     <h2 className="fw-bold mb-2">Your Eco Points Balance</h2>
//                     <div className="display-1 fw-bold my-3">{points.toLocaleString()}</div>
//                     <p className="lead mb-0">🌟 Keep up the great work!</p>
//                     <div className="mt-4">
//                         <div className="progress" style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
//                             <div className="progress-bar bg-warning" style={{ width: `${Math.min((points / 5000) * 100, 100)}%` }}></div>
//                         </div>
//                         <small className="mt-2 d-block">Next Milestone: 5,000 points</small>
//                     </div>
//                 </div>
//             </div>

//             {/* Category Filter */}
//             <div className="mb-5">
//                 <div className="d-flex flex-wrap justify-content-center gap-3">
//                     <button onClick={() => setSelectedCategory('all')} className={`btn btn-lg px-4 py-2 rounded-pill fw-bold ${selectedCategory === 'all' ? 'btn-success text-white shadow' : 'btn-outline-success'}`}>✨ All Rewards</button>
//                     <button onClick={() => setSelectedCategory('eco')} className={`btn btn-lg px-4 py-2 rounded-pill fw-bold ${selectedCategory === 'eco' ? 'btn-success text-white shadow' : 'btn-outline-success'}`}>🌱 Eco Products</button>
//                     <button onClick={() => setSelectedCategory('merchandise')} className={`btn btn-lg px-4 py-2 rounded-pill fw-bold ${selectedCategory === 'merchandise' ? 'btn-success text-white shadow' : 'btn-outline-success'}`}>👕 Merchandise</button>
//                     <button onClick={() => setSelectedCategory('vouchers')} className={`btn btn-lg px-4 py-2 rounded-pill fw-bold ${selectedCategory === 'vouchers' ? 'btn-success text-white shadow' : 'btn-outline-success'}`}>🎫 Vouchers & Events</button>
//                 </div>
//             </div>

//             {/* Rewards Grid */}
//             <div className="row g-4 mb-5">
//                 <div className="col-12">
//                     <div className="row g-4">
//                         <div className="col-12">
//                             <h3 className="fw-bold mb-4">
//                                 {selectedCategory === 'all' && '🎁 All Rewards'}
//                                 {selectedCategory === 'eco' && '🌱 Eco Products'}
//                                 {selectedCategory === 'merchandise' && '👕 HarithaMission Merchandise'}
//                                 {selectedCategory === 'vouchers' && '🎫 Vouchers & Events'}
//                             </h3>
//                         </div>
                        
//                         {filteredRewards.length === 0 ? (
//                             <div className="col-12 text-center py-5">
//                                 <div className="alert alert-info">
//                                     <h4>🎁 No Rewards Available Yet</h4>
//                                     <p>Check back soon!</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             filteredRewards.map(reward => (
//                                 <div key={reward.id} className="col-lg-3 col-md-4 col-sm-6">
//                                     <div className="card border-0 shadow-sm h-100 rounded-4">
//                                         <div className="card-body p-4 text-center">
//                                             <div className="mb-3"><span className="display-1">{reward.icon}</span></div>
//                                             <h4 className="fw-bold mb-2 fs-5">{reward.name}</h4>
//                                             <p className="text-muted small mb-3">{reward.description.substring(0, 60)}...</p>
//                                             <div className="mb-3">
//                                                 <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">🪙 {reward.points_required} pts</span>
//                                                 <span className={`badge ${reward.stock > 20 ? 'bg-secondary' : 'bg-warning'} ms-2 px-3 py-2 rounded-pill`}>📦 {reward.stock}</span>
//                                             </div>
//                                             {reward.is_popular && <div className="mb-2"><span className="badge bg-danger rounded-pill px-3">🔥 Popular</span></div>}
//                                             <button 
//                                                 className={`btn w-100 py-2 fw-bold rounded-pill ${points >= reward.points_required && reward.stock > 0 ? 'btn-success' : 'btn-secondary'}`}
//                                                 onClick={() => handleRedeem(reward)}
//                                                 disabled={points < reward.points_required || reward.stock === 0}
//                                             >
//                                                 {points >= reward.points_required && reward.stock > 0 ? '🎁 Redeem Now' : 
//                                                  points < reward.points_required ? `Need ${reward.points_required - points} more` : 'Out of Stock'}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Learn & Grow Section */}
//             <div className="row mb-5">
//                 <div className="col-12">
//                     <div className="card border-0 shadow-lg rounded-4">
//                         <div className="card-header bg-white border-0 pt-4">
//                             <h3 className="fw-bold text-center">📚 Learn & Grow</h3>
//                             <p className="text-center text-muted">Click to get helpful information</p>
//                         </div>
//                         <div className="card-body p-4">
//                             <div className="row g-4">
//                                 <div className="col-md-3">
//                                     <button onClick={handleRecyclingTips} className="btn btn-outline-success w-100 py-3 rounded-4" style={{ transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>♻️ Recycling Tips</button>
//                                 </div>
//                                 <div className="col-md-3">
//                                     <button onClick={handleWasteSegregation} className="btn btn-outline-primary w-100 py-3 rounded-4" style={{ transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>📚 Waste Segregation</button>
//                                 </div>
//                                 <div className="col-md-3">
//                                     <button onClick={handleEcoTips} className="btn btn-outline-warning w-100 py-3 rounded-4" style={{ transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>🌱 Eco Tips</button>
//                                 </div>
//                                 <div className="col-md-3">
//                                     <button onClick={handleMyImpact} className="btn btn-outline-info w-100 py-3 rounded-4" style={{ transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>📊 My Impact</button>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="card-footer bg-white border-0 pb-4 px-4">
//                             <div className="alert alert-success mb-0 rounded-3 text-center">
//                                 <strong>💡 Small actions, big impact!</strong> Every pickup helps our planet.
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Top Volunteers Section */}
//             <div className="row">
//                 <div className="col-12">
//                     <div className="card border-0 shadow-lg rounded-4">
//                         <div className="card-header bg-white border-0 pt-4">
//                             <h3 className="fw-bold text-center">🏆 Top Volunteers</h3>
//                             <p className="text-center text-muted">Highest Points</p>
//                         </div>
//                         <div className="card-body p-4">
//                             {topVolunteers.length > 0 ? (
//                                 <div className="row">
//                                     {topVolunteers.map((volunteer, index) => (
//                                         <div key={index} className="col-md-4">
//                                             <div className="text-center p-3 rounded-3 h-100" style={{ backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}>
//                                                 <span className="display-1">
//                                                     {index === 0 && '🥇'}
//                                                     {index === 1 && '🥈'}
//                                                     {index === 2 && '🥉'}
//                                                 </span>
//                                                 <h4 className="fw-bold mt-2">{volunteer.username}</h4>
//                                                 <p className="fw-bold fs-4">{volunteer.points.toLocaleString()} pts</p>
//                                                 {volunteer.city && <small className="text-muted">📍 {volunteer.city}</small>}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-4">
//                                     <p className="text-muted">No volunteers with points yet.</p>
//                                     <p className="text-muted">Schedule waste pickups to earn points and appear on leaderboard!</p>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="card-footer bg-white border-0 pb-4 px-4">
//                             <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: '#E8F5E9' }}>
//                                 <div>
//                                     <span className="fw-bold fs-5">🏆 Your Rank</span>
//                                     {currentUserRank ? (
//                                         <div className="text-success fw-bold">#{currentUserRank} on leaderboard</div>
//                                     ) : points > 0 ? (
//                                         <div className="text-muted">Complete more to rank higher!</div>
//                                     ) : (
//                                         <div className="text-muted">Schedule your first pickup to appear!</div>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <span className="fw-bold text-success fs-2">{points.toLocaleString()} pts</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Rewards;


import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Rewards = () => {
    const { user } = useAuth();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPoints, setUserPoints] = useState(0);
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

    // Fetch current user's points
    const fetchUserPoints = useCallback(async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setUserPoints(0);
                return;
            }

            const response = await axios.get('https://green-kerala-api.onrender.com/api/volunteer-profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const points = response.data.total_points || response.data.points || 0;
            console.log('Current user points:', points);
            setUserPoints(points);
            
        } catch (error) {
            console.error('Error fetching user points:', error);
            setUserPoints(0);
        }
    }, []);

    // Fetch REAL top volunteers from database
    const fetchTopVolunteers = useCallback(async () => {
        try {
            const token = localStorage.getItem('access_token');
            
            // Fetch all volunteers from API
            const response = await axios.get('https://green-kerala-api.onrender.com/api/volunteers/', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            
            let volunteersArray = [];
            if (Array.isArray(response.data)) {
                volunteersArray = response.data;
            } else if (response.data.results) {
                volunteersArray = response.data.results;
            }
            
            console.log('All volunteers from database:', volunteersArray);
            
            // Filter volunteers with points > 0 and sort by points (highest first)
            const volunteersWithPoints = volunteersArray
                .filter(v => (v.total_points || 0) > 0)
                .map(v => ({
                    username: v.user?.username || 'Unknown',
                    points: v.total_points || 0,
                    city: v.city || ''
                }))
                .sort((a, b) => b.points - a.points);
            
            console.log('Volunteers with points (sorted):', volunteersWithPoints);
            
            // Take top 3
            const top3 = volunteersWithPoints.slice(0, 3);
            setTopVolunteers(top3);
            
            // Find current user's rank
            const currentUsername = user?.username;
            const rank = volunteersWithPoints.findIndex(v => v.username === currentUsername);
            setCurrentUserRank(rank !== -1 ? rank + 1 : null);
            
        } catch (error) {
            console.error('Error fetching volunteers:', error);
            // If API fails, show message
            setTopVolunteers([]);
            setCurrentUserRank(null);
        }
    }, [user]);

    useEffect(() => {
        fetchRewards();
        fetchUserPoints();
        fetchTopVolunteers();
        
        const interval = setInterval(() => {
            fetchRewards();
            fetchUserPoints();
            fetchTopVolunteers();
        }, 15000);
        
        return () => clearInterval(interval);
    }, [fetchRewards, fetchUserPoints, fetchTopVolunteers]);

    const handleRedeem = async (reward) => {
        if (userPoints >= reward.points_required) {
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
                    const newPoints = userPoints - reward.points_required;
                    setUserPoints(newPoints);
                    setRedeemedMessage(`🎉 Success! You redeemed: ${reward.name}!`);
                    fetchRewards();
                    fetchUserPoints();
                    fetchTopVolunteers();
                }
            } catch (error) {
                setRedeemedMessage(`❌ Failed to redeem. Please try again.`);
            }
            setTimeout(() => setRedeemedMessage(''), 4000);
        } else {
            setRedeemedMessage(`❌ Need ${reward.points_required - userPoints} more points for ${reward.name}`);
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
        alert(`📊 My Environmental Impact\n\n🏆 Total Points: ${userPoints}\n🌳 Trees Saved: ~${Math.floor(userPoints / 100)}\n💨 CO2 Reduced: ~${(userPoints * 0.5).toFixed(1)} kg\n💧 Water Saved: ~${userPoints * 10} liters`);
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

            {/* Debug Info - Shows real data count */}
            <div className="alert alert-info text-center small">
                📊 Database Volunteers with points: {topVolunteers.length} | Your Points: {userPoints}
            </div>

            {/* Hero Banner */}
            <div className="card border-0 rounded-4 mb-5 overflow-hidden shadow-lg" 
                 style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
                <div className="card-body p-5 text-white text-center">
                    <div className="mb-3"><span className="display-1">🏆</span></div>
                    <h2 className="fw-bold mb-2">Your Eco Points Balance</h2>
                    <div className="display-1 fw-bold my-3">{userPoints.toLocaleString()}</div>
                    <p className="lead mb-0">🌟 Keep up the great work!</p>
                    <div className="mt-4">
                        <div className="progress" style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
                            <div className="progress-bar bg-warning" style={{ width: `${Math.min((userPoints / 5000) * 100, 100)}%` }}></div>
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
                                <div key={reward.id} className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="card border-0 shadow-sm h-100 rounded-4">
                                        <div className="card-body p-4 text-center">
                                            <div className="mb-3"><span className="display-1">{reward.icon}</span></div>
                                            <h4 className="fw-bold mb-2 fs-5">{reward.name}</h4>
                                            <p className="text-muted small mb-3">{reward.description.substring(0, 60)}...</p>
                                            <div className="mb-3">
                                                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">🪙 {reward.points_required} pts</span>
                                                <span className={`badge ${reward.stock > 20 ? 'bg-secondary' : 'bg-warning'} ms-2 px-3 py-2 rounded-pill`}>📦 {reward.stock}</span>
                                            </div>
                                            {reward.is_popular && <div className="mb-2"><span className="badge bg-danger rounded-pill px-3">🔥 Popular</span></div>}
                                            <button 
                                                className={`btn w-100 py-2 fw-bold rounded-pill ${userPoints >= reward.points_required && reward.stock > 0 ? 'btn-success' : 'btn-secondary'}`}
                                                onClick={() => handleRedeem(reward)}
                                                disabled={userPoints < reward.points_required || reward.stock === 0}
                                            >
                                                {userPoints >= reward.points_required && reward.stock > 0 ? '🎁 Redeem Now' : 
                                                 userPoints < reward.points_required ? `Need ${reward.points_required - userPoints} more` : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Learn & Grow Section */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="card border-0 shadow-lg rounded-4">
                        <div className="card-header bg-white border-0 pt-4">
                            <h3 className="fw-bold text-center">📚 Learn & Grow</h3>
                            <p className="text-center text-muted">Click to get helpful information</p>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-3">
                                    <button onClick={handleRecyclingTips} className="btn btn-outline-success w-100 py-3 rounded-4">♻️ Recycling Tips</button>
                                </div>
                                <div className="col-md-3">
                                    <button onClick={handleWasteSegregation} className="btn btn-outline-primary w-100 py-3 rounded-4">📚 Waste Segregation</button>
                                </div>
                                <div className="col-md-3">
                                    <button onClick={handleEcoTips} className="btn btn-outline-warning w-100 py-3 rounded-4">🌱 Eco Tips</button>
                                </div>
                                <div className="col-md-3">
                                    <button onClick={handleMyImpact} className="btn btn-outline-info w-100 py-3 rounded-4">📊 My Impact</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Volunteers Section - Shows REAL data from database */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-lg rounded-4">
                        <div className="card-header bg-white border-0 pt-4">
                            <h3 className="fw-bold text-center">🏆 Top Volunteers</h3>
                            <p className="text-center text-muted">Highest Points (from database)</p>
                        </div>
                        <div className="card-body p-4">
                            {topVolunteers.length > 0 ? (
                                <div className="row">
                                    {topVolunteers.map((volunteer, index) => (
                                        <div key={index} className="col-md-4">
                                            <div className="text-center p-3 rounded-3 h-100" style={{ backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}>
                                                <span className="display-1">
                                                    {index === 0 && '🥇'}
                                                    {index === 1 && '🥈'}
                                                    {index === 2 && '🥉'}
                                                </span>
                                                <h4 className="fw-bold mt-2">{volunteer.username}</h4>
                                                <p className="fw-bold fs-4">{volunteer.points} pts</p>
                                                {volunteer.city && <small className="text-muted">📍 {volunteer.city}</small>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No volunteers with points in database yet.</p>
                                    <p className="text-muted">Schedule waste pickups to earn points!</p>
                                </div>
                            )}
                        </div>
                        <div className="card-footer bg-white border-0 pb-4 px-4">
                            <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: '#E8F5E9' }}>
                                <div>
                                    <span className="fw-bold fs-5">🏆 Your Rank</span>
                                    {currentUserRank ? (
                                        <div className="text-success fw-bold">#{currentUserRank} on leaderboard</div>
                                    ) : userPoints > 0 ? (
                                        <div className="text-muted">Complete more to rank higher!</div>
                                    ) : (
                                        <div className="text-muted">Schedule your first pickup to appear!</div>
                                    )}
                                </div>
                                <div>
                                    <span className="fw-bold text-success fs-2">{userPoints} pts</span>
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