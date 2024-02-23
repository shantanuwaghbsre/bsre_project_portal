import './App.css'
import ResidentialQuotation from './Components/ResidentialQuotation/ResidentialQuotation'
import Navbar from './Components/Navbar/Navbar'
import {  BrowserRouter,  Routes,  Route, useLocation  } from "react-router-dom";
import ViewQuotations from './Components/ViewQuotations/ViewQuotations';
import ConsumerOnboarding from './Components/ConsumerOnboarding/ConsumerOnboarding';
import CommercialOrIndustrialQuotation from './Components/CommercialOrIndustrialQuotation/CommercialOrIndustrialQuotation';
import FileDownloader from './Components/Trial/Trial';
import ViewAllConsumers from './Components/ViewAllConsumers/ViewAllConsumers';
import ViewConsumer from './Components/ViewConsumer/ViewConsumer';
import StartProject from './Components/StartProject/StartProject';
import Dashboard from './Components/Dashboard/Dashboard';
import ViewProject from './Components/ViewProject/ViewProject';
import { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

let initOptions = {
  url: 'http://localhost:8080/',
  realm: 'myrealm',
  clientId: 'a_client',
}

const App = () => {
  const [kc, setKc] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

const CustomHistoryWrapper = () => {

    const location = useLocation();
  
    useEffect(() => {
      // Modify the location object here
      console.log(location.pathname);
      console.log(isAuthenticated)
    }, [location]);
  
    return null;
  };

  useEffect(() => {
    const initializeKeycloak = async () => {
      const keycloak = new Keycloak({
        clientId: initOptions.clientId,
        realm: initOptions.realm,
        url: initOptions.url,
      });
      await keycloak.init({ onLoad: 'login-required', pkceMethod: "S256", redirectUri: 'http://localhost:5173/Dashboard', responseMode: 'query', }).then(
        () => {
          console.log("keycloak")
          console.log(keycloak)
          setKc(keycloak);
          
          const isAuthenticated = keycloak.authenticated;
          setIsAuthenticated(isAuthenticated);
        },
        (error) => {
          console.error('Failed to initialize Keycloak:', error);
        }
      )
    };
  
    initializeKeycloak();
  }, []);

  const handleLogout = () => {
    if (kc) {
      kc.logout();
    }
  };

  return (
    <>
      <BrowserRouter>
      <CustomHistoryWrapper/>
        {isAuthenticated && (
          <Navbar kc={kc} logout={handleLogout} />
        )}
        <Routes>
          {isAuthenticated && (
            <>
            <Route path="/ResidentialQuotation" element={<ResidentialQuotation/>} />
            <Route path="/ViewQuotations" element={<ViewQuotations/>} />
            <Route path="/ConsumerOnboarding" element={<ConsumerOnboarding/>} />
            <Route path='/CommercialOrIndustrialQuotation' element={<CommercialOrIndustrialQuotation/>} />
            <Route path='/ViewAllConsumers' element={<ViewAllConsumers/>} />
            <Route path='/ViewConsumer' element={<ViewConsumer/>} />
            <Route path='/StartProject' element={<StartProject/>} />
            <Route path="/contact" element={<FileDownloader/>} />
            <Route path="/" element={<Dashboard/>} />
            <Route path="/Dashboard" element={<Dashboard/>} />
            <Route path="/ViewProject" element={<ViewProject/>} />

            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;       