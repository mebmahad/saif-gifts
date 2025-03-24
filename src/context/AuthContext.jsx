import React, { createContext, useContext, useState, useEffect } from 'react';
import service from '../appwrite/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await service.getCurrentUser();
                if (currentUser) {
                    // Get additional user data including role
                    const userData = await service.getUserData(currentUser.$id);
                    setUser({ ...currentUser, ...userData });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const value = {
        user,
        setUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}