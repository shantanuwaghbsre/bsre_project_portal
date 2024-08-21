import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { deepOrange } from "@mui/material/colors";
import { useRole } from "../../Contexts/RoleContext";


const drawerWidth = 245;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function Navbar(props: any) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [isCollapseQuotation, setIsCollapseQuotation] = useState(false);
  const [isCollapseAgent, setIsCollapseAgent] = useState(false);
  const [isCollapseConsumer, setIsCollapseConsumer] = useState(false);
  const [isCollapseHome, setIsCollapseHome] = useState(false);
  const { logout, username } = useRole();
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  //FOR HANDLING Navigator
  const Navigate = useNavigate();
  const handleNavigation = (path: any) => {
    Navigate(path);
  };
  //FOR HANDLING COLLAPSE of dropdown menu
  const handleCollapseQuotation = () => {
    setIsCollapseQuotation(!isCollapseQuotation);
    setIsCollapseAgent(false);
    setIsCollapseConsumer(false);
  };
  const handleCollapseAgent = () => {
    setIsCollapseAgent(!isCollapseAgent);
    setIsCollapseQuotation(false);
    setIsCollapseConsumer(false);
  };
  const handleCollapseConsumer = () => {
    setIsCollapseConsumer(!isCollapseConsumer);
    setIsCollapseQuotation(false);
    setIsCollapseAgent(false);
  };
  const handleCollapseHome = () => {
    Navigate("/");
    setIsCollapseHome(!isCollapseHome);
    setIsCollapseQuotation(false);
    setIsCollapseAgent(false);
    setIsCollapseConsumer(false);
  };
  const handleLogout = () => {
    // props.logout();
    logout()
    // localStorage.removeItem("token");
    window.location.replace(import.meta.env.VITE_KEYCLOAK_URL);
    setAnchorEl(null);
  };
  const handleChangePwd = () => {
    setAnchorEl(null);
    Navigate("/change-password");
  }

  const drawer = (
    <div>
      <Toolbar>
        <img
          src="/Images/BS-LOGO.jpg"
          alt="logo"
          width={40}
          height={40}
          style={{ position: "absolute", left: "5%", marginTop: "0%" }}
        />
        <span
          style={{
            position: "absolute",
            left: "30%",
            fontSize: "12px",
            marginTop: "-5%",
          }}
        >
          Bapa Sitaram
        </span>
        <span
          style={{
            position: "absolute",
            left: "30%",
            fontSize: "12px",
            marginTop: "5%",
          }}
        >
          Solar System
        </span>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding onClick={handleCollapseHome}>
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={handleCollapseQuotation}>
          <ListItemButton>
            <ListItemIcon>
              <FormatQuoteIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Quotation" />
            {isCollapseQuotation ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={isCollapseQuotation} timeout="auto" unmountOnExit>
          <List>
            <ListItem
              disablePadding
              onClick={() => handleNavigation("/ViewQuotations")}
            >
              <ListItemButton>
                <ListItemIcon>
                  <FormatQuoteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Quotations" />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => handleNavigation("/ResidentialQuotation")}
            >
              <ListItemButton>
                <ListItemIcon>
                  <FormatQuoteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Residential" />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() =>
                handleNavigation("/CommercialOrIndustrialQuotation")
              }
            >
              <ListItemButton>
                <ListItemIcon>
                  <FormatQuoteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Commercial/Industrial" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding onClick={() => handleNavigation("/kusum")}>
              <ListItemButton>
                <ListItemIcon>
                  <FormatQuoteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Kusum" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding onClick={() => handleNavigation("/ppa")}>
              <ListItemButton>
                <ListItemIcon>
                  <FormatQuoteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Ppa" />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => handleNavigation("/solarpark")}
            >
              <ListItemButton>
                <ListItemIcon>
                  <FormatQuoteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Solar Park" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        <ListItem disablePadding onClick={handleCollapseAgent}>
          <ListItemButton>
            <ListItemIcon>
              <SupportAgentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Agent" />
            {isCollapseAgent ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={isCollapseAgent} timeout="auto" unmountOnExit>
          <List>
            <ListItem
              disablePadding
              onClick={() => handleNavigation("/ViewAllAgents")}
            >
              <ListItemButton>
                <ListItemIcon>
                  <SupportAgentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="View Agents" />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => handleNavigation("/AddAgent")}
            >
              <ListItemButton>
                <ListItemIcon>
                  <SupportAgentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Add Agent" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        <ListItem disablePadding onClick={handleCollapseConsumer}>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Consumer" />
            {isCollapseConsumer ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={isCollapseConsumer} timeout="auto" unmountOnExit>
          <List>
            <ListItem
              disablePadding
              onClick={() => handleNavigation("/ViewAllConsumers")}
            >
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="View Consumers" />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => handleNavigation("/ConsumerOnboarding")}
            >
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Onboard Consumer" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
      {/* <Divider /> */}
      {/* <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                             <InboxIcon /> 
                        </ListItemIcon>
                        <ListItemText primary="anyThing" />
                    </ListItemButton>
                </ListItem>
            </List> */}
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;
  // No longer used
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  function stringAvatar(name: string): string {
    const nameParts = name.split(" ");
    let initials = nameParts[0][0]; // Start with the first letter of the first name
    // Check if there's a last name and add its first letter to initials
    if (nameParts.length > 1 && nameParts[1].length > 0) {
      initials += nameParts[1][0];
    }
    return initials;
  }
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            style={{ flexGrow: 1, display: "flex", justifyContent: "end" }}
            variant="h6"
            noWrap
            component="div"
          >
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: deepOrange[500] }}
                >
                  {/* {stringAvatar("Person ")} */}
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose} disabled>
                <Avatar /> {username}
              </MenuItem>

              <Divider />
              <MenuItem onClick={handleChangePwd} >
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Password
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        // sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        sx={{ ml: { xs: 0, md: "200px" } }}
        gap={2}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
