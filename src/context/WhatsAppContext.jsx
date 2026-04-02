import React, { createContext, useContext, useState, useEffect } from 'react';

const WhatsAppContext = createContext();

export function WhatsAppProvider({ children }) {
    const [phoneNumber, setPhoneNumber] = useState('61493785494');

    useEffect(() => {
        const stored = localStorage.getItem('whatsappNumber');
        if (stored) setPhoneNumber(stored);
    }, []);

    const updatePhoneNumber = (newNumber) => {
        setPhoneNumber(newNumber);
        localStorage.setItem('whatsappNumber', newNumber);
    };

    return (
        <WhatsAppContext.Provider value={{ phoneNumber, updatePhoneNumber }}>
            {children}
        </WhatsAppContext.Provider>
    );
}

export function useWhatsApp() {
    return useContext(WhatsAppContext);
}