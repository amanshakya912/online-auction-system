import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        token: localStorage.getItem('token') || null,
        username: localStorage.getItem('username') || null,
        id: localStorage.getItem('id') || null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sync state across tabs
        const handleStorageChange = () => {
            setUser({
                token: localStorage.getItem('token'),
                username: localStorage.getItem('username'),
                id: localStorage.getItem('id'),
            });
        };
        window.addEventListener('storage', handleStorageChange);
        setLoading(false);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (userData, accessToken) => {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('username', userData.userName);
        localStorage.setItem('id', userData._id);
        setUser({
            token: accessToken,
            username: userData.userName,
            id: userData._id,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('id');
        setUser({ token: null, username: null, id: null });
        window.location.href = '/sign-up';
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user.token,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
