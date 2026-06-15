// import { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const PointsContext = createContext();

// export const usePoints = () => useContext(PointsContext);

// export const PointsProvider = ({ children }) => {
//     const [points, setPoints] = useState(0);
//     const [loading, setLoading] = useState(true);

//     const fetchPoints = async () => {
//         try {
//             const token = localStorage.getItem('access_token');
            
//             if (!token) {
//                 // Try to load from localStorage if not logged in
//                 const savedPoints = localStorage.getItem('user_points');
//                 if (savedPoints) {
//                     setPoints(parseInt(savedPoints));
//                 }
//                 setLoading(false);
//                 return;
//             }

//             const response = await axios.get('https://green-kerala-api.onrender.com/api/volunteer-profile/', {
//                 headers: { 
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
            
//             const userPoints = response.data.total_points || response.data.points || 0;
//             setPoints(userPoints);
//             // Save to localStorage for persistence across sessions
//             localStorage.setItem('user_points', userPoints);
            
//         } catch (error) {
//             console.error('Error fetching points:', error);
//             // Fallback to localStorage if API fails
//             const savedPoints = localStorage.getItem('user_points');
//             if (savedPoints) {
//                 setPoints(parseInt(savedPoints));
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const addPoints = (newPoints) => {
//         const updatedPoints = points + newPoints;
//         setPoints(updatedPoints);
//         localStorage.setItem('user_points', updatedPoints);
        
//         // Also try to update backend
//         updateBackendPoints(updatedPoints);
//     };

//     const deductPoints = (pointsToDeduct) => {
//         const updatedPoints = points - pointsToDeduct;
//         setPoints(updatedPoints);
//         localStorage.setItem('user_points', updatedPoints);
        
//         // Also try to update backend
//         updateBackendPoints(updatedPoints);
//     };

//     const updateBackendPoints = async (newPoints) => {
//         try {
//             const token = localStorage.getItem('access_token');
//             if (!token) return;
            
//             // Update volunteer profile with new points
//             await axios.patch('https://green-kerala-api.onrender.com/api/volunteer-profile/', 
//                 { total_points: newPoints },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//         } catch (error) {
//             console.error('Error updating backend points:', error);
//         }
//     };

//     const refreshPoints = () => {
//         fetchPoints();
//     };

//     useEffect(() => {
//         fetchPoints();
//     }, []);

//     return (
//         <PointsContext.Provider value={{ 
//             points, 
//             loading, 
//             addPoints, 
//             deductPoints, 
//             fetchPoints,
//             refreshPoints 
//         }}>
//             {children}
//         </PointsContext.Provider>
//     );
// };

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const PointsContext = createContext();

export const usePoints = () => useContext(PointsContext);

export const PointsProvider = ({ children }) => {
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchPoints = async () => {
        try {
            const token = localStorage.getItem('access_token');
            
            if (!token) {
                const savedPoints = localStorage.getItem('user_points');
                if (savedPoints) {
                    setPoints(parseInt(savedPoints));
                }
                setLoading(false);
                return;
            }

            console.log('🔍 Fetching points for user...');
            
            const response = await axios.get('https://green-kerala-api.onrender.com/api/volunteer-profile/', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📦 API Response:', response.data);
            
            const userPoints = response.data.total_points || response.data.points || 0;
            
            console.log('⭐ User points from API:', userPoints);
            
            setPoints(userPoints);
            localStorage.setItem('user_points', userPoints);
            
        } catch (error) {
            console.error('❌ Error fetching points:', error);
            
            // Try to get points from volunteers API as fallback
            try {
                const token = localStorage.getItem('access_token');
                const username = localStorage.getItem('username') || 'shyma';
                
                const volunteersResponse = await axios.get('https://green-kerala-api.onrender.com/api/volunteers/', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                
                let volunteersArray = [];
                if (Array.isArray(volunteersResponse.data)) {
                    volunteersArray = volunteersResponse.data;
                } else if (volunteersResponse.data.results) {
                    volunteersArray = volunteersResponse.data.results;
                }
                
                const currentUser = volunteersArray.find(v => v.user?.username === username);
                if (currentUser && currentUser.total_points) {
                    console.log('Found points from volunteers API:', currentUser.total_points);
                    setPoints(currentUser.total_points);
                    localStorage.setItem('user_points', currentUser.total_points);
                } else {
                    const savedPoints = localStorage.getItem('user_points');
                    if (savedPoints) {
                        setPoints(parseInt(savedPoints));
                    }
                }
            } catch (err) {
                console.error('Failed to get points from volunteers API:', err);
                const savedPoints = localStorage.getItem('user_points');
                if (savedPoints) {
                    setPoints(parseInt(savedPoints));
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const addPoints = async (newPoints) => {
        const updatedPoints = points + newPoints;
        setPoints(updatedPoints);
        localStorage.setItem('user_points', updatedPoints);
        
        console.log('➕ Adding points:', newPoints, 'Total:', updatedPoints);
        
        await updateBackendPoints(updatedPoints);
    };

    const deductPoints = async (pointsToDeduct) => {
        const updatedPoints = points - pointsToDeduct;
        setPoints(updatedPoints);
        localStorage.setItem('user_points', updatedPoints);
        
        console.log('➖ Deducting points:', pointsToDeduct, 'Total:', updatedPoints);
        
        await updateBackendPoints(updatedPoints);
    };

    const updateBackendPoints = async (newPoints) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            
            console.log('💾 Updating backend points to:', newPoints);
            
            await axios.patch('https://green-kerala-api.onrender.com/api/volunteer-profile/', 
                { total_points: newPoints },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log('✅ Backend updated successfully');
        } catch (error) {
            console.error('❌ Error updating backend:', error);
        }
    };

    const refreshPoints = () => {
        console.log('🔄 Refreshing points...');
        fetchPoints();
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    return (
        <PointsContext.Provider value={{ 
            points, 
            loading, 
            addPoints, 
            deductPoints, 
            fetchPoints,
            refreshPoints 
        }}>
            {children}
        </PointsContext.Provider>
    );
};