import './App.css'
import ResidentialQuotation from './Components/ResidentialQuotation/ResidentialQuotation'
import Navbar from './Components/Navbar/Navbar'
import {  BrowserRouter,  Routes,  Route,} from "react-router-dom";
import ViewQuotations from './Components/ViewQuotations/ViewQuotations';
import ConsumerOnboarding from './Components/ConsumerOnboarding/ConsumerOnboarding';
import CommercialOrIndustrialQuotation from './Components/CommercialOrIndustrialQuotation/CommercialOrIndustrialQuotation';
import FileDownloader from './Components/Trial/Trial';
import ViewAllConsumers from './Components/ViewAllConsumers/ViewAllConsumers';
import ViewConsumer from './Components/ViewConsumer/ViewConsumer';
import StartProject from './Components/StartProject/StartProject';
import Dashboard from './Components/Dashboard/Dashboard';
import ViewProject from './Components/ViewProject/ViewProject';

function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* <Route exact path="/" component={} /> */}
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