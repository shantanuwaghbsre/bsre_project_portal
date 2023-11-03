import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, MenuItem, Menu, Box } from '@mui/material';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate()

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
                        onClick={handleClick}
                        aria-controls="residential-menu"
                        aria-haspopup="true"
                    >
                        Quotations
                    </Button>
                    <Menu
                        id="residential-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem component={Link} to="/ResidentialQuotation" onClick={handleClose}>
                            Create Residential Quotation
                        </MenuItem>
                        <MenuItem component={Link} to="/ViewQuotations" onClick={handleClose}>View All Quotations</MenuItem>
                        <MenuItem component={Link} to="/CommercialOrIndustrialQuotation" onClick={handleClose}>Commercial/Industrial Quotation</MenuItem>
                        {/* <MenuItem onClick={handleClose}> Option 3</MenuItem> */}
                    </Menu>
                    <Button component={Link} to={{ pathname: '/CustomerOnboarding',  }} state={{"quotation":null}} color='inherit'>Customer Onboarding</Button>  
                    <Button component={Link} to="/contact" color="inherit">Contact</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
