import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('access_token'));

    const API_URL = 'https://green-kerala-api.onrender.com/api';

    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/me/`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const register = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register/`, {
                username: userData.username,
                email: userData.email,
                phone: userData.phone || '',
                city: userData.city || '',
                password: userData.password,
                confirm_password: userData.confirm_password
            });
            
            if (response.data) {
                // Auto login after successful registration
                return await login(userData.username, userData.password);
            }
            return { success: true };
        } catch (error) {
            let errorMsg = 'Registration failed';
            if (error.response?.data?.username) {
                errorMsg = error.response.data.username;
            } else if (error.response?.data?.email) {
                errorMsg = error.response.data.email;
            } else if (error.response?.data?.password) {
                errorMsg = error.response.data.password;
            } else if (error.response?.data?.phone) {
                errorMsg = error.response.data.phone;
            } else if (error.response?.data?.city) {
                errorMsg = error.response.data.city;
            }
            return { success: false, error: errorMsg };
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/token/`, { username, password });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            setToken(access);
            const userResponse = await axios.get(`${API_URL}/me/`);
            setUser(userResponse.data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || 'Invalid credentials' };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};