import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the context type
interface RoleContextType {
    role: string | null;
    username: string | null;
    branchName: string | null;
    isLoggedIn: boolean;
    updateRole: (newRole: string) => void;
    updateBranchName: (newBranchName: string) => void;
    login: (role: string, username: string, branchName: string) => void;
    logout: () => void;
}

// Create a context
const RoleContext = createContext<RoleContextType | null>(null);

// Create a provider component
export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [branchName, setBranchName] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        // Fetch role, username, branchName, and login status from localStorage on initial render
        const storedRole = localStorage.getItem('agentRole');
        const storedUsername = localStorage.getItem('username');
        const storedBranchName = localStorage.getItem('branchName');
        const storedLoginStatus = localStorage.getItem('isLoggedIn');

        if (storedRole && storedUsername && storedBranchName && storedLoginStatus === 'true') {
            setRole(storedRole);
            setUsername(storedUsername);
            setBranchName(storedBranchName);
            setIsLoggedIn(true);
        }
    }, []);

    // Function to handle login
    const login = (newRole: string, newUsername: string, newBranchName: string) => {
        setRole(newRole);
        setUsername(newUsername);
        setBranchName(newBranchName);
        setIsLoggedIn(true);

        localStorage.setItem('agentRole', newRole);
        localStorage.setItem('username', newUsername);
        localStorage.setItem('branchName', newBranchName);
        localStorage.setItem('isLoggedIn', 'true');
    };

    // Function to update the role
    const updateRole = (newRole: string) => {
        setRole(newRole);
        localStorage.setItem('agentRole', newRole);
    };

    // Function to update the branch name
    const updateBranchName = (newBranchName: string) => {
        setBranchName(newBranchName);
        localStorage.setItem('branchName', newBranchName);
    };

    // Function to handle logout
    const logout = () => {
        setRole(null);
        setUsername(null);
        setBranchName(null);
        setIsLoggedIn(false);

        localStorage.removeItem('agentRole');
        localStorage.removeItem('username');
        localStorage.removeItem('branchName');
        localStorage.setItem('isLoggedIn', 'false');
    };

    return (
        <RoleContext.Provider value={{ role, username, branchName, isLoggedIn, updateRole, updateBranchName, login, logout }}>
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
