import { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, Paper, RadioGroup, FormControlLabel, Radio, Snackbar, Alert, SelectChangeEvent, InputLabel, FormControl, FormLabel, } from "@mui/material"
import axios from 'axios'
import './styles.css'

const CommercialOrIndustrialQuotation = () => {
  
  const  switchGearAndProtectionOptions = [
    {value: "Eton", text: "Eton"},
    {value: "Havells", text: "Havells"},
    {value: "Snyder", text: "Snyder"},
    {value: "Int", text: "Int"},
  ]

  const solarStructureOptions = [
    {value:"Hot dip galvanized structure"},
    {value:"Single axis GI structure"},
    {value:"Dual axis GI structure"},
    {value:"Aluminium structure"}
  ]

  const quotationTypeOptions = [
    {value: "Commercial", text:"Commercial"},
    {value: "Industrial", text:"Industrial"}
  ]
  const solarModuleOptions = [
    {value: 'SOLAR CITIZEN', text: 'SOLAR CITIZEN'},
    {value: 'BSIT', text: 'BSIT'},
    {value: 'REDREN', text: 'REDREN'},
    {value: 'RAYZON', text: 'RAYZON'},
  ]

  const solarModuleTypeOptions = [
    {value: '', text: '--Choose panel type--', area: 1},
    {value: 'Poly', text: 'Poly' , area: 1.94, pr_ratio:0.75, efficiency: 0.18 },
    {value: 'Mono Perc', text: 'Mono Perc' , area: 2.54, pr_ratio:0.85, efficiency: 0.22 },
    {value: 'Mono Perc Bifacial', text: 'Mono Perc Bifacial', area: 2.54, pr_ratio: 0.9, efficiency: 0.23},
    {value: 'Topcon', text: 'Topcon' , area: 2.54, pr_ratio: 0.95, efficiency: 0.25 },
  ]


  const solarInverterOptions = [
    {value: '', text: '--Choose an inverter--'},
    {value: "VSOLE", text: 'VSOLE'},
    {value: "Aarusha", text: 'Aarusha'},
    {value: "K SOLAR", text: 'K SOLAR'},
    {value: "BSIT Inverter", text: 'BSIT Inverter'},
      ]

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const date = new Date();
  let currentDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;

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
    isLoan: false,
    isSubsidy: false
  });

  const handleFormChange = (field:any, value:any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleCalculationDataChange = (e:React.BaseSyntheticEvent) => {
   if (e.target.name != 'isLoan' && e.target.name != 'isSubsidy') {
      e.target.value = e.target.valueAsNumber
      setCalculationData((prevData) => ({
         ...prevData,
         [e.target.name]: parseFloat(e.target.value)
      }));   
   }
   else {
      setCalculationData((prevData) => ({
         ...prevData,
         [e.target.name]: e.target.value === "true"?true:false
      }));
   }
  }

  const [agentOptions, setAgentOptions] = useState([])
  const [locationOptions, setLocationOptions] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isFormValid, setIsFormValid] = useState<Boolean>(false)

  
  
  
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
      isLoan: false,
      isSubsidy: false
    })
    setErrorMessage("");
    setIsFormValid(false);
  };
  
  const validateAndCalculate = () => {
    let isFormValid_ = false
    if (!formData["agentID"]) {
      setErrorMessage("Agent ID number required")
    }
    else if (!formData["customerName"] || !formData["customerPhoneNumber"] || !formData["customerAddress"] || !formData["customerEmail"]) {
      setErrorMessage("Customer details required")
    }
    else if (formData["customerPhoneNumber"].length != 10) {
      setErrorMessage("Phone number invalid")
    }
    else if (!emailRegex.test(formData["customerEmail"])) {
      setErrorMessage("Please enter a valid email address")
    }
    else if (!formData["solarModule"]) {
      setErrorMessage("Please select a solar module.");
    }
    else if (!formData["solarModuleType"]) {
      setErrorMessage("Please select a solar module type.");
    }
    else if (!formData["solarInverter"]) {
      setErrorMessage("Please select a solar inverter.");
    }
    else if (!formData["inverterCapacity"]) {
       setErrorMessage("Inverter capacity cannot be empty.");
    }
    else if (!formData["solarStructure"]) {
      setErrorMessage("Please select a solar structure.");
    }
    else if (!formData["switchGearAndProtection"]) {
      setErrorMessage("Please select a Switch Gear And Protection.");
    }
    else if (isNaN(calculationData["ratePerWatt"])) {
      setErrorMessage("Rate Per Watt must be a number.");
   }
   else if (isNaN(calculationData["gstPerWatt"])) {
         setErrorMessage("GST Per Watt must be a number.");
   }
   else if (isNaN(calculationData["electricityUnitRate"])) {
         setErrorMessage("Electricity Unit Rate must be a number.");
   }
   else if (isNaN(calculationData["subsidyPerWatt"])) {
         setErrorMessage("Subsidy Per Watt must be a number.");
   }
   else if (isNaN(calculationData["inflationInUnitRate"])) {
         setErrorMessage("Inflation In Unit Rate must be a number.");
   }
   else if (isNaN(calculationData["reinvestmentRate"])) {
         setErrorMessage("Reinvestment Rate must be a number.");
   }
   else if (isNaN(calculationData["loanAmountOnProject"])) {
         setErrorMessage("Loan Amount On Project must be a number.");
   }
   else if (isNaN(calculationData["interestRateOnLoan"])) {
         setErrorMessage("Interest Rate On Loan must be a number.");
   }
   else if (isNaN(calculationData["loanTerm"])) {
         setErrorMessage("Loan Term must be a number.");
   }
   else if (isNaN(calculationData["installmentOfLoanPerMonth"])) {
         setErrorMessage("Installment Of Loan Per Month must be a number.");
   }
   else if (isNaN(calculationData["anyExtraCostOnAddOnWork"])) {
         setErrorMessage("Extra Cost On Add On Work must be a number.");
   }
   else if (isNaN(calculationData["gstOnAddOnWork"])) {
         setErrorMessage("GST On Add On Work must be a number.");
   }
    else {
      isFormValid_ = true;
    }  
    setIsFormValid(isFormValid_);
  }
  
  const handleClose = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsFormValid(false);
  }

  useEffect(() => {
    handleFormChange("totalKiloWatts", formData["numberOfPanels"]*formData["solarModuleWattage"]/1000);
  }, [formData["numberOfPanels"], formData["solarModuleWattage"]]); 
  
  useEffect(() => {
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


//   const urls = {
//     "calculateURL": "http://localhost:5000/calculate",
//     "submitURL": "http://localhost:5000/submitIndustrialCommercialQuotation",
//     "getAgentsURL": "http://localhost:5000/getAgents",
//     "getLocationsURL": "http://localhost:5000/getLocations"
//   }

const urls = {
   "calculateURL": "http://192.168.29.62:5000/calculate",
   "submitURL": "http://192.168.29.62:5000/submitIndustrialCommercialQuotation",
   "getAgentsURL": "http://192.168.29.62:5000/getAgents",
   "getLocationsURL": "http://192.168.29.62:5000/getLocations"
 }

  const handleSubmit = () => {

   const postObject = {
      "location" : formData.location,
      "quotation_type" : formData.quotationType,
      "agent_code" : formData.agentID,
      "agent_name" : formData.agentName,
      "consumer_name" : formData.customerName,
      "consumer_address" : formData.customerAddress,
      "consumer_mobile_number" : formData.customerPhoneNumber,
      "consumer_email" : formData.customerEmail,
      "solar_module_name" : formData.solarModule,
      "solar_panel_type" : formData.solarModuleType,
      "number_of_panels" : formData.numberOfPanels,
      "solar_module_wattage" : formData.solarModuleWattage,
      "solar_structure": formData.solarStructure,
      "total_kilowatts" : formData.totalKiloWatts,
      "solar_inverter_make" : formData.solarInverter,
      "inverter_capacity": formData.inverterCapacity,
      "solar_cable" : formData.solarCableSelect,
      "switch_and_gear_protection_make" : formData.switchGearAndProtection,
      "sprinkler_installation" : formData.sprinklerInstallation,
      "rate_per_watt" : calculationData.ratePerWatt,
      "gst_per_watt" : calculationData.gstPerWatt,
      "electricity_unit_rate" : calculationData.electricityUnitRate,
      "inflation_in_unit_rate" : calculationData.inflationInUnitRate,
      "is_loan" : calculationData.isLoan,
      "loan_amount_on_project" : calculationData.loanAmountOnProject,
      "loan_term" : calculationData.loanTerm,
      "interest_rate_on_loan" : calculationData.interestRateOnLoan,
      "reinvestment_rate" : calculationData.reinvestmentRate,
      "any_extra_cost_on_add_on_work" : calculationData.anyExtraCostOnAddOnWork,
      "gst_on_add_on_work" : calculationData.gstOnAddOnWork,
      "is_subsidy" : calculationData.isSubsidy,
      "subsidy_per_watt" : calculationData.subsidyPerWatt,
   }

    axios.post(urls["submitURL"], postObject)
      .then(function (response) {
        if (response.data.completed) {
          resetForm()
          setSuccessMessage("Successfully created Quotation number - " + response.data.quotation_number);
        }
        else {
          setErrorMessage("Error while creating Quotation");
        };
      })
      .catch(function (error) {
        console.log(error);
      });
}
  
  const handleAgentSelect = (e: SelectChangeEvent<string>): void => {
    handleFormChange("agentID", e.target.value);
    for (let i = 0; i <agentOptions.length; i++) {
      if (agentOptions[i]["agent_id"] === e.target.value) {
        handleFormChange("agentName", agentOptions[i]["agent_name"]);
      }
    }
  }



  const handleLocationSelect = (e: SelectChangeEvent<string>): void => {
   handleFormChange("location", e.target.value);
   for (let i = 0; i <locationOptions.length; i++) {
     if (locationOptions[i]["city"] === e.target.value) {
       handleFormChange("location", locationOptions[i]["city"]);
     }
   }
 }

  const handleQuotationTypeSelect = (e: SelectChangeEvent<string>): void => {
    handleFormChange("quotationType", e.target.value);
    for (let i = 0; i <quotationTypeOptions.length; i++) {
      if (quotationTypeOptions[i]["text"] === e.target.value) {
        handleFormChange("quotationType", quotationTypeOptions[i]["value"]);
      }
    }
  }


  return (
   
    <div style={{paddingTop:64}}>
    {<Snackbar open={!isFormValid && errorMessage.length > 0} autoHideDuration={10000} onClose={() => handleClose()}>
    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    {errorMessage}
    </Alert>
    </Snackbar>}
    {
    <Snackbar open={successMessage.length > 0} autoHideDuration={10000} onClose={() => handleClose()}>
       <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
       {successMessage}
       </Alert>
    </Snackbar>
    }
    <TableContainer component={Paper}>
       <Table aria-label="simple table">
          <TableBody>
             <TableRow>
                <TableCell>Date:</TableCell>
                <TableCell>{currentDate}</TableCell>
             </TableRow>
             <TableRow>
             <TableCell>Location</TableCell>
             <TableCell>
               <FormControl sx={{ m: 1, minWidth: 220 }}>
                   <InputLabel>Location</InputLabel>
                   <Select label="Location" value={formData["location"]} MenuProps={{style: {maxHeight: 300}}} onChange={(e) =>
                      handleLocationSelect(e)}>
                      {locationOptions.map((option) => (
                      <MenuItem key={option["city"]} value={option["city"]}>
                         {option["city"]}
                      </MenuItem>
                      ))}
                   </Select>
                   </FormControl>
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Quotation Type</TableCell>
                <TableCell>
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
                <TableCell>
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
                   </FormControl>
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Agent Name</TableCell>
                <TableCell>
                   {formData["agentName"]}
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Customer Name:</TableCell>
                <TableCell>
                   <TextField type="text" name="Customer Name" value={formData["customerName"]} onChange={(e) =>
                   handleFormChange("customerName", e.target.value)} />
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Address:</TableCell>
                <TableCell>
                   <TextField type="text" name="Address" value={formData["customerAddress"]} onChange={(e) =>
                   handleFormChange("customerAddress", e.target.value)} />
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Mobile No.:</TableCell>
                <TableCell>
                   <TextField type="text" name="Mobile No." value={formData["customerPhoneNumber"]} onChange={(e) =>
                   handleFormChange("customerPhoneNumber", e.target.value)} />
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Email:</TableCell>
                <TableCell>
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
                   <br/>
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
                   type="number" name="solarModuleWattage" placeholder="Solar Module Wattage" 
                   onChange={(e:React.BaseSyntheticEvent) => {e.target.value = isNaN(e.target.valueAsNumber)?0:e.target.valueAsNumber; 
                     handleFormChange("solarModuleWattage", isNaN(e.target.valueAsNumber)?0:e.target.valueAsNumber)}}/> &nbsp; W <br/><br/>
                   <TextField label="Number of Panels" value={formData["numberOfPanels"]} 
                   type="number" name="numberOfPanels" placeholder="Enter number of panels" 
                   onChange={(e:React.BaseSyntheticEvent) => {e.target.value = isNaN(e.target.valueAsNumber)?0:e.target.valueAsNumber; 
                   handleFormChange("numberOfPanels", isNaN(e.target.valueAsNumber)?0:e.target.valueAsNumber)}}/>
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
                   <TextField  label="Inverter Capacity" value={formData["inverterCapacity"]} type="number" name="inverterCapacity" placeholder="Enter capacity of Inverter" onChange={(e:React.BaseSyntheticEvent) => {e.target.value = isNaN(e.target.valueAsNumber)?0:e.target.valueAsNumber; handleFormChange("inverterCapacity", isNaN(e.target.valueAsNumber)?0:e.target.valueAsNumber)}} />
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
                <TableCell>10 year manufacturing fault guarantee <br/> 25 year generation guarantee</TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Grid Tie Inverter</TableCell>
                <TableCell>5 year Guarantee and warranty</TableCell>
             </TableRow>
          </TableBody>
       </Table>
    </TableContainer>
    <br/>
    <br/>         
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
                <TableCell>Rate per watt</TableCell>
                <TableCell>
                <TextField value={calculationData["ratePerWatt"]} type="number" name="ratePerWatt" onChange={handleCalculationDataChange}/>
                </TableCell>
                <TableCell>GST per watt</TableCell>
                <TableCell><TextField value={calculationData["gstPerWatt"]} type="number" name="gstPerWatt" onChange={handleCalculationDataChange}/>
                   </TableCell>
               </TableRow>
             <TableRow>
              <TableCell>Total Rate</TableCell>
              <TableCell colSpan={3}>{(isNaN(Math.round(((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) + Number.EPSILON) * 100) / 100)?0:Math.round(((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
              </TableRow>
          
          <TableRow>
                <TableCell>Electricity unit rate</TableCell>
                <TableCell>
                  <TextField value={calculationData["electricityUnitRate"]} type="number" name="electricityUnitRate" onChange={handleCalculationDataChange}/>
                   </TableCell>
                <TableCell>Inflation in unit rate</TableCell>
                <TableCell>
                <TextField value={calculationData["inflationInUnitRate"]} type="number" name="inflationInUnitRate" onChange={handleCalculationDataChange}/>
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
                <TableCell><TextField value={calculationData["loanAmountOnProject"]} type="number" name="loanAmountOnProject" onChange={handleCalculationDataChange}/></TableCell>
                <TableCell>Loan term </TableCell>
                <TableCell><TextField value={calculationData["loanTerm"]} type="number" name="loanTerm" onChange={handleCalculationDataChange}/></TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Interest Rate on loan</TableCell>
                <TableCell><TextField value={calculationData["interestRateOnLoan"]} type="number" name="interestRateOnLoan" onChange={handleCalculationDataChange}/>
                </TableCell>
                <TableCell>Installment of Loan per month</TableCell>
                <TableCell>{(isNaN(Math.round(((calculationData["loanAmountOnProject"]*(1+(calculationData["interestRateOnLoan"]*calculationData["loanTerm"])/1200)/12) + Number.EPSILON) * 100) / 100)?0:Math.round(((calculationData["loanAmountOnProject"]*(1+(calculationData["interestRateOnLoan"]*calculationData["loanTerm"])/1200)/12) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
             </TableRow></>}
             <TableRow>
                <TableCell>Total GST</TableCell>
                <TableCell>{(isNaN(Math.round(((calculationData["gstPerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100)?0:Math.round(((calculationData["gstPerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
                <TableCell>Reinvestment Rate</TableCell>
                <TableCell><TextField value={calculationData["reinvestmentRate"]} type="number" name="reinvestmentRate" onChange={handleCalculationDataChange}/>
                  </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Any extra cost on add-on work</TableCell>
                <TableCell>
                <TextField value={calculationData["anyExtraCostOnAddOnWork"]} type="number" name="anyExtraCostOnAddOnWork" onChange={handleCalculationDataChange}/>
                </TableCell>
                <TableCell>GST on add-on work</TableCell>
                <TableCell>
                <TextField value={calculationData["gstOnAddOnWork"]} type="number" name="gstOnAddOnWork" onChange={handleCalculationDataChange}/>
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Total add-on amount</TableCell>
                <TableCell colSpan={3}>{(isNaN(Math.round(((calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) /100)?0:Math.round(((calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) /100).toLocaleString('en-IN')}</TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Value of project without Gst</TableCell>
                <TableCell colSpan={3}>{(isNaN(Math.round(((calculationData["ratePerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100)?0:Math.round(((calculationData["ratePerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Value of project with Gst</TableCell>
                <TableCell colSpan={3}>{(isNaN(Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100)?0:Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
             </TableRow>
             
             <TableRow>
                <TableCell>Final cost of project incl. add-on work</TableCell>
                <TableCell colSpan={3}>{(isNaN(Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"])  + (calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100)?0:Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) + (calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
             </TableRow>
             
             {formData["quotationType"]=="Industrial" && <TableRow>
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
             {(calculationData["isSubsidy"] && formData["quotationType"]=="Industrial") && <><TableRow>
             <TableCell>Subsidy per watt</TableCell>
                <TableCell>
                <TextField value={calculationData["subsidyPerWatt"]} type="number" name="subsidyPerWatt" onChange={handleCalculationDataChange} />
                </TableCell>
                <TableCell>Total Subsidy</TableCell>
              <TableCell colSpan={3}>{(isNaN(Math.round(((calculationData["subsidyPerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100)?0:Math.round(((calculationData["subsidyPerWatt"] * 1000 * formData["totalKiloWatts"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
              
             </TableRow>
             <TableRow>
                <TableCell>Total value of project after subsidy</TableCell>
                <TableCell colSpan={3}>{(isNaN(Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) - (calculationData["subsidyPerWatt"] * 1000 * formData["totalKiloWatts"]) + (calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100)?0:Math.round((((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * 1000 * formData["totalKiloWatts"]) - (calculationData["subsidyPerWatt"] * 1000 * formData["totalKiloWatts"]) + (calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN')}</TableCell>
             </TableRow></>}
             {/* <TableRow>
                <TableCell></TableCell>
                <TableCell colSpan={3}>{calculationData[""]}</TableCell>
             </TableRow>
             <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
             </TableRow> */}
          </TableBody>
       </Table>
    </TableContainer>
    <br/>
    <br/>
    <Button variant="contained" onClick={() => resetForm()}>Reset</Button>&nbsp;
    <Button variant="contained" onClick={() => validateAndCalculate()}>Validate and Calculate</Button>&nbsp;
    {isFormValid && <Button variant="contained" onClick={() => handleSubmit()}>Submit</Button>}
 </div>

  );
};

export default CommercialOrIndustrialQuotation;









