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
import { useState } from "react";
import Keycloak from "keycloak-js";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ErrorPage } from "./Components/ErrorPage/ErrorPage";
import Kusum from "./pages/Kusum/Kusum";
import Ppa from "./pages/Ppa/Ppa";
import SolarPark from "./pages/SolarPark/SolarPark";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/SignUp";
import ChangePwd from "./pages/ChangePwd/ChangePwd";
import { useRole } from "./Contexts/RoleContext";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import NotAuthorized from "./Components/NotAuthorized/NotAuthorized";
import { Toaster } from "react-hot-toast";
import GuvnlPricesTable from "./pages/GuvnlPricesTable/GuvnlPricesTable";

let initOptions = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: "myrealm",
  clientId: "a_client",
};

const App = () => {
  // const [kc, setKc] = useState({ token: "1234" });
  const { isLoggedIn } = useRole();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {isLoggedIn ? (
        <BrowserRouter>
          <Navbar />
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
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <ResidentialQuotation />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/GuvnlPrices"
                    element={
                      <PrivateRoute allowedRoles={["Admin"]}>
                        <GuvnlPricesTable />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ViewQuotations"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <ViewQuotations />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ConsumerOnboarding"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <ConsumerOnboarding />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/AddAgent"
                    element={
                      <PrivateRoute allowedRoles={["", "BM", "Admin"]}>
                        <AddAgent />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/kusum"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <Kusum />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ppa"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <Ppa />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/solarpark"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <SolarPark />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ViewAllConsumers"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <ViewAllConsumers />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ViewConsumer"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <ViewConsumer />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ViewAllAgents"
                    element={
                      <PrivateRoute allowedRoles={["", "BM", "Admin"]}>
                        <ViewAllAgents />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ViewAgent"
                    element={
                      <PrivateRoute allowedRoles={["", "BM", "Admin"]}>
                        <ViewAgent />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/CommercialOrIndustrialQuotation"
                    element={<CommercialOrIndustrialQuotation />}
                  />
                  <Route
                    path="/StartProject"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <StartProject />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/Dashboard"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ViewProject"
                    element={
                      <PrivateRoute allowedRoles={["Agent", "BM", "Admin"]}>
                        <ViewProject />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/change-password" element={<ChangePwd />} />
                  <Route path="/not-authorized" element={<NotAuthorized />} />
                  <Route path="/*" element={<ErrorPage />} />
                </Routes>
              </Typography>
            </Box>
          </Box>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
          <div
            style={{ color: "#000", display: "flex", justifyContent: "center" }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Login />} />

              <Route path="/signup" element={<Signup />} />
              <Route path="/*" element={<ErrorPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
