import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the context type
interface RoleContextType {
    role: string | null;
    username: string | null;
    isLoggedIn: boolean;
    updateRole: (newRole: string) => void;
    login: (role: string, username: string) => void;
    logout: () => void;
}

// Create a context
const RoleContext = createContext<RoleContextType | null>(null);

// Create a provider component
export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        // Fetch role, username, and login status from localStorage on initial render
        const storedRole = localStorage.getItem('agentRole');
        const storedUsername = localStorage.getItem('username');
        const storedLoginStatus = localStorage.getItem('isLoggedIn');

        if (storedRole && storedUsername && storedLoginStatus === 'true') {
            setRole(storedRole);
            setUsername(storedUsername);
            setIsLoggedIn(true);
        }
    }, []);

    // Function to handle login
    const login = (newRole: string, newUsername: string) => {
        setRole(newRole);
        setUsername(newUsername);
        setIsLoggedIn(true);

        localStorage.setItem('agentRole', newRole);
        localStorage.setItem('username', newUsername);
        localStorage.setItem('isLoggedIn', 'true');
    };

    // Function to update the role
    const updateRole = (newRole: string) => {
        setRole(newRole);
        localStorage.setItem('agentRole', newRole);
    };

    // Function to handle logout
    const logout = () => {
        setRole(null);
        setUsername(null);
        setIsLoggedIn(false);

        localStorage.removeItem('agentRole');
        localStorage.removeItem('username');
        localStorage.setItem('isLoggedIn', 'false');
    };

    return (
        <RoleContext.Provider value={{ role, username, isLoggedIn, updateRole, login, logout }}>
            {children}
        </RoleContext.Provider>
    );
};

// Custom hook to use the RoleContext
export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};
