import { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, Paper, RadioGroup, FormControlLabel, Radio, Snackbar, Alert, SelectChangeEvent, InputLabel, FormControl, FormLabel, } from "@mui/material"
import axios from 'axios'
import './styles.css'
import Loading from "../Loading/Loading";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlignHorizontalCenter, VerticalAlignCenter, VerticalAlignTop } from "@mui/icons-material";

const CommercialOrIndustrialQuotation = (props: any) => {
   axios.defaults.headers.common['token'] = props.token

   const switchGearAndProtectionOptions = [
      { value: "Eton", text: "Eton" },
      { value: "Havells", text: "Havells" },
      { value: "Snyder", text: "Snyder" },
      { value: "Int", text: "Int" },
   ]

   const solarStructureOptions = [
      { value: "Hot dip galvanized structure" },
      { value: "Single axis GI structure" },
      { value: "Dual axis GI structure" },
      { value: "Aluminium structure" }
   ]

   const quotationTypeOptions = [
      { value: "Commercial", text: "Commercial" },
      { value: "Industrial", text: "Industrial" }
   ]
   const solarModuleOptions = [
      { value: 'SOLAR CITIZEN', text: 'SOLAR CITIZEN' },
      { value: 'BSIT', text: 'BSIT' },
      { value: 'REDREN', text: 'REDREN' },
      { value: 'RAYZON', text: 'RAYZON' },
   ]

   const solarModuleTypeOptions = [
      { value: '', text: '--Choose panel type--', area: 1 },
      { value: 'Poly', text: 'Poly', area: 1.94, pr_ratio: 0.75, efficiency: 0.18 },
      { value: 'Mono Perc', text: 'Mono Perc', area: 2.54, pr_ratio: 0.85, efficiency: 0.22 },
      { value: 'Mono Perc Bifacial', text: 'Mono Perc Bifacial', area: 2.54, pr_ratio: 0.9, efficiency: 0.23 },
      { value: 'Topcon', text: 'Topcon', area: 2.54, pr_ratio: 0.95, efficiency: 0.25 },
   ]


   const solarInverterOptions = [
      { value: '', text: '--Choose an inverter--' },
      { value: "VSOLE", text: 'VSOLE' },
      { value: "Aarusha", text: 'Aarusha' },
      { value: "K SOLAR", text: 'K SOLAR' },
      { value: "BSIT Inverter", text: 'BSIT Inverter' },
   ]
   const LocationOfState = [
      {
         "Id": 1,
         "state": "Gujarat",
      },
      {
         "Id": 2,
         "state": "Maharashtra",
      },
      {
         "Id": 3,
         "state": "Goa",
      },
   ]
   const CityOfState = [
      {
         "Id": 1,
         "state": "Baroda",
      },
      {
         "Id": 2,
         "state": "Ahemdabad",
      },
      {
         "Id": 3,
         "state": "Surat",
      },
   ]
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const date = new Date();
   let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

   const [formData, setFormData] = useState({
      solarModule: "",
      solarModuleType: "",
      solarModuleWattage: 0,
      solarStructure: "",
      totalKiloWatts: 0,
      numberOfPanels: 0,
      solarInverter: "",
      inverterCapacity: 0,
      location: "",
      city: "",
      latitude: 0,
      longitude: 0,
      agentID: "",
      agentName: "",
      customerName: "",
      customerPhoneNumber: "",
      customerAddress: "",
      customerEmail: "",
      quotationType: "",
      solarCableSelect: "Yes",
      switchGearAndProtection: "",
      sprinklerInstallation: "Yes",
   });

   const [opacity_value, setOpacity_value] = useState(1);
   const [calculationData, setCalculationData] = useState({
      ratePerWatt: 0,
      gstPerWatt: 0,
      electricityUnitRate: 0,
      subsidyPerWatt: 0,
      inflationInUnitRate: 2,
      reinvestmentRate: 7,
      loanAmountOnProject: 0,
      interestRateOnLoan: 0,
      loanTerm: 60,
      installmentOfLoanPerMonth: 0,
      anyExtraCostOnAddOnWork: 0,
      gstOnAddOnWork: 0,
      isMeterChargesSelfPaid: false,
      isLoan: false,
      isSubsidy: false
   });

   const handleFormChange = (field: any, value: any) => {
      console.log(field, value);

      setFormData((prevData) => ({
         ...prevData,
         [field]: value
      }));
   };

   const handleCalculationDataChange = (e: React.BaseSyntheticEvent) => {
      if (e.target.name != 'isLoan' && e.target.name != 'isSubsidy' && e.target.name != 'isMeterChargesSelfPaid') {
         e.target.value = e.target.valueAsNumber
         setCalculationData((prevData) => ({
            ...prevData,
            [e.target.name]: parseFloat(e.target.value),
         }));

      }
      else {
         setCalculationData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value === "true" ? true : false
         }));
      }
   }


   const [locationOptions, setLocationOptions] = useState({})
   const [cityOptions, setCityOptions] = useState([])
   const [agentOptions, setAgentOptions] = useState([])
   const [errorMessage, setErrorMessage] = useState([])
   const [successMessage, setSuccessMessage] = useState("")
   const [isFormValid, setIsFormValid] = useState<Boolean>(false)
   const [loading, setLoading] = useState(false)



   const resetForm = () => {
      setFormData({
         solarModule: "",
         solarModuleType: "",
         solarModuleWattage: 0,
         solarStructure: "",
         totalKiloWatts: 0,
         numberOfPanels: 0,
         solarInverter: "",
         inverterCapacity: 0,
         location: "",
         city: "",
         latitude: 0,
         longitude: 0,
         agentID: "",
         agentName: "",
         customerName: "",
         customerPhoneNumber: "",
         customerAddress: "",
         customerEmail: "",
         quotationType: "",
         solarCableSelect: "Yes",
         switchGearAndProtection: "",
         sprinklerInstallation: "Yes",
      });

      setCalculationData({
         ratePerWatt: 0,
         gstPerWatt: 0,
         electricityUnitRate: 0,
         subsidyPerWatt: 0,
         inflationInUnitRate: 2,
         reinvestmentRate: 7,
         loanAmountOnProject: 0,
         interestRateOnLoan: 0,
         loanTerm: 60,
         installmentOfLoanPerMonth: 0,
         anyExtraCostOnAddOnWork: 0,
         gstOnAddOnWork: 0,
         isMeterChargesSelfPaid: false,
         isLoan: false,
         isSubsidy: false
      })
      setErrorMessage([]);
      setIsFormValid(false);
   };

   useEffect(() => {
      if (formData["city"]) {
         console.log("latitude", locationOptions[formData["location"]][formData["city"]]["latitude"],
            "longitude", locationOptions[formData["location"]][formData["city"]]["longitude"])
         handleFormChange("latitude", locationOptions[formData["location"]][formData["city"]]["latitude"]);
         handleFormChange("longitude", locationOptions[formData["location"]][formData["city"]]["longitude"]);
      }
   }, [formData["city"]]);

   useEffect(() => {
      if (errorMessage.length > 0) {
         toast.error(<div>Please fill the required fields.<br />{errorMessage.map((error) => <li style={{ textAlign: "left" }}>{error}</li>)}<br /></div>, { position: "top-right", autoClose: false, theme: "colored", hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
      }
   }, [errorMessage]);

   const validateAndCalculate = () => {
      let isFormValid_ = false;
      isFormValid_ = true;
      let errorMessage_ = []
      if (!formData["agentID"]) {
         errorMessage_.push("Agent ID number required");
      }
      if (!formData["customerName"] || !formData["customerPhoneNumber"] || !formData["customerAddress"] || !formData["customerEmail"]) {
         errorMessage_.push("Customer details required");
      }
      if (formData["customerPhoneNumber"].length != 10) {
         errorMessage_.push("Phone number invalid");
      }
      if (!emailRegex.test(formData["customerEmail"])) {
         errorMessage_.push("email address");
      }
      if (!formData["solarModule"]) {
         errorMessage_.push("solar module.");
      }
      if (!formData["solarModuleType"]) {
         errorMessage_.push("solar module type.");
      }
      if (!formData["solarInverter"]) {
         errorMessage_.push("solar inverter.");
      }
      if (!formData["inverterCapacity"]) {
         errorMessage_.push("Inverter capacity cannot be empty.");
      }
      if (!formData["solarStructure"]) {
         errorMessage_.push("solar structure.");
      }
      if (!formData["switchGearAndProtection"]) {
         errorMessage_.push("Switch Gear And Protection.");
      }
      if (isNaN(calculationData["ratePerWatt"])) {
         errorMessage_.push("Rate Per Watt must be a number.");
      }
      if (isNaN(calculationData["gstPerWatt"])) {
         errorMessage_.push("GST Per Watt must be a number.");
      }
      if (isNaN(calculationData["electricityUnitRate"])) {
         errorMessage_.push("Electricity Unit Rate must be a number.");
      }
      if (isNaN(calculationData["subsidyPerWatt"])) {
         errorMessage_.push("Subsidy Per Watt must be a number.");
      }
      if (isNaN(calculationData["inflationInUnitRate"])) {
         errorMessage_.push("Inflation In Unit Rate must be a number.");
      }
      if (isNaN(calculationData["reinvestmentRate"])) {
         errorMessage_.push("Reinvestment Rate must be a number.");
      }
      if (isNaN(calculationData["loanAmountOnProject"])) {
         errorMessage_.push("Loan Amount On Project must be a number.");
      }
      if (isNaN(calculationData["interestRateOnLoan"])) {
         errorMessage_.push("Interest Rate On Loan must be a number.");
      }
      if (isNaN(calculationData["loanTerm"])) {
         errorMessage_.push("Loan Term must be a number.");
      }
      if (isNaN(calculationData["installmentOfLoanPerMonth"])) {
         errorMessage_.push("Installment Of Loan Per Month must be a number.");
      }
      if (isNaN(calculationData["anyExtraCostOnAddOnWork"])) {
         errorMessage_.push("Extra Cost On Add On Work must be a number.");
      }
      if (isNaN(calculationData["gstOnAddOnWork"])) {
         errorMessage_.push("GST On Add On Work must be a number.");
      }
      if (!errorMessage_.length) {
         isFormValid_ = true;
      }
      else {
         setErrorMessage(errorMessage_);
      }
      setIsFormValid(isFormValid_);
   }

   const handleClose = () => {
      setErrorMessage([]);
      setSuccessMessage("");
      setIsFormValid(false);
   }

   useEffect(() => {
      handleFormChange("totalKiloWatts", formData["numberOfPanels"] * formData["solarModuleWattage"] / 1000);
   }, [formData["numberOfPanels"], formData["solarModuleWattage"]]);


   useEffect(() => {
      setCityOptions(CityOfState);
   }, [])
   useEffect(() => {
      console.log(urls);

      axios.get(urls["getAgentsURL"])
         .then(function (response) {
            setAgentOptions(response.data);
         })
         .catch(function (error) {
            console.log(error);
         });
      axios.get(urls["getLocationsURL"])
         .then(function (response) {
            setLocationOptions(response.data);
         })
   }, [])

   useEffect(() => {
      setIsFormValid(false);
   }, [formData, calculationData])

   const urls = {
      // "calculateURL": import.meta.env.VITE_BACKEND_URL + "/calculate",
      // "dummyURL": import.meta.env.VITE_BACKEND_URL + "/dummyAPI",
      "submitURL": import.meta.env.VITE_BACKEND_URL + "/submitIndustrialCommercialQuotation",
      "getAgentsURL": import.meta.env.VITE_BACKEND_URL + "/getAgents",
      "getLocationsURL": import.meta.env.VITE_BACKEND_URL + "/getLocations"
   }

   const handleSubmit = () => {
      setLoading(true);
      setOpacity_value(0.3);
      // const postObject = {
      //    "location": formData.location,
      //    "city": formData.city,
      //    "quotation_type": formData.quotationType,
      //    "agent_code": formData.agentID,
      //    "agent_name": formData.agentName,
      //    "consumer_name": formData.customerName,
      //    "consumer_address": formData.customerAddress,
      //    "consumer_mobile_number": formData.customerPhoneNumber,
      //    "consumer_email": formData.customerEmail,
      //    "solar_module_name": formData.solarModule,
      //    "solar_panel_type": formData.solarModuleType,
      //    "number_of_panels": formData.numberOfPanels,
      //    "solar_module_wattage": formData.solarModuleWattage,
      //    "solar_structure": formData.solarStructure,
      //    "total_kilowatts": formData.totalKiloWatts,
      //    "solar_inverter_make": formData.solarInverter,
      //    "inverter_capacity": formData.inverterCapacity,
      //    "solar_cable": formData.solarCableSelect,
      //    "switch_and_gear_protection_make": formData.switchGearAndProtection,
      //    "sprinkler_installation": formData.sprinklerInstallation,
      //    "rate_per_watt": calculationData.ratePerWatt,
      //    "gst_per_watt": calculationData.gstPerWatt,
      //    "electricity_unit_rate": calculationData.electricityUnitRate,
      //    "inflation_in_unit_rate": calculationData.inflationInUnitRate,
      //    "is_loan": calculationData.isLoan,
      //    "loan_amount_on_project": calculationData.loanAmountOnProject,
      //    "loan_term": calculationData.loanTerm,
      //    "interest_rate_on_loan": calculationData.interestRateOnLoan,
      //    "reinvestment_rate": calculationData.reinvestmentRate,
      //    "any_extra_cost_on_add_on_work": calculationData.anyExtraCostOnAddOnWork,
      //    "gst_on_add_on_work": calculationData.gstOnAddOnWork,
      //    "is_subsidy": calculationData.isSubsidy,
      //    "subsidy_per_watt": calculationData.subsidyPerWatt,
      // }
      const postObject = {

         "location": "Ahmedabad",
         "city": "Ahmedabad",
         "quotation_type": "Industrial",
         "agent_code": "BHV0001",
         "agent_name": "Grace G. Green",
         "consumer_name": "adarsh h patel",
         "consumer_address": "Baroda,atladara",
         "consumer_mobile_number": "9098987686",
         "consumer_email": "adarsh.patel@bsre.in",
         "solar_module_name": "SOLAR CITIZEN",
         "solar_panel_type": "Mono Perc",
         "number_of_panels": 12,
         "solar_module_wattage": "4",
         "solar_structure": "Hot dip galvanized structure",
         "total_kilowatts": 0.048,
         "solar_inverter_make": "Aarusha",
         "inverter_capacity": 5,
         "solar_cable": "Yes",
         "switch_and_gear_protection_make": "Havells",
         "sprinkler_installation": "Yes",
         "rate_per_watt": 3,
         "gst_per_watt": 5,
         "electricity_unit_rate": 5,
         "inflation_in_unit_rate": 2,
         "is_loan": false,
         "loan_amount_on_project": 0,
         "loan_term": 60,
         "interest_rate_on_loan": 0,
         "reinvestment_rate": 7,
         "any_extra_cost_on_add_on_work": 0,
         "gst_on_add_on_work": 0,
         "is_subsidy": false,
         "subsidy_per_watt": 0

      }
      axios.post(urls["submitURL"], postObject)//Should ['submitURL'] else we can use ['dummyURL']
         .then(function (response) {
            setLoading(false);
            setOpacity_value(1);
            if (response.data.completed) {
               resetForm()
               toast.success("Successfully created Quotation number - " + response.data.quotation_number, { position: "top-center", theme: "colored", autoClose: 2000, hideProgressBar: true });
            }
            else {
               setErrorMessage(prevErrorMessage => [...prevErrorMessage, "Error while creating Quotation"]);
            };
         })
         .catch(function (error) {
            console.log(error);
         });
   }

   const handleAgentSelect = (e: SelectChangeEvent<string>): void => {
      handleFormChange("agentID", e.target.value);
      for (let i = 0; i < agentOptions.length; i++) {
         if (agentOptions[i]["agent_id"] === e.target.value) {
            handleFormChange("agentName", agentOptions[i]["agent_name"]);
         }
      }
   }

   const handleQuotationTypeSelect = (e: SelectChangeEvent<string>): void => {
      handleFormChange("quotationType", e.target.value);
      for (let i = 0; i < quotationTypeOptions.length; i++) {
         if (quotationTypeOptions[i]["text"] === e.target.value) {
            handleFormChange("quotationType", quotationTypeOptions[i]["value"]);
         }
      }
   }
   return (
      <>
         {loading ?
            <div style={{ display: 'flex', borderRadius: '50%', justifyContent: 'center', alignItems: 'center' }}>
               <Loading />
            </div>
            :
            <div className="table-data" style={{ marginTop: "5%", padding: "45px", opacity: opacity_value }} id="quotation">
               <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                     <TableBody>
                        <TableRow>
                           <TableCell>Date:</TableCell>
                           <TableCell colSpan={3}>{currentDate}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Location</TableCell>
                           <TableCell colSpan={3}>
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <InputLabel>Location</InputLabel>
                                 <Select label="Location" value={formData["location"]} MenuProps={{ style: { maxHeight: 300 } }} onChange={(e) => handleFormChange("location", e.target.value)}>
                                    {Object.keys(locationOptions).map((option) => (
                                       <MenuItem key={option} value={option}>
                                          {option}
                                       </MenuItem>
                                    ))}
                                 </Select>
                              </FormControl>
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>City</TableCell>
                           <TableCell>
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <InputLabel>City</InputLabel>
                                 <Select label="City" value={formData["city"]} MenuProps={{ style: { maxHeight: 300 } }} onChange={(e) => handleFormChange("city", e.target.value)} disabled={formData["location"] == ""}>
                                    {Object.keys(locationOptions[formData["location"]] ? locationOptions[formData["location"]] : []).map((option) => (
                                       <MenuItem key={option} value={option}>
                                          {option}
                                       </MenuItem>
                                    ))}

                                 </Select>
                              </FormControl>
                           </TableCell>
                           <TableCell>
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <TextField label="Latitude" value={formData["latitude"]} type="text" name="latitude" onChange={(e) => handleFormChange("latitude", e.target.value)} onWheel={(e) => (e.target as HTMLInputElement).blur()} />
                              </FormControl>
                           </TableCell>
                           <TableCell>
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <TextField label="Longitude" value={formData["longitude"]} type="number" name="longitude" onChange={(e) => handleFormChange("longitude", e.target.value)} onWheel={(e) => (e.target as HTMLInputElement).blur()} />
                              </FormControl>
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Quotation Type</TableCell>
                           <TableCell colSpan={3}>
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <InputLabel>Quotation Type</InputLabel>
                                 <Select label="Quotation Type" value={formData["quotationType"]} onChange={(e) =>
                                    handleQuotationTypeSelect(e)}>
                                    {quotationTypeOptions.map((option) => (
                                       <MenuItem key={option.text} value={option.value}>
                                          {option.text}
                                       </MenuItem>
                                    ))}
                                 </Select>
                              </FormControl>
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Agent ID</TableCell>
                           <TableCell colSpan={3}>
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <InputLabel>Agent ID</InputLabel>
                                 <Select label="AgentID" value={formData["agentID"]} onChange={(e) =>
                                    handleAgentSelect(e)}>
                                    {agentOptions.map((option) => (
                                       <MenuItem key={option["agent_id"]} value={option["agent_id"]}>
                                          {option["agent_id"]}
                                       </MenuItem>
                                    ))}
                                 </Select>
                                 <h3>{formData["agentName"]}</h3>
                              </FormControl>
                           </TableCell>
                        </TableRow>
                        {/* <TableRow>
                           <TableCell>Agent Name</TableCell>
                           <TableCell colSpan={3}>
                              {formData["agentName"]}
                           </TableCell>
                        </TableRow> */}
                        <TableRow>
                           <TableCell>Customer Name:</TableCell>
                           <TableCell colSpan={3}>
                              <TextField type="text" name="Customer Name" value={formData["customerName"]} onChange={(e) =>
                                 handleFormChange("customerName", e.target.value)} />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Address:</TableCell>
                           <TableCell colSpan={3}>
                              <TextField type="text" name="Address" value={formData["customerAddress"]} onChange={(e) =>
                                 handleFormChange("customerAddress", e.target.value)} />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Mobile No.:</TableCell>
                           <TableCell colSpan={3}>
                              <TextField type="text" name="Mobile No." value={formData["customerPhoneNumber"]} onChange={(e) =>
                                 handleFormChange("customerPhoneNumber", e.target.value)} />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Email:</TableCell>
                           <TableCell colSpan={3}>
                              <TextField type="text" name="Email" value={formData["customerEmail"]} onChange={(e) =>
                                 handleFormChange("customerEmail", e.target.value)} />
                           </TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </TableContainer>
               <TableContainer component={Paper}>
                  <Table border={2}>
                     <TableHead>
                        <TableRow>
                           <TableCell>SR. NO.</TableCell>
                           <TableCell>ITEM DESCRIPTION</TableCell>
                           <TableCell>MAKE</TableCell>
                           <TableCell>QUANTITY</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        <TableRow>
                           <TableCell>1</TableCell>
                           <TableCell>Solar Module</TableCell>
                           <TableCell>
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <InputLabel>Solar Module</InputLabel>
                                 <Select label="Solar Module" value={formData["solarModule"]} onChange={(e) =>
                                    handleFormChange("solarModule", e.target.value)}>
                                    <MenuItem>
                                       <em>None</em>
                                    </MenuItem>
                                    {solarModuleOptions.map((option) => (
                                       <MenuItem key={option.value} value={option.value}>
                                          {option.text}
                                       </MenuItem>
                                    ))}
                                 </Select>
                              </FormControl>
                              <br />
                              <br />
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <InputLabel>Solar Module Type</InputLabel>
                                 <Select label="Solar Module Type" value={formData["solarModuleType"]} onChange={(e) =>
                                    handleFormChange("solarModuleType", e.target.value)}>
                                    {solarModuleTypeOptions.map((option) => (
                                       <MenuItem key={option.value} value={option.value}>
                                          {option.text}
                                       </MenuItem>
                                    ))}
                                 </Select>
                              </FormControl>
                           </TableCell>
                           <TableCell>
                              <TextField label="Solar Module Wattage" value={formData["solarModuleWattage"]}
                                 type="text" name="solarModuleWattage" placeholder="Solar Module Wattage"
                                 onChange={(e: React.BaseSyntheticEvent) => {
                                    handleFormChange("solarModuleWattage", isNaN(e.target.value) ? 0 : e.target.value)
                                 }} /> &nbsp; W <br /><br />
                              <TextField label="Number of Panels" value={formData["numberOfPanels"]}
                                 type="number" name="numberOfPanels" placeholder="Enter number of panels"
                                 onChange={(e: React.BaseSyntheticEvent) => {
                                    e.target.value = isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;
                                    handleFormChange("numberOfPanels", isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)
                                 }} />
                              <br />
                              <br />
                              <label>Total Kilowatts - </label>&nbsp;{formData["totalKiloWatts"]} kW
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>2</TableCell>
                           <TableCell>Solar Inverter</TableCell>
                           <TableCell>
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <InputLabel>Solar Inverter</InputLabel>
                                 <Select label="Solar Inverter" value={formData["solarInverter"]} onChange={(e) =>
                                    handleFormChange("solarInverter", e.target.value)}>
                                    {solarInverterOptions.map((option) => (
                                       <MenuItem key={option.value} value={option.value}>
                                          {option.text}
                                       </MenuItem>
                                    ))}
                                 </Select>
                              </FormControl>
                           </TableCell>
                           <TableCell>
                              <TextField label="Inverter Capacity" value={formData["inverterCapacity"]} type="number" name="inverterCapacity" placeholder="Enter capacity of Inverter" onChange={(e: React.BaseSyntheticEvent) => { e.target.value = isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber; handleFormChange("inverterCapacity", isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber) }} />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>3</TableCell>
                           <TableCell>Solar Structure</TableCell>
                           <TableCell colSpan={2}><FormControl sx={{ m: 1, minWidth: 250 }}>
                              <InputLabel>Solar Structure</InputLabel>
                              <Select label="Solar Structure" value={formData["solarStructure"]} onChange={(e) =>
                                 handleFormChange("solarStructure", e.target.value)}>
                                 {solarStructureOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                       {option.value}
                                    </MenuItem>
                                 ))}
                              </Select>
                           </FormControl>
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>4</TableCell>
                           <TableCell>Solar Cable</TableCell>
                           <TableCell>KEI</TableCell>
                           <TableCell>
                              <RadioGroup
                                 row
                                 aria-labelledby="demo-row-radio-buttons-group-label"
                                 name="row-radio-buttons-group"
                                 onChange={(e) =>
                                    handleFormChange("solarCableSelect", e.target.value)}
                                 value={formData["solarCableSelect"]}
                              >
                                 <FormControlLabel value="Yes" control={
                                    <Radio />
                                 } label="Yes" />
                                 <FormControlLabel value="No" control={
                                    <Radio />
                                 } label="No" />
                              </RadioGroup>
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>5</TableCell>
                           <TableCell>Switch Gear and Protection</TableCell>
                           <TableCell colSpan={2}>
                              <FormControl sx={{ m: 1, minWidth: 220 }}>
                                 <InputLabel>Switch Gear & Protection</InputLabel>
                                 <Select label="switchGearAndProtection" value={formData["switchGearAndProtection"]} onChange={(e) =>
                                    handleFormChange("switchGearAndProtection", e.target.value)}>
                                    {switchGearAndProtectionOptions.map((option) => (
                                       <MenuItem key={option.value} value={option.value}>
                                          {option.text}
                                       </MenuItem>
                                    ))}
                                 </Select>
                              </FormControl>
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>6</TableCell>
                           <TableCell>Sprinkler Installation</TableCell>
                           <TableCell></TableCell>
                           <TableCell>
                              <RadioGroup
                                 row
                                 aria-labelledby="demo-row-radio-buttons-group-label"
                                 name="row-radio-buttons-group"
                                 onChange={(e) =>
                                    handleFormChange("sprinklerInstallation", e.target.value)}
                                 value={formData["sprinklerInstallation"]}
                              >
                                 <FormControlLabel value="Yes" control={
                                    <Radio />
                                 } label="Yes" />
                                 <FormControlLabel value="No" control={
                                    <Radio />
                                 } label="No" />
                              </RadioGroup>
                           </TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </TableContainer>
               <br />
               <br />
               <TableContainer>
                  <Table border={2}>
                     <TableHead>
                        <TableRow>
                           <TableCell colSpan={2} align="center">Guarantee and Warranty</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        <TableRow>
                           <TableCell>AMC</TableCell>
                           <TableCell>5 Years</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Solar Panel</TableCell>
                           <TableCell>10 year manufacturing fault guarantee <br /> 25 year generation guarantee</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Grid Tie Inverter</TableCell>
                           <TableCell>5 year Guarantee and warranty</TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </TableContainer>
               <br />
               <br />
               <TableContainer>
                  <Table border={2}>
                     <TableHead>
                        <TableRow>
                           <TableCell colSpan={4} align="center">
                              Calculations {formData["totalKiloWatts"] > 0 && <span>for {formData["totalKiloWatts"]} KiloWatts</span>}
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        <TableRow>
                           <TableCell>Registartion charges</TableCell>
                           <TableCell>
                              ₹15340.00/-
                           </TableCell>
                           <TableCell>Stamp charges</TableCell>
                           <TableCell>
                              ₹660.00/-
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Meter charges</TableCell>
                           <TableCell colSpan={3}>
                              <RadioGroup
                                 row
                                 aria-labelledby="demo-row-radio-buttons-group-label"
                                 name="isMeterChargesSelfPaid"
                                 value={calculationData["isMeterChargesSelfPaid"]}
                                 onChange={handleCalculationDataChange}
                              >
                                 <FormControlLabel value={true} control={
                                    <Radio />
                                 } label="Self Paid" />
                                 <FormControlLabel value={false} control={
                                    <Radio />
                                 } label="Comapny Paid" />
                              </RadioGroup>
                              {!calculationData["isMeterChargesSelfPaid"] &&
                                 <>
                                    ₹15543.00/- <sup>*</sup>(Approximate)
                                 </>
                              }
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Rate per watt</TableCell>
                           <TableCell>
                              <TextField value={calculationData["ratePerWatt"]} type="number" name="ratePerWatt" onChange={handleCalculationDataChange} />
                           </TableCell>
                           <TableCell>GST per watt</TableCell>
                           <TableCell><TextField value={calculationData["gstPerWatt"]} type="number" name="gstPerWatt" onChange={handleCalculationDataChange} />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Total Rate</TableCell>
                           <TableCell colSpan={3}>{(isNaN(Math.round(((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) + Number.EPSILON) * 100) / 100) ? 0 : Math.round(((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
                        </TableRow>

                        <TableRow>
                           <TableCell>Electricity unit rate</TableCell>
                           <TableCell>
                              <TextField value={calculationData["electricityUnitRate"]} type="number" name="electricityUnitRate" onChange={handleCalculationDataChange} />
                           </TableCell>
                           <TableCell>Inflation in unit rate</TableCell>
                           <TableCell>
                              <TextField value={calculationData["inflationInUnitRate"]} type="number" name="inflationInUnitRate" onChange={handleCalculationDataChange} />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Loan</TableCell>
                           <TableCell colSpan={3}>
                              <RadioGroup
                                 row
                                 aria-labelledby="demo-row-radio-buttons-group-label"
                                 name="isLoan"
                                 value={calculationData["isLoan"]}
                                 onChange={handleCalculationDataChange}
                              >
                                 <FormControlLabel value={true} control={
                                    <Radio />
                                 } label="Yes" />
                                 <FormControlLabel value={false} control={
                                    <Radio />
                                 } label="No" />
                              </RadioGroup>
                           </TableCell>
                        </TableRow>
                        {calculationData["isLoan"] && <><TableRow>
                           <TableCell>Loan amount on project </TableCell>
                           <TableCell><TextField value={calculationData["loanAmountOnProject"]} type="number" name="loanAmountOnProject" onChange={handleCalculationDataChange} /></TableCell>
                           <TableCell>Loan term </TableCell>
                           <TableCell><TextField value={calculationData["loanTerm"]} type="number" name="loanTerm" onChange={handleCalculationDataChange} /></TableCell>
                        </TableRow>
                           <TableRow>
                              <TableCell>Interest Rate on loan</TableCell>
                              <TableCell><TextField value={calculationData["interestRateOnLoan"]} type="number" name="interestRateOnLoan" onChange={handleCalculationDataChange} />
                              </TableCell>
                              <TableCell>Installment of Loan per month</TableCell>
                              <TableCell>{(isNaN(Math.round(((calculationData["loanAmountOnProject"] * (1 + (calculationData["interestRateOnLoan"] * calculationData["loanTerm"]) / 1200) / 12) + Number.EPSILON) * 100) / 100) ? 0 : Math.round(((calculationData["loanAmountOnProject"] * (1 + (calculationData["interestRateOnLoan"] * calculationData["loanTerm"]) / 1200) / 12) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
                           </TableRow></>}
                        <TableRow>
                           <TableCell>Total GST</TableCell>
                           <TableCell>{(isNaN(Math.round(((calculationData["gstPerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100) ? 0 : Math.round(((calculationData["gstPerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
                           <TableCell>Reinvestment Rate</TableCell>
                           <TableCell><TextField value={calculationData["reinvestmentRate"]} type="number" name="reinvestmentRate" onChange={handleCalculationDataChange} />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Any extra cost on add-on work</TableCell>
                           <TableCell>
                              <TextField value={calculationData["anyExtraCostOnAddOnWork"]} type="number" name="anyExtraCostOnAddOnWork" onChange={handleCalculationDataChange} />
                           </TableCell>
                           <TableCell>GST on add-on work</TableCell>
                           <TableCell>
                              <TextField value={calculationData["gstOnAddOnWork"]} type="number" name="gstOnAddOnWork" onChange={handleCalculationDataChange} />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Total add-on amount</TableCell>
                           <TableCell colSpan={3}>{(isNaN(Math.round(((calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100) ? 0 : Math.round(((calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Value of project without Gst</TableCell>
                           <TableCell colSpan={3}>
                              {
                                 !calculationData["isMeterChargesSelfPaid"] ?
                                    <>
                                       ₹ {(isNaN(Math.round(((calculationData["ratePerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON + 15340 + 660 + 15543) * 100) / 100) ? 0 : Math.round(((calculationData["ratePerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON + 15340 + 660 + 15543) * 100) / 100).toLocaleString('en-IN')}
                                    </>
                                    :
                                    <>
                                       ₹ {(isNaN(Math.round(((calculationData["ratePerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON + 15340 + 660) * 100) / 100) ? 0 : Math.round(((calculationData["ratePerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON + 15340 + 660) * 100) / 100).toLocaleString('en-IN')}
                                    </>
                              }
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>Value of project with Gst</TableCell>
                           <TableCell colSpan={3}>₹{(isNaN(Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100) ? 0 : Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
                        </TableRow>

                        <TableRow>
                           <TableCell>Final cost of project incl. add-on work</TableCell>
                           <TableCell colSpan={3}>
                              <b className="final-price">
                                 ₹{(isNaN(Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) + (calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100) ? 0 : Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) + (calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}
                              </b>
                           </TableCell>
                        </TableRow>

                        {formData["quotationType"] == "Industrial" && <TableRow>
                           <TableCell>Subsidy</TableCell>
                           <TableCell colSpan={3}>
                              <RadioGroup
                                 row
                                 aria-labelledby="demo-row-radio-buttons-group-label"
                                 name="isSubsidy"
                                 value={calculationData["isSubsidy"]}
                                 onChange={handleCalculationDataChange}
                              >
                                 <FormControlLabel value={true} control={
                                    <Radio />
                                 } label="Yes" />
                                 <FormControlLabel value={false} control={
                                    <Radio />
                                 } label="No" />
                              </RadioGroup>
                           </TableCell>
                        </TableRow>}
                        {(calculationData["isSubsidy"] && formData["quotationType"] == "Industrial") && <><TableRow>
                           <TableCell>Subsidy per watt</TableCell>
                           <TableCell>
                              <TextField value={calculationData["subsidyPerWatt"]} type="number" name="subsidyPerWatt" onChange={handleCalculationDataChange} />
                           </TableCell>
                           <TableCell>Total Subsidy</TableCell>
                           <TableCell colSpan={3}>{(isNaN(Math.round(((calculationData["subsidyPerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100) ? 0 : Math.round(((calculationData["subsidyPerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>

                        </TableRow>
                           <TableRow>
                              <TableCell>Total value of project after subsidy</TableCell>
                              <TableCell colSpan={3}>{(isNaN(Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) - (calculationData["subsidyPerWatt"] * 1000 * formData["totalKiloWatts"]) + (calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100) ? 0 : Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) - (calculationData["subsidyPerWatt"] * 1000 * formData["totalKiloWatts"]) + (calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
                           </TableRow>
                        </>}
                     </TableBody>
                  </Table>
               </TableContainer>
               <br />
               <br />
               <Button variant="contained" onClick={() => resetForm()}>Reset</Button>&nbsp;
               <Button variant="contained" onClick={() => validateAndCalculate()}>Validate and Calculate</Button>&nbsp;
               {isFormValid && <Button variant="contained" onClick={() => handleSubmit()}>Submit</Button>}
            </div>
         }
      </>
   );
};

export default CommercialOrIndustrialQuotation;









