import React from 'react';
import { Stack, TextField, MenuItem, Button, Typography, Box, Container } from '@mui/material';
import { useState } from 'react';

// Example logo URL, replace with your actual logo
const logoUrl = 'https://via.placeholder.com/150';

const branches = ['Branch 1', 'Branch 2', 'Branch 3']; // Example branches

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');

    const handleLogin = () => {
        // Handle login logic here
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('Selected Branch:', selectedBranch);
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: '#fff',
                }}
            >
                <img src={logoUrl} alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <Stack spacing={2} sx={{ width: '100%' }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        select
                        label="Branch"
                        variant="outlined"
                        fullWidth
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        {branches.map((branch) => (
                            <MenuItem key={branch} value={branch}>
                                {branch}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button variant="contained" color="primary" onClick={handleLogin}>
                        Login
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default Login;
