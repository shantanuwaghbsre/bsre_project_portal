import './App.css'
import ResidentialQuotation from './Components/ResidentialQuotation/ResidentialQuotation'
import Navbar from './Components/Navbar/Navbar'
import {  BrowserRouter,  Routes,  Route,} from "react-router-dom";
import ViewQuotations from './Components/ViewQuotations/ViewQuotations';
import CustomerOnboarding from './Components/CustomerOnboarding/CustomerOnboarding';
import CommercialOrIndustrialQuotation from './Components/CommercialOrIndustrialQuotation/CommercialOrIndustrialQuotation';


function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* <Route exact path="/" component={} /> */}
        <Route path="/ResidentialQuotation" element={<ResidentialQuotation/>} />
        <Route path="/ViewQuotations" element={<ViewQuotations/>} />
        <Route path="/CustomerOnboarding" element={<CustomerOnboarding/>} />
        <Route path='CommercialOrIndustrialQuotation' element={<CommercialOrIndustrialQuotation/>} />
        {/* <Route path="/faq" component={Faq} /> */}
      </Routes>
    </BrowserRouter>
      {/* {choice.length === 0 && <><FormLabel id="demo-row-radio-buttons-group-label">Type of Quotation</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={(e) => setChoice(e.target.value)}
        value={choice}
      >
        <FormControlLabel value="Residential/Common Meter" control={<Radio />} label="Residential/Common Meter" />
        <FormControlLabel value="Commercial/Industrial" control={<Radio />} label="Commercial/Industrial" />
      </RadioGroup>
      </>}
      {choice === "Residential/Common Meter"&& <Link to="/ResidentialQuotation"/>}
      {choice === "Commercial/Industrial"&&<div>In progress</div>} */}

    </>
  )
}

export default App