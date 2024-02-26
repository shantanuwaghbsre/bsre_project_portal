import * as React from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, MenuItem, Menu, Box } from '@mui/material';

const Navbar = (props: any) => {
    const [anchorElQuotations, setAnchorElQuotations] = React.useState<null | HTMLElement>(null);
    const [anchorElConsumers, setAnchorElConsumers] = React.useState<null | HTMLElement>(null);

    const handleClose = () => {

        setAnchorElQuotations(null);
        setAnchorElConsumers(null);
    };

    const handleLogout =() => {
        props.logout()
        localStorage.removeItem('token')
        window.location.replace('http://192.168.29.62:8080')
    }

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6">My App</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                    <Button component={Link} to="/" color="inherit">
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        onClick={(event)=>setAnchorElQuotations(event.currentTarget)}
                        aria-controls="quotation-menu"
                        aria-haspopup="true"
                    >
                        Quotations
                    </Button>
                    <Menu
                        id="quotation-menu"
                        anchorEl={anchorElQuotations}
                        keepMounted
                        open={Boolean(anchorElQuotations)}
                        onClose={handleClose}
                    >
                        <MenuItem component={Link} to="/ResidentialQuotation" onClick={handleClose}>
                            Create Residential Quotation
                        </MenuItem>
                        <MenuItem component={Link} to="/ViewQuotations" onClick={handleClose}>View All Quotations</MenuItem>
                        <MenuItem component={Link} to="/CommercialOrIndustrialQuotation" onClick={handleClose}>Commercial/Industrial Quotation</MenuItem>
                        
                    </Menu>
                    <Button
                        color="inherit"
                        onClick={(event)=>setAnchorElConsumers(event.currentTarget)}
                        aria-controls="customers-menu"
                        aria-haspopup="true"
                    >
                        Consumers
                    </Button>
                    <Menu
                        id="customers-menu"
                        anchorEl={anchorElConsumers}
                        keepMounted
                        open={Boolean(anchorElConsumers)}
                        onClose={handleClose}
                    >
                        <MenuItem component={Link} to="/ConsumerOnboarding" onClick={handleClose}>
                            Onboard a Consumer
                        </MenuItem>
                        <MenuItem component={Link} to="/ViewAllConsumers" onClick={handleClose}>View All Consumers</MenuItem>
                    </Menu>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
