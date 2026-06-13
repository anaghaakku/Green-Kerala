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
                // Try to load from localStorage if not logged in
                const savedPoints = localStorage.getItem('user_points');
                if (savedPoints) {
                    setPoints(parseInt(savedPoints));
                }
                setLoading(false);
                return;
            }

            const response = await axios.get('https://green-kerala-api.onrender.com/api/volunteer-profile/', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const userPoints = response.data.total_points || response.data.points || 0;
            setPoints(userPoints);
            // Save to localStorage for persistence across sessions
            localStorage.setItem('user_points', userPoints);
            
        } catch (error) {
            console.error('Error fetching points:', error);
            // Fallback to localStorage if API fails
            const savedPoints = localStorage.getItem('user_points');
            if (savedPoints) {
                setPoints(parseInt(savedPoints));
            }
        } finally {
            setLoading(false);
        }
    };

    const addPoints = (newPoints) => {
        const updatedPoints = points + newPoints;
        setPoints(updatedPoints);
        localStorage.setItem('user_points', updatedPoints);
        
        // Also try to update backend
        updateBackendPoints(updatedPoints);
    };

    const deductPoints = (pointsToDeduct) => {
        const updatedPoints = points - pointsToDeduct;
        setPoints(updatedPoints);
        localStorage.setItem('user_points', updatedPoints);
        
        // Also try to update backend
        updateBackendPoints(updatedPoints);
    };

    const updateBackendPoints = async (newPoints) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            
            // Update volunteer profile with new points
            await axios.patch('https://green-kerala-api.onrender.com/api/volunteer-profile/', 
                { total_points: newPoints },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('Error updating backend points:', error);
        }
    };

    const refreshPoints = () => {
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