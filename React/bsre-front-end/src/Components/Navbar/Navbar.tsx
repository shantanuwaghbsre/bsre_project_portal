import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, MenuItem, Menu, Box } from '@mui/material';

const Navbar = () => {
    const [anchorElQuotations, setAnchorElQuotations] = React.useState<null | HTMLElement>(null);
    const [anchorElConsumers, setAnchorElConsumers] = React.useState<null | HTMLElement>(null);

    const handleClose = () => {
        setAnchorElQuotations(null);
        setAnchorElConsumers(null);
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
                        {/* <MenuItem onClick={handleClose}> Option 3</MenuItem> */}
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
                        <MenuItem component={Link} to="/" onClick={handleClose}>xyz</MenuItem>
                        {/* <MenuItem onClick={handleClose}> Option 3</MenuItem> */}
                    </Menu>
                    {/* <Button component={Link} to={{ pathname: '/CustomerOnboarding',  }} state={{"quotation":null}} color='inherit'>Customer Onboarding</Button>   */}
                    <Button component={Link} to="/contact" color="inherit">Contact</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
