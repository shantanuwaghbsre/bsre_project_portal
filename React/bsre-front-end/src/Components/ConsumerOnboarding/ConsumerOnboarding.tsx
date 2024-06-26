import React, { useState, ChangeEvent, useEffect } from 'react';
import { useLocation } from 'react-router';
import { TextField, InputLabel, Table, TableBody, TableCell, TableRow, Button, Grid, FormControl, Select, MenuItem, SelectChangeEvent, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ViewAllConsumers from '../ViewAllConsumers/ViewAllConsumers';



const urls = {
  "calculateURL": import.meta.env.VITE_BACKEND_URL + "/calculate",
  "onboardConsumer": import.meta.env.VITE_BACKEND_URL + "/onboardConsumer",
  "getAgentsURL": import.meta.env.VITE_BACKEND_URL + "/getAgents",
  "getLocationsURL": import.meta.env.VITE_BACKEND_URL + "/getLocations",
  "getConsumerURL": import.meta.env.VITE_BACKEND_URL + "/getConsumer"
}

const ConsumerOnboarding = (props: any) => {
  axios.defaults.headers.common['token'] = props.token
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
    otherDocumentsNames: [],
  }

  const [agentOptions, setAgentOptions] = useState([])
  const [formData, setFormData] = useState(blankFormData);
  const [currentPage, setCurrentPage] = useState(1);
  let location = useLocation();
  let navigate = useNavigate();

  const goToConsumer = (consumer:any) => navigate('/ViewConsumer', { state: { "consumer": consumer } });

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
          onboardedByAgentCode: location.state.quotation["Agent code"],
        })
      }
      else {
        setFormData(blankFormData)
      }
    }
    catch (error) { }
  }, [location.state])

  const [files, setFiles] = useState({
    aadharCard: new Blob(),
    panCard: new Blob(),
    passportPhoto: new Blob(),
    otherDocuments: []
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log(name, value)
    if (name == "onboardedByAgentCode") {
      for (let i = 0; i < agentOptions.length; i++) {
        if (agentOptions[i]["agent_id"] == value) {
          console.log(agentOptions[i])
          setFormData({ ...formData, ["agentOrDistributorName"]: agentOptions[i]["agent_name"], [name]: value });
        }
      }
    }
    else if (name == "aadharCard" || name == "panCard" || name == "passportPhoto") {
      console.log(typeof (e.target.files[0]))
      setFiles({ ...files, [e.target.name]: e.target.files[0] })
    }
    else if (name == "otherDocuments") {
      setFiles((files) => ({
        ...files,
        [name]: [...(files[name] || []), e.target.files[0]]
      }));
      setFormData({ ...formData, ["otherDocumentsNames"]: [...(formData["otherDocumentsNames"] || []), e.target.files[0].name] });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const postObject = new FormData();

    for (const [filename, file] of Object.entries(files)) {
      if (filename == "otherDocuments") {
        for (let i = 0; i < file.length; i++) {
          postObject.append(i.toString(), file[i], formData.otherDocumentsNames[i]);
        }
      }
      else {
        postObject.append(filename, file);
      }
    }

    for (const [key, value] of Object.entries(formData)) {
      postObject.append(key, value);
    }

    axios.post(urls['onboardConsumer'], postObject)
      .then(response => {
        console.log(response.data);
        if (response.data["success"] == true) {
          axios.get(urls['getConsumerURL'], { params: { consumer_id: response.data["consumer_id"] } })
            .then(response_ => {
              console.log(response_.data)
              goToConsumer(response_.data);
            }
            )
        }
        else {
          alert("Consumer onboarding failed!");
        }
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

  const handleRemoveDocument = (index: string) => {
    setFormData({ ...formData, ["otherDocumentsNames"]: formData["otherDocumentsNames"].filter((item, i) => i !== parseInt(index)) });
    setFiles((files) => ({
      ...files,
      ["otherDocuments"]: files["otherDocuments"].filter((item, i) => i !== parseInt(index))
    }));
  }


  return (
    <Paper sx={{ width: '100%' }}>
      <div className='table-data'>
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
                    <button className='btn-next' type="button" onClick={handleNextPage}>
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
                      onChange={(e) => handleChange(e)}
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
                      onChange={(e) => handleChange(e)}
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
                      onChange={(e) => handleChange(e)}
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
                      onChange={(e) => handleChange(e)}
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
                      onChange={(e) => handleChange(e)}
                    />
                  </TableCell>
                </TableRow>


                <TableRow>
                  <TableCell align='left'>
                    <button className='btn-prev' type="button" onClick={handlePreviousPage}>
                      Previous
                    </button>
                  </TableCell>
                  <TableCell align='right'>
                    <button className='btn-next' type="button" onClick={handleNextPage}>
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
                      <input type="file" name="aadharCard" onChange={handleChange} hidden />
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
                      onChange={(e) => handleChange(e)}
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
                      <input type="file" name="panCard" onChange={handleChange} hidden />
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
                      onChange={(e) => handleChange(e)}
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
                      <input type="file" name="passportPhoto" onChange={handleChange} hidden />
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
                      <input type="file" name="otherDocuments" onChange={handleChange} hidden />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <InputLabel>Uploaded Documents</InputLabel>
                  </TableCell>
                  <TableCell>
                    <List>
                      {formData.otherDocumentsNames.map((documentName, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={documentName} />
                          <Button
                            style={{ backgroundColor: "red", color: "white" }}
                            variant="contained"
                            component="label"
                            onClick={() => handleRemoveDocument(index)}
                          >
                            Remove
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='left'>
                    <button className='btn-prev' type="button" onClick={handlePreviousPage}>
                      Previous
                    </button>
                  </TableCell>
                  <TableCell align='right'>
                    <button className='btn-next' type="button" onClick={handleSubmit}>
                      Submit
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        )}
      </div>
    </Paper>
  );
};

export default ConsumerOnboarding;