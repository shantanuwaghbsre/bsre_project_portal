import { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, Paper, FormLabel, RadioGroup, FormControlLabel, Radio, Snackbar, Alert, SelectChangeEvent, } from "@mui/material"
import axios from 'axios'
import './styles.css'

const ResidentialQuotation = () => {



  const solarModuleOptions = [
    {value: '', text: '--Choose a module--'},
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
    customerEmail: ""
  });

  const handleFormChange = (field:any, value:any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

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
      customerEmail: ""
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
  }, [formData["solarModule"], formData["solarModuleType"], formData["solarModuleWattage"], formData["totalKiloWatts"], formData["numberOfPanels"], formData["solarInverter"], formData["moduleMountingStructureMake"], formData["moduleMountingStructureDescription"], formData["moduleMountingStructureQuantity"], formData["stateOrTerritory"], formData["agentID"], formData["agentName"], formData["customerName"], formData["customerPhoneNumber"], formData["customerAddress"], formData["structure"], formData["discomOrTorrent"], formData["phase"], formData["installmentAcMcbSwitchCharge"], formData["gebAgreementFees"], formData["projectCost"], formData["customerEmail"]])

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
  }, [
    formData
  ])

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

  return (
  <div style={{paddingTop:64}}>
    {<Snackbar open={!isFormValid && errorMessage.length > 0} autoHideDuration={10000} onClose={() => handleClose()}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    {errorMessage}
  </Alert>
</Snackbar>}
    {<Snackbar open={successMessage.length > 0} autoHideDuration={10000} onClose={() => handleClose()}>
  <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
    {successMessage}
  </Alert>
</Snackbar>}
          
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
                  <TextField type="text" name="state" value={formData["stateOrTerritory"]} onChange={(e) => handleFormChange("stateOrTerritory", e.target.value)} />
              </TableCell>
          </TableRow>
          <TableRow>
              <TableCell>Agent ID</TableCell>
              <TableCell>
                  <Select value={formData["agentID"]} onChange={(e) => handleAgentSelect(e)}>
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
                  <TextField type="text" name="Customer Name" value={formData["customerName"]} onChange={(e) => handleFormChange("customerName", e.target.value)} />
              </TableCell>
          </TableRow>
          <TableRow>
              <TableCell>Address:</TableCell>
              <TableCell>
                  <TextField type="text" name="Address" value={formData["customerAddress"]} onChange={(e) => handleFormChange("customerAddress", e.target.value)} />
              </TableCell>
          </TableRow>
          <TableRow>
              <TableCell>Mobile No.:</TableCell>
              <TableCell>
                  <TextField type="text" name="Mobile No." value={formData["customerPhoneNumber"]} onChange={(e) => handleFormChange("customerPhoneNumber", e.target.value)} />
              </TableCell>
          </TableRow>
          <TableRow>
              <TableCell>Email:</TableCell>
              <TableCell>
                  <TextField type="text" name="Email" value={formData["customerEmail"]} onChange={(e) => handleFormChange("customerEmail", e.target.value)} />
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
            <TableCell>DESCRIPTION</TableCell>
            <TableCell>QTY.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Solar Module</TableCell>
            <TableCell>
              <Select value={formData["solarModule"]} onChange={(e) => handleFormChange("solarModule", e.target.value)}>
                {solarModuleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
              <br />
              <Select value={formData["solarModuleType"]} onChange={(e) => handleFormChange("solarModuleType", e.target.value)}>
                {solarModuleTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell>
              {formData["solarModuleWattage"]}
            </TableCell>
            <TableCell>
              <TextField value={formData["numberOfPanels"]} type="number" name="numberOfPanels" placeholder="Enter number of panels" onChange={(e) => handleFormChange("numberOfPanels", parseInt((e.target as HTMLInputElement).value))} />
              <br />
              <br />
              <label>Total Kilowatts - </label>&nbsp;{formData["totalKiloWatts"]} kW
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>Solar Inverter</TableCell>
            <TableCell>
              <Select value={formData["solarInverter"]} onChange={(e) => handleFormChange("solarInverter", e.target.value)}>
                {solarInverterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell>As per availability</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell>Module Mounting Structure</TableCell>
            <TableCell>
              <TextField
                type="text"
                name="Module Mounting Structure Make"
                defaultValue={formData["moduleMountingStructureMake"]}
                onChange={(e) => handleFormChange("moduleMountingStructureMake", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                name="Module Mounting Structure Description"
                defaultValue={formData["moduleMountingStructureDescription"]}
                // size={moduleMountingStructureDescription.length}
                onChange={(e) => handleFormChange("moduleMountingStructureDescription", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <TextField
                type="text"
                name="Module Mounting Structure Quantity"
                defaultValue={formData["moduleMountingStructureQuantity"]}
                // size={moduleMountingStructureQuantity.length}
                onChange={(e) => handleFormChange("moduleMountingStructureQuantity", e.target.value)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>4</TableCell>
            <TableCell>ACDB</TableCell>
            <TableCell>IP 65 enclosure (As per Standard Industry require)</TableCell>
            <TableCell>Standard</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5</TableCell>
            <TableCell>DCDB</TableCell>
            <TableCell>IP 65 enclosure (As per Standard Industry require)</TableCell>
            <TableCell>Standard</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>6</TableCell>
            <TableCell>AC/DC Cable</TableCell>
            <TableCell>As per Standard Unbreakable-KEI</TableCell>
            <TableCell>KEI</TableCell>
            <TableCell>As Per Site</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>7</TableCell>
            <TableCell>Earthing Cable</TableCell>
            <TableCell>As per Standard Unbreakable-KEI 16xmm</TableCell>
            <TableCell>KEI</TableCell>
            <TableCell>As Per Site</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>8</TableCell>
            <TableCell>Earthing</TableCell>
            <TableCell>Proper Chemical earth thing as per Standard with full Protection with LA</TableCell>
            <TableCell>Standard</TableCell>
            <TableCell>3</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>9</TableCell>
            <TableCell>Wiring Pipe</TableCell>
            <TableCell>White pvc Standard pipe</TableCell>
            <TableCell>Standard</TableCell>
            <TableCell>As Per Site</TableCell>
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
            <TableCell>SR. NO.</TableCell>
            <TableCell>DESCRIPTION</TableCell>
            <TableCell>KW POWER</TableCell>
            <TableCell>STRUCTURE</TableCell>
            <TableCell>TOTAL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>GUVNL RATE PER KW FOR DESIGN, SUPPLY, INSTALLATION &amp; COMMISIONING OF SOLAR ROOFTOP SYSTEM</TableCell>
            <TableCell width="1%">{formData["totalKiloWatts"]} kW</TableCell>
            <TableCell>
              <TextField type="text" name="structure" placeholder="Enter structure type" value={formData["structure"]} onChange={(e) => handleFormChange("structure", e.target.value)}/>
              <br />
              <Button variant="contained"onClick={() => handleFormChange("structure", "2//6")}>2//6</Button>&nbsp;
              <Button variant="contained" onClick={() => handleFormChange("structure", "4//8")}>4//8</Button>&nbsp;
              <Button variant="contained" onClick={() => handleFormChange("structure", "6//10")}>6//10</Button>
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>SUBSIDY</TableCell>
            <TableCell colSpan={2}>{formData["totalKiloWatts"]}</TableCell>
            <TableCell>{formData["calculatedSubsidy"].toLocaleString('en-IN')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>GUVNL SYSTEM AMOUNT</TableCell>
            <TableCell colSpan={3}>{formData["calculatedGUVNLAmount"].toLocaleString('en-IN')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>TOTAL SUBSIDY AMOUNT</TableCell>
            <TableCell colSpan={3}>{formData["calculatedSubsidy"].toLocaleString('en-IN')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>NET GUVNL SYSTEM PRICE</TableCell>
            <TableCell colSpan={3}>{(formData["calculatedGUVNLAmount"] - formData["calculatedSubsidy"]).toLocaleString('en-IN')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>{formData["structure"]} FT ELEVATED STRUCTURE</TableCell>
            <TableCell colSpan={3}>INCLUDING</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>DISCOM Charges (IF SINGLE PHASE) Connection RGPR (IT MAY BE CHANGED AS PER DISCOM ESTIMATES)</TableCell>
            <TableCell colSpan={2}>
            <FormLabel id="demo-row-radio-buttons-group-label">Type of Quotation</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={(e) => handleFormChange("discomOrTorrent", e.target.value)}
                value={formData["discomOrTorrent"]}
              >
                <FormControlLabel value="DISCOM" control={<Radio />} label="DISCOM" />
                <FormControlLabel value="Torrent" control={<Radio />} label="Torrent" />
              </RadioGroup>
            <><FormLabel id="demo-row-radio-buttons-group-label">Select Phase</FormLabel><RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={(e) => handleFormChange("phase", e.target.value)}
                value={formData["phase"]}
              >
                <FormControlLabel value="Single" control={<Radio />} label="Single" />
                <FormControlLabel value="Three" control={<Radio />} label="Three" />
              </RadioGroup></>
            </TableCell>
            <TableCell colSpan={3}>{formData["calculatedDISCOMCharges"].toLocaleString('en-IN')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Installation AC MCB Switch charges</TableCell>
            <TableCell colSpan={3}>
              <Select value={formData["installmentAcMcbSwitchCharge"]} onChange={(e) => handleFormChange("installmentAcMcbSwitchCharge", parseInt((e.target as HTMLInputElement).value))}>
                {installmentAcMcbSwitchChargeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
              </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>GEB AGREEMENT FEES</TableCell>
            <TableCell colSpan={3}>
            <Select value={formData["gebAgreementFees"]} onChange={(e) => handleFormChange("gebAgreementFees", parseInt((e.target as HTMLInputElement).value))}>
                {gebAgreementFeesOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>PROJECT COST</TableCell>
            <TableCell colSpan={3}>{formData["projectCost"].toLocaleString('en-IN')}</TableCell>
          </TableRow>
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

export default ResidentialQuotation;









