import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateGuestId } from '../utils/guestUtils';
import { useAuth } from './AuthContext';  // This should now work correctly

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const { user } = useAuth();
    const userId = user ? user.$id : generateGuestId();

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem(`cart_${userId}`);
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, [userId]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }, [cart, userId]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.$id === product.$id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.$id === product.$id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.$id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem(`cart_${userId}`);
    };

    const increaseQuantity = (productId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.$id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (productId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.$id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            increaseQuantity,
            decreaseQuantity,
            cartTotalItems
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}