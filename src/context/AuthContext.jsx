import React, { createContext, useContext, useState, useEffect } from 'react';
import service from '../appwrite/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        user: null,
        loading: true,
        error: null
    });

    const checkAuth = async () => {
        try {
            setAuthState(prev => ({ ...prev, loading: true, error: null }));
            const user = await service.getCurrentUser();
            
            if (user?.$id) {
                setAuthState({
                    user,
                    loading: false,
                    error: null
                });
            } else {
                setAuthState({
                    user: null,
                    loading: false,
                    error: null
                });
            }
        } catch (error) {
            console.error("Auth check error:", error);
            setAuthState({
                user: null,
                loading: false,
                error: error.message || "Failed to check authentication status"
            });
        }
    };

    const setUser = (userData) => {
        setAuthState(prev => ({
            ...prev,
            user: userData
        }));
    };

    const updateUser = async () => {
        await checkAuth();
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user: authState.user,
        setUser,
        loading: authState.loading,
        error: authState.error,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!authState.loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};