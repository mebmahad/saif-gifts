import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import service from '../appwrite/config';

export default function Protected({ children }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const user = await service.getCurrentUser();
            if (!user) {
                navigate('/login');
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            navigate('/login');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return children;
}