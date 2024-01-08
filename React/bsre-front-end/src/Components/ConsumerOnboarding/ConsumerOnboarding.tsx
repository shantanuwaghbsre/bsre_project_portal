import React, { useState, ChangeEvent, useEffect } from 'react';
import { useLocation } from 'react-router';
import { TextField, InputLabel, Table, TableBody, TableCell, TableRow, Button, Grid, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import axios from 'axios';

const urls = {
  "calculateURL": "http://localhost:5000/calculate",
  "onboardConsumer": "http://localhost:5000/onboardConsumer",
  "getAgentsURL": "http://localhost:5000/getAgents",
  "getLocationsURL": "http://localhost:5000/getLocations"
}

const ConsumerOnboarding = () => {
  const blankFormData = {
    consumerName: '',
    consumerAddress: '',
    consumerMobileNumber: '',
    alternatePhoneNumber: '',
    consumerEmail: '',
    aadharCardNumber: '',
    panCardNumber: '',
    onboardedByAgentCode: '',
    agentOrDistributorName: '',
    }
  
  const [agentOptions, setAgentOptions] = useState([])
  const [formData, setFormData] = useState(blankFormData);
  const [currentPage, setCurrentPage] = useState(1);
  let location = useLocation();

  useEffect(() => {
    axios.get(urls["getAgentsURL"])
      .then(function (response) {
        setAgentOptions(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      console.log(agentOptions);
  }, [])

  useEffect(() => {
    try {
      console.log(location)
      if (location.state.quotation) {
        setFormData({
        ...blankFormData,
        consumerName: location.state.quotation["Consumer name"], 
        consumerAddress: location.state.quotation["Consumer address"], 
        consumerMobileNumber: location.state.quotation["Consumer mobile number"],
        agentOrDistributorName: location.state.quotation["Agent name"],
        onboardedByAgentCode:location.state.quotation["Agent code"],
        })}
      else {
        setFormData(blankFormData)
      }}
    catch (error) {}
    }, [location.state])

  const [files, setFiles] = useState({
    aadharCard: new Blob(),
    panCard: new Blob(),
    passportPhoto: new Blob(),
    otherDocument: new Blob()
  })

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    console.log(name, value)
    if (name == "onboardedByAgentCode") {
      for (let i=0; i<agentOptions.length; i++) {
        if (agentOptions[i]["agent_id"] == value) {
          console.log(agentOptions[i])
          setFormData({ ...formData, ["agentOrDistributorName"]: agentOptions[i]["agent_name"], [name]: value });
        }
      }
    }
    else if (name == "aadharCard" || name == "panCard" || name == "passportPhoto" || name == "otherDocument") {
      console.log(typeof(e.target.files[0]))
      setFiles({...files, [e.target.name]: e.target.files[0]})
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };  

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault(); 
    
    const postObject = new FormData();

    for (const [filename, file] of Object.entries(files)) {
      postObject.append(filename, file);
    }

    for (const [key, value] of Object.entries(formData)) {
      postObject.append(key, value);
    }
    
    axios.post(urls['onboardConsumer'], postObject)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };


  return (
    <div style={{ paddingTop: 64 }}>
  {currentPage === 1 && (
    <form onSubmit={handleSubmit}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <InputLabel>Agent or distributor name</InputLabel>
            </TableCell>
            <TableCell>
              {formData.agentOrDistributorName}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <InputLabel>Agent code</InputLabel>
            </TableCell>
            <TableCell>
            <FormControl sx={{ m: 1, minWidth: 220 }}>
            <InputLabel>Agent Code</InputLabel>
                   <Select label="Agent Code" name="onboardedByAgentCode" value={formData.onboardedByAgentCode} onChange={(e) => handleChange(e)}>
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
            <TableCell colSpan={2} align='right'>
              <button type="button" onClick={handleNextPage}>
                Next
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </form>
  )}

  {currentPage === 2 && (
    <form onSubmit={handleSubmit}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <InputLabel>Consumer name</InputLabel>
            </TableCell>
            <TableCell>
              <TextField
                  label="Consumer name"
                type="text"
                name="consumerName"
                value={formData.consumerName}
                onChange={(e)=>handleChange(e)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <InputLabel>Consumer address</InputLabel>
            </TableCell>
            <TableCell>
              <TextField
                  label="Consumer address"
                type="text"
                name="consumerAddress"
                value={formData.consumerAddress}
                onChange={(e)=>handleChange(e)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <InputLabel>Consumer mobile number</InputLabel>
            </TableCell>
            <TableCell>
              <TextField
                  label="Consumer mobile number"
                type="text"
                name="consumerMobileNumber"
                value={formData.consumerMobileNumber}
                onChange={(e)=>handleChange(e)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <InputLabel>Alternate phone number</InputLabel>
            </TableCell>
            <TableCell>
              <TextField
                  label="Alternate phone number"
                type="text"
                name="alternatePhoneNumber"
                value={formData.alternatePhoneNumber}
                onChange={(e)=>handleChange(e)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <InputLabel>Consumer email</InputLabel>
            </TableCell>
            <TableCell>
              <TextField
                  label="Consumer email"
                type="text"
                name="consumerEmail"
                value={formData.consumerEmail}
                onChange={(e)=>handleChange(e)}
              />
            </TableCell>
          </TableRow>
          
          
          <TableRow>
            <TableCell align='left'>
              <button type="button" onClick={handlePreviousPage}>
                Previous
              </button>
            </TableCell>
            <TableCell align='right'>
              <button type="button" onClick={handleNextPage}>
                Next
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </form>
  )}
  {currentPage === 3 && (
  <form onSubmit={handleSubmit}>
    <Table>
      <TableBody>
      <TableRow>
  <TableCell>
      <InputLabel>aadhar card</InputLabel>
  </TableCell>
  <TableCell>
  <Button
  variant="contained"
  component="label"
>
  Upload aadhar card
  <input type="file" name="aadharCard" onChange={handleChange} hidden/> 
</Button>
  
  </TableCell>
</TableRow>
<TableRow>
<TableCell>
  <InputLabel>Aadhar card number</InputLabel>
</TableCell>
<TableCell>
  <TextField
      label="Aadhar card number"
    type="text"
    name="aadharCardNumber"
    value={formData.aadharCardNumber}
    onChange={(e)=>handleChange(e)}
  />
</TableCell>
</TableRow>

<TableRow>
  <TableCell>
      <InputLabel>Pan card</InputLabel>
  </TableCell>
  <TableCell>
  <Button
  variant="contained"
  component="label"
>
  Upload pan card
  <input type="file" name="panCard" onChange={handleChange} hidden/>
</Button>
  </TableCell>
</TableRow>
<TableRow>
            <TableCell>
              <InputLabel>Pan card number</InputLabel>
            </TableCell>
            <TableCell>
              <TextField
                  label="Pan card number"
                type="text"
                name="panCardNumber"
                value={formData.panCardNumber}
                onChange={(e)=>handleChange(e)}
              />
            </TableCell>
          </TableRow>
<TableRow>
  <TableCell>
      <InputLabel>Passport photo</InputLabel>
  </TableCell>
  <TableCell>
  <Button
  variant="contained"
  component="label"
>
  Upload passport photo
  <input type="file" name="passportPhoto" onChange={handleChange} hidden/>
</Button>
  </TableCell>
</TableRow>
<TableRow>
  <TableCell>
      <InputLabel>Other documents</InputLabel>
  </TableCell>
  <TableCell>
  <Button
  variant="contained"
  component="label"
>
  Upload other documents
  <input type="file" name="otherDocument" onChange={handleChange} hidden/>
</Button>
  </TableCell>
</TableRow>
        <TableRow>
          <TableCell align='left'>
              <button type="button" onClick={handlePreviousPage}>
                Previous
              </button>
            </TableCell>
            <TableCell align='right'>
              <button type="button" onClick={handleSubmit}>
                Submit
              </button>
            </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </form>
)}

  </div>
  );
};

export default ConsumerOnboarding;