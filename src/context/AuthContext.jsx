import React, { createContext, useContext, useState, useEffect } from 'react';
import service from '../appwrite/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await service.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

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