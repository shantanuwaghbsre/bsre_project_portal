import "./App.css";
import ResidentialQuotation from "./Components/ResidentialQuotation/ResidentialQuotation";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ViewQuotations from "./Components/ViewQuotations/ViewQuotations";
import ConsumerOnboarding from "./Components/ConsumerOnboarding/ConsumerOnboarding";
import AddAgent from "./Components/Agent/Addagent";
import CommercialOrIndustrialQuotation from "./Components/CommercialOrIndustrialQuotation/CommercialOrIndustrialQuotation";
import FileDownloader from "./Components/Trial/Trial";
import ViewAllConsumers from "./Components/ViewAllConsumers/ViewAllConsumers";
import ViewAllAgents from "./Components/Agent/ViewAllAgents";
import ViewAgent from "./Components/Agent/ViewAgent";
import ViewConsumer from "./Components/ViewConsumer/ViewConsumer";
import StartProject from "./Components/StartProject/StartProject";
import Dashboard from "./Components/Dashboard/Dashboard";
import ViewProject from "./Components/ViewProject/ViewProject";
import { useEffect, useState } from "react";
import Keycloak from "keycloak-js";
import { ToastContainer } from "react-toastify";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawerwidth from "./Components/Navbar/Navbar";
import { ErrorPage } from "./Components/ErrorPage/ErrorPage";
import { Stack } from "@mui/material";
import Kusum from "./pages/Kusum/Kusum";
import Ppa from "./pages/Ppa/Ppa";
import SolarPark from "./pages/SolarPark/SolarPark";
import Login from "./pages/Login/Login";

let initOptions = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: "myrealm",
  clientId: "a_client",
};

const App = () => {
  const [kc, setKc] = useState({ token: "1234" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(true);

  const CustomHistoryWrapper = () => {
    const location = useLocation();

    //   useEffect(() => {
    //     // Modify the location object here
    //     console.log(location.pathname);
    //     console.log(isAuthenticated);
    //   }, [location]);

    //   return null;
  };

  // useEffect(() => {
  //   const initializeKeycloak = async () => {
  //     const keycloak = new Keycloak({
  //       clientId: initOptions.clientId,
  //       realm: initOptions.realm,
  //       url: initOptions.url,
  //     });
  //     await keycloak.init({ onLoad: 'login-required', pkceMethod: "S256", redirectUri: 'import.meta.env.VITE_FRONTEND_URL', responseMode: 'query', }).then(
  //       () => {
  //         console.log("keycloak");
  //         console.log(keycloak);
  //         setKc(keycloak);

  //         const isAuthenticated = keycloak.authenticated;
  //         setIsAuthenticated(isAuthenticated);
  //       },
  //       (error) => {
  //         console.error('Failed to initialize Keycloak:', error);
  //       }
  //     )
  //   };

  //   initializeKeycloak();
  // }, []);

  const handleLogout = () => {
    // if (kc) {
    //   kc.logout();
    // }
    console.log("logout");
  };

  return (
    <>
      <ToastContainer
        style={{
          width: "400px",
          marginTop: "60px",
          padding: "0 !important",
          zIndex: "2",
        }}
      />
      {isAuthenticated && kc.token.length > 0  ? (
        <BrowserRouter>
          {/* <CustomHistoryWrapper/> */}
          <Navbar kc={kc} />
          {/* logout={handleLogout} */}
          <Box
            sx={{
              display: "flex",
              m: "5rem 0 0 0",
              width: "85% !important",
            }}
          >
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: "100% !important",
              }}
            >
              <Typography paragraph>
                <Routes>
                  <Route
                    path="/ResidentialQuotation"
                    element={<ResidentialQuotation token={kc.token} />}
                  />
                  <Route
                    path="/ViewQuotations"
                    element={<ViewQuotations token={kc.token} />}
                  />
                  <Route
                    path="/ConsumerOnboarding"
                    element={<ConsumerOnboarding token={kc.token} />}
                  />
                  <Route
                    path="/AddAgent"
                    element={<AddAgent token={kc.token} />}
                  />
                  <Route path="/kusum" element={<Kusum />} />
                  <Route path="/ppa" element={<Ppa />} />
                  <Route path="/solarpark" element={<SolarPark />} />
                  <Route
                    path="/ViewAllConsumers"
                    element={<ViewAllConsumers token={kc.token} />}
                  />
                  <Route
                    path="/ViewConsumer"
                    element={<ViewConsumer token={kc.token} />}
                  />
                  <Route
                    path="/ViewAllAgents"
                    element={<ViewAllAgents token={kc.token} />}
                  />
                  <Route
                    path="/ViewAgent"
                    element={<ViewAgent token={kc.token} />}
                  />
                  <Route
                    path="/CommercialOrIndustrialQuotation"
                    element={
                      <CommercialOrIndustrialQuotation token={kc.token} />
                    }
                  />
                  <Route
                    path="/StartProject"
                    element={<StartProject token={kc.token} />}
                  />
                  <Route path="/" element={<Dashboard token={kc.token} />} />
                  <Route
                    path="/Dashboard"
                    element={<Dashboard token={kc.token} />}
                  />
                  <Route
                    path="/ViewProject"
                    element={<ViewProject token={kc.token} />}
                  />

                  <Route path="/*" element={<ErrorPage token={kc.token} />} />
                </Routes>
              </Typography>
            </Box>
          </Box>
        </BrowserRouter>
      )
        :
        (
          <BrowserRouter>
          <div style={{ color:"#000",display: "flex", justifyContent: "center" }}>
            <Routes>
              <Route
                path="/login"
                element={<Login />}
              />
              <Route path="/*" element={<ErrorPage />} />
            </Routes>
            </div>
          </BrowserRouter>
        )
      }
    </>
  );
};

export default App;
