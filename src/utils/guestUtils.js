export const generateGuestId = () => {
    const existingGuestId = localStorage.getItem('guestId');
    if (existingGuestId) {
        return existingGuestId;
    }

    // Generate a new guest ID using timestamp and random number
    const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestId', newGuestId);
    return newGuestId;
};