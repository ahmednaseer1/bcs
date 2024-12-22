import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [selectedRide, setSelectedRide] = useState(null);

    return (
        <AppContext.Provider value={{
            pickupLocation,
            setPickupLocation,
            dropLocation,
            setDropLocation,
            selectedRide,
            setSelectedRide,
        }}>
            {children}
        </AppContext.Provider>
    );
};
