import { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, Paper, FormLabel, RadioGroup, FormControlLabel, Radio, Snackbar, Alert, SelectChangeEvent, InputLabel, FormHelperText, FormControl, } from "@mui/material"
import axios from 'axios'
import './styles.css'
import { BorderClear, Label } from "@mui/icons-material";

const CommercialOrIndustrialQuotation = () => {
  
  const  switchGearAndProtectionOptions = [
    {value: "Eton", text: "Eton"},
    {value: "Havells", text: "Havells"},
    {value: "Snyder", text: "Snyder"},
    {value: "Int", text: "Int"},
  ]

  const solarStructureOptions = [
    {value:"Hot dip galvanized structure", type: "Hot dip galvanized structure"},
    {value:"Single axis GI structure", type: "Single axis GI structure"},
    {value:"Dual axis GI structure", type: "Dual axis GI structure"},
    {value:"Aluminium structure", type: "Aluminium structure"}
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
    {value: '', text: '--Choose panel type--'},
    {value: 'Poly', text: 'Poly'},
    {value: 'Mono Perc', text: 'Mono Perc'},
    {value: 'Mono Perc Bifacial', text: 'Mono Perc Bifacial'},
    {value: 'Topcon', text: 'Topcon'},
  ]


  const solarInverterOptions = [
    {value: '', text: '--Choose an inverter--'},
    {value: "VSOLE", text: 'VSOLE'},
    {value: "Aarusha", text: 'Aarusha'},
    {value: "K SOLAR", text: 'K SOLAR'},
    {value: "BSIT Inverter", text: 'BSIT Inverter'},
      ]

  const gridTieInverterOptions = [
    {value: "Aarusha", text: 'Aarusha'},
    {value: "K SOLAR", text: 'K SOLAR'},
    {value: "Power One", text: 'Power One'},
    {value : "Sun Grow", text: 'Sun Grow'},
    {value : "Grow watt", text: 'Grow watt'},
  ]

  const installmentAcMcbSwitchChargeOptions = [
    {value:500, text:"500"},
    {value:1000, text:"1,000"},
  ]

  const gebAgreementFeesOptions = [
    {value:300, text:"300"},
    {value:600, text:"600"},
  ]

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const date = new Date();
  let currentDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;

  const [formData, setFormData] = useState({
    solarModule: "",
    solarModuleType: "",
    solarModuleWattage: 0,
    totalKiloWatts: 0,
    numberOfPanels: 0,
    solarInverter: "",
    moduleMountingStructureMake: "Apollo 2.0 MM structure (Hot Deep GI 80 Micron)",
    moduleMountingStructureDescription: "As Per Site Condition",
    moduleMountingStructureQuantity: "As Per Site",
    stateOrTerritory: "Gujarat",
    agentID: "",
    agentName: "",
    customerName: "",
    customerPhoneNumber: "",
    customerAddress: "",
    structure: "",
    calculatedSubsidy: 0,
    calculatedGUVNLAmount: 0,
    discomOrTorrent: "DISCOM",
    phase: "Single",
    calculatedDISCOMCharges: 0,
    installmentAcMcbSwitchCharge: 500,
    gebAgreementFees: 300,
    projectCost: 0,
    customerEmail: "",
    quotationType: "",
    numberOfInverters: 0,
    gridTieInverter: "",
    numberOfGridTieInverters: 0,
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
    isLoan: false
  });

  const handleFormChange = (field:any, value:any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleCalculationDataChange = (field:any, value:any) => {
   setCalculationData((prevData) => ({
      ...prevData,
      [field]: value
   }));   
  }

  const [agentOptions, setAgentOptions] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isFormValid, setIsFormValid] = useState<Boolean>(false)

  
  
  
  const resetForm = () => {
    setFormData({
      solarModule: "",
      solarModuleType: "",
      solarModuleWattage: 0,
      totalKiloWatts: 0,
      numberOfPanels: 0,
      solarInverter: "",
      moduleMountingStructureMake: "Apollo 2.0 MM structure (Hot Deep GI 80 Micron)",
      moduleMountingStructureDescription: "As Per Site Condition",
      moduleMountingStructureQuantity: "As Per Site",
      stateOrTerritory: "Gujarat",
      agentID: "",
      agentName: "",
      customerName: "",
      customerPhoneNumber: "",
      customerAddress: "",
      structure: "",
      calculatedSubsidy: 0,
      calculatedGUVNLAmount: 0,
      discomOrTorrent: "DISCOM",
      phase: "Single",
      calculatedDISCOMCharges: 0,
      installmentAcMcbSwitchCharge: 500,
      gebAgreementFees: 300,
      projectCost: 0,
      customerEmail: "",
      quotationType: "",
      numberOfInverters: 0,
      numberOfGridTieInverters: 0,
      gridTieInverter: "",
      solarCableSelect: "Yes",
      switchGearAndProtection: "",
      sprinklerInstallation: "",

    });
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
    else if (formData["numberOfPanels"]<4 || formData["numberOfPanels"]==7 || formData["numberOfPanels"]==12 || formData["numberOfPanels"]==14 || formData["numberOfPanels"]==16 || formData["numberOfPanels"]==17 || formData["numberOfPanels"]>18) {
      setErrorMessage("Please select correct number of panels.");
    }
    else if (!formData["solarInverter"]) {
      setErrorMessage("Please select a solar inverter.");
    }
    else if (!formData["moduleMountingStructureMake"]) {
      setErrorMessage("Module mounting structure make cannot be empty.");
    }
    else if (!formData["moduleMountingStructureDescription"]) {
      setErrorMessage("Module mounting structure description cannot be empty.");
    }
    else if (!formData["moduleMountingStructureQuantity"]) {
      setErrorMessage("Module mounting structure quantity cannot be empty.");
    }
    else if (!formData["structure"]) {
      setErrorMessage("Please enter Structure value.");
    }
    else if (!formData["discomOrTorrent"]) {
      setErrorMessage("Please select discom or torrent.");
    }
    else if (formData["discomOrTorrent"] === "Torrent" && !formData["phase"]) {
      setErrorMessage("Please select phase.");
    }
    else {
      isFormValid_ = true;
    }  
    setIsFormValid(isFormValid_);
  }
  
  const handleClose = () => {
    setErrorMessage("")
    setSuccessMessage("")
    setIsFormValid(false)
  }

  useEffect(() => {
    if (isFormValid) {
      const postObject = {
        totalKiloWatts: formData["totalKiloWatts"],
        numberOfPanels: formData["numberOfPanels"],
        stateOrTerritory: formData["stateOrTerritory"],
        structure: formData["structure"],
        discomOrTorrent: formData["discomOrTorrent"],
        phase: formData["phase"],
      }
      console.log("isFormValid", isFormValid)
      axios.post(urls["calculateURL"], postObject)
      .then(function (response) {

        setFormData((prevData) => ({
          ...prevData,
          ["calculatedDISCOMCharges"] : response.data["discom_or_torrent_charges"],
          ["calculatedGUVNLAmount"] : response.data["guvnl_amount"],
          ["calculatedSubsidy"] : response.data["subsidy"],
          ["projectCost"] : response.data["guvnl_amount"] - response.data["subsidy"] + response.data["discom_or_torrent_charges"] + formData["gebAgreementFees"] + formData["installmentAcMcbSwitchCharge"],
        }))})
      .catch(function (error) {
        console.log(error);
      });
    }
  }, [isFormValid])

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
  }, [])

  useEffect(() => {
    setIsFormValid(false);
  }, [formData["solarModule"], formData["solarModuleType"], formData["solarModuleWattage"], formData["totalKiloWatts"], formData["numberOfPanels"], formData["solarInverter"], formData["moduleMountingStructureMake"], formData["moduleMountingStructureDescription"], formData["moduleMountingStructureQuantity"], formData["stateOrTerritory"], formData["agentID"], formData["agentName"], formData["customerName"], formData["customerPhoneNumber"], formData["customerAddress"], formData["structure"], formData["discomOrTorrent"], formData["phase"], formData["installmentAcMcbSwitchCharge"], formData["gebAgreementFees"], formData["projectCost"], formData["customerEmail"], formData["switchGearAndProtection"], formData["sprinklerInstallation"]])

  useEffect(() => {
    if (formData["solarModuleType"] === "Poly") {
      handleFormChange("solarModuleWattage",  335);
    }
    else if (formData["solarModuleType"] === "Mono Perc" || formData["solarModuleType"] === "Mono Perc Bifacial" || formData["solarModuleType"] ==="Topcon") {
      handleFormChange("solarModuleWattage",  540);
    }
  }, [formData["solarModuleType"]]);  


  const urls = {
    "calculateURL": "http://localhost:5000/calculate",
    "submitURL": "http://localhost:5000/submitQuotation",
    "getAgentsURL": "http://localhost:5000/getAgents",
  }

  const handleSubmit = () => {

    axios.post(urls["submitURL"], formData)
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
  
  function handleAgentSelect(e: SelectChangeEvent<string>): void {
    handleFormChange("agentID", e.target.value);
    for (let i = 0; i <agentOptions.length; i++) {
      if (agentOptions[i]["agent_id"] === e.target.value) {
        handleFormChange("agentName", agentOptions[i]["agent_name"]);
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
                <TableCell>State:</TableCell>
                <TableCell>
                   <TextField type="text" name="state" value={formData["stateOrTerritory"]} onChange={(e) =>
                   handleFormChange("stateOrTerritory", e.target.value)} />
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Quotation Type</TableCell>
                <TableCell>
                   <InputLabel>Quotation Type</InputLabel>
                   <Select label="Quotation Type" value={formData["quotationType"]} onChange={(e) =>
                      handleQuotationTypeSelect(e)}>
                      {quotationTypeOptions.map((option) => (
                      <MenuItem key={option.text} value={option.value}>
                         {option.text}
                      </MenuItem>
                      ))}
                   </Select>
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Agent ID</TableCell>
                <TableCell>
                   <InputLabel>Agent ID</InputLabel>
                   <Select label="AgentID" value={formData["agentID"]} onChange={(e) =>
                      handleAgentSelect(e)}>
                      {agentOptions.map((option) => (
                      <MenuItem key={option["agent_id"]} value={option["agent_id"]}>
                         {option["agent_id"]}
                      </MenuItem>
                      ))}
                   </Select>
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
                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                   {formData["solarModuleWattage"]} W
                </TableCell>
                <TableCell>
                   <TextField value={formData["numberOfPanels"]} type="number" name="numberOfPanels" placeholder="Enter number of panels" onChange={(e) =>
                   handleFormChange("numberOfPanels", parseInt((e.target as HTMLInputElement).value))} />
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
                   <TextField value={formData["numberOfInverters"]} type="number" name="numberOfInverters" placeholder="Enter number of Inverters" onChange={(e) =>
                   handleFormChange("numberOfInverters", parseInt((e.target as HTMLInputElement).value))} />
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>3</TableCell>
                <TableCell>Grid Tie Inverter</TableCell>
                <TableCell>
                   <FormControl sx={{ m: 1, minWidth: 220 }}>
                   <InputLabel>Grid Tie Inverter</InputLabel>
                   <Select label="Grid Tie Inverter" value={formData["gridTieInverter"]} onChange={(e) =>
                      handleFormChange("gridTieInverter", e.target.value)}>
                      {gridTieInverterOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                         {option.text}
                      </MenuItem>
                      ))}
                   </Select>
                   </FormControl>
                </TableCell>
                <TableCell>
                   <TextField value={formData["numberOfGridTieInverters"]} type="number" name="numberOfGridTieInverters" placeholder="Number of grid tie inverter" onChange={(e) =>
                   handleFormChange("numberOfGridTieInverters", parseInt((e.target as HTMLInputElement).value))} />
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
                <TableCell>6</TableCell>
                <TableCell>Switch Gear and Protection</TableCell>
                <TableCell>
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
                <TableCell></TableCell>
             </TableRow>
             <TableRow>
                <TableCell>7</TableCell>
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
               Calculations {formData["totalKiloWatts"] > 0 && <span>for {formData["totalKiloWatts"]} Watts</span>}
            </TableCell>
            </TableRow>
         </TableHead>
       <TableBody>
             <TableRow>
                <TableCell>Rate per watt</TableCell>
                <TableCell>
                <TextField value={calculationData["ratePerWatt"]} type="number" name="ratePerWatt" onChange={(e) =>
                   handleCalculationDataChange("ratePerWatt", parseInt((e.target as HTMLInputElement).value))} />
                </TableCell>
                <TableCell>GST per watt</TableCell>
                <TableCell><TextField value={calculationData["gstPerWatt"]} type="number" name="gstPerWatt" onChange={(e) =>
                   handleCalculationDataChange("gstPerWatt", parseInt((e.target as HTMLInputElement).value))} /></TableCell>
               </TableRow>
             <TableRow>
              <TableCell>Total Rate</TableCell>
              <TableCell colSpan={3}>{calculationData["ratePerWatt"] * formData["totalKiloWatts"]}</TableCell>
              </TableRow>
          
          <TableRow>
                <TableCell>Electricity unit rate</TableCell>
                <TableCell>
                  <TextField value={calculationData["electricityUnitRate"]} type="number" name="electricityUnitRate" onChange={(e) =>
                   handleCalculationDataChange("electricityUnitRate", parseInt((e.target as HTMLInputElement).value))} />
                   </TableCell>
                <TableCell>Subsidy per watt</TableCell>
                <TableCell>
                <TextField value={calculationData["subsidyPerWatt"]} type="number" name="subsidyPerWatt" onChange={(e) =>
                   handleCalculationDataChange("subsidyPerWatt", parseInt((e.target as HTMLInputElement).value))} />
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Inflation in unit rate</TableCell>
                <TableCell>
                <TextField value={calculationData["inflationInUnitRate"]} type="number" name="inflationInUnitRate" onChange={(e) =>
                   handleCalculationDataChange("inflationInUnitRate", parseInt((e.target as HTMLInputElement).value))} />%
                </TableCell>
                <TableCell colSpan={2}></TableCell>
             </TableRow>
             <TableRow>
              <TableCell>Total Subsidy</TableCell>
              <TableCell colSpan={3}>{calculationData["subsidyPerWatt"] * formData["totalKiloWatts"]}</TableCell>
              </TableRow>
             <TableRow>
              <TableCell>Loan (Yes/No)</TableCell>
              <TableCell colSpan={3}>
              <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={(e) =>
                      handleCalculationDataChange("isLoan", e.target.value==='true')}
                      value={calculationData["isLoan"]}
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
                <TableCell>{calculationData["loanAmountOnProject"]}</TableCell>
                <TableCell>Loan term </TableCell>
                <TableCell>{calculationData["loanTerm"]}</TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Interest Rate on loan</TableCell>
                <TableCell>{calculationData["interestRateOnLoan"]}</TableCell>
                <TableCell>Installment of Loan per month</TableCell>
                <TableCell>{calculationData["loanAmountOnProject"]*(1+(calculationData["interestRateOnLoan"]*calculationData["loanTerm"])/1200)/12}</TableCell>
             </TableRow></>}
             <TableRow>
                <TableCell>Total GST</TableCell>
                <TableCell>{calculationData["gstPerWatt"] * formData["totalKiloWatts"]}</TableCell>
                <TableCell>Reinvestment Rate</TableCell>
                <TableCell><TextField value={calculationData["reinvestmentRate"].toString()  + "%"} name="reinvestmentRate" onChange={(e) =>
                  handleCalculationDataChange("reinvestmentRate", isNaN(parseInt(((e.target as HTMLInputElement).value).replace("%", "")))?0:parseInt(((e.target as HTMLInputElement).value).replace("%", "")))} /></TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Any extra cost on add-on work</TableCell>
                <TableCell>
                <TextField value={calculationData["anyExtraCostOnAddOnWork"]} type="number" name="anyExtraCostOnAddOnWork" onChange={(e) =>
                   handleCalculationDataChange("anyExtraCostOnAddOnWork", parseInt((e.target as HTMLInputElement).value))} />
                </TableCell>
                <TableCell>GST on add-on work</TableCell>
                <TableCell>
                <TextField value={calculationData["gstOnAddOnWork"]} type="number" name="gstOnAddOnWork" onChange={(e) =>
                   handleCalculationDataChange("gstOnAddOnWork", parseInt((e.target as HTMLInputElement).value))} />
                </TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Total add-on amount</TableCell>
                <TableCell colSpan={3}>{calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"]}</TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Total value of project without Gst</TableCell>
                <TableCell colSpan={3}>{calculationData["ratePerWatt"] * formData["totalKiloWatts"]}</TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Total value of project with Gst</TableCell>
                <TableCell colSpan={3}>{(calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * formData["totalKiloWatts"]}</TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Total value of project after subsidy</TableCell>
                <TableCell colSpan={3}>{((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * formData["totalKiloWatts"]) - (calculationData["subsidyPerWatt"] * formData["totalKiloWatts"])}</TableCell>
             </TableRow>
             <TableRow>
                <TableCell>Total final cost of project (without subsidy) + add-on work</TableCell>
                <TableCell colSpan={3}>{((calculationData["ratePerWatt"] + calculationData["gstPerWatt"]) * formData["totalKiloWatts"]) - (calculationData["subsidyPerWatt"] * formData["totalKiloWatts"]) + (calculationData["anyExtraCostOnAddOnWork"] + calculationData["gstOnAddOnWork"])}</TableCell>
             </TableRow>
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
    <Button variant="contained" onClick={() => validateAndCalculate()}>Validate and Calculate</Button>&nbsp;
    {formData["projectCost"] > 0 && isFormValid && <Button variant="contained" onClick={() => handleSubmit()}>Submit</Button>}
 </div>

  );
};

export default CommercialOrIndustrialQuotation;









