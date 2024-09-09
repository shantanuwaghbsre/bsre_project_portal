import React, { useState, useEffect } from "react";
import {
  TextField,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  FormControl,
  Select,
  MenuItem,
  TableContainer,
  Paper,
} from "@mui/material";
import axios from "axios";
import Loading from "../Loading/Loading";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import toast from "react-hot-toast";

const urls = {
  submitURL: import.meta.env.VITE_BACKEND_URL + "/addAgent",
  getLocationsURL: import.meta.env.VITE_BACKEND_URL + "/getLocations",
  getAgentBranches: import.meta.env.VITE_BACKEND_URL + "/getAgentBranches",
};
const AddAgent = (props: any) => {
  const blankFormData = {
    agentName: "",
    agentBranch: "",
    agentState: "",
    agentMobileNumber: "",
    agentAddress: "",
    bankAccountNumber: "",
    bankIfsc: "",
  };
  //camelcase to snake case function helloWorld=>hello_world
  function camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
  axios.defaults.headers.common["token"] = props.token;
  const [agentStateOptions, setAgentStateOptions] = useState({});
  const [isFormValid, setIsFormValid] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(blankFormData);
  const [files, setFiles] = useState({});

  const handleFileChange = (event: any) => {
    const { name, value } = event.target;
    console.log(name, value);
    const validTypes = ["application/pdf"];

    if (!validTypes.includes(event.target.files[0].type)) {
      toast.error("Invalid file type. Only PDF files are allowed.");
      return;
    } else {
      if (
        event.target.name == "aadhar_card" ||
        event.target.name == "pan_card" ||
        event.target.name == "cancelled_cheque"
      ) {
        setFiles({ ...files, [event.target.name]: event.target.files[0] });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };
  const handleSubmit = () => {
    setLoading(true);
    const postObject = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      postObject.append(camelToSnakeCase(key), value);
    }
    for (const [filename, file] of Object.entries(files)) {
      postObject.append(filename, file);
    }

    console.log("postObject", postObject);
    // const postObject = {
    //   "agent_name": formData["agentName"],
    //   "agent_mobile_number": formData["agentMobileNumber"],
    //   "agent_barnch": formData["agentBranch"],
    //   "agent_state": formData["agentState"],
    //   "agent_address": formData["agentAddress"],
    // "bank_account_number": formData["bankAccountNumber"],
    // "bank_ifsc_code": formData["bankIFSC"],
    // "bank_branch_name": formData["bankBranchName"],
    //   // "cancelled_cheque": files["cancelled_cheque"]
    // }
    // for (const [filename, file] of Object.entries(files))
    // {postObject.append(filename, file);}
    // const postObject = {
    //   "agent_name": "Adarsh",
    //   "agent_address": "Bharuch",
    //   "agent_state": "Gujarat",
    //   "agent_mobile_number": "00000000000"
    // }
    axios
      .post(urls["submitURL"], postObject) //Should ['submitURL'] else we can use ['dummyURL']
      .then(function (response) {
        setLoading(false);
        if (response.data.completed) {
          // console.log(response.data);
          resetForm();
          toast.success(
            "Successfully created Agent - " + response.data.agent_code,
            {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
            }
          );
        } else {
          console.log("goes in else", response.data);

          setErrorMessage((prevErrorMessage) => [
            ...prevErrorMessage,
            "Error while creating Agent",
          ]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    axios.get(urls["getAgentBranches"]).then((response) => {
      setAgentStateOptions(response.data);
      console.log("getAgentBranches", response.data);
    });
  }, []);
  useEffect(() => {
    if (errorMessage.length > 0) {
      toast.error(
        <div>
          Please fill the required fields.
          <br />
          {errorMessage.map((error) => (
            <ul key={error}>
              <li style={{ textAlign: "left" }}>{error}</li>
            </ul>
          ))}
          <br />
        </div>,
        {
          position: "top-right",
          autoClose: false,
          theme: "colored",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  }, [errorMessage]);
  const validateFeilds = () => {
    let isFormValid_ = false;
    isFormValid_ = true;
    let errorMessage_ = [];
    if (!formData["agentName"]) {
      errorMessage_.push("Agent Name is required");
    }
    if (!formData["agentState"]) {
      errorMessage_.push("Agent's State is required");
    }
    if (!formData["agentBranch"]) {
      errorMessage_.push("Agent's Branch is required");
    }
    if (!formData["agentMobileNumber"]) {
      errorMessage_.push("Agent's Mobile Number is required");
    }
    if (!formData["agentAddress"]) {
      errorMessage_.push("Agent's Address is required");
    }
    if (!formData["bankAccountNumber"]) {
      errorMessage_.push("Agent's Bank Account Number is required");
    }
    if (!formData["bankIfsc"]) {
      errorMessage_.push("Agent's Bank IFSC is required");
    }
    if (!formData["bankBranchName"]) {
      errorMessage_.push("Agent's Bank Branch Name is required");
    }
    if (!files["aadhar_card"]) {
      errorMessage_.push("Please upload Aadhar card");
    }
    if (!files["pan_card"]) {
      errorMessage_.push("PleasePAn upload Pan card");
    }
    if (!files["cancelled_cheque"]) {
      errorMessage_.push("PleaseChar upload cancelled cheque");
    }
    if (errorMessage_.length > 0) {
      isFormValid_ = false;
      setErrorMessage(errorMessage_);
    } else {
      setErrorMessage([]);
    }

    setIsFormValid(isFormValid_);
  };

  const handleFormChange = (field: any, value: any) => {
    console.log("handleFormChange", field, value);

    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const resetForm = () => {
    setFormData({
      agentName: "",
      agentBranch: "",
      agentState: "",
      agentMobileNumber: "",
      agentAddress: "",
      // aadharCardNumber: "",
      // panCardNumber: "",
      // cancelledChequeNumber: "",
      bankAccountNumber: "",
      bankIfsc: "",
    });
    setErrorMessage([]);
    setIsFormValid(false);
  };

  console.log("States:-", agentStateOptions[formData["agentState"]]);
  // console.log(
  //   "branches:-",
  //   Object.keys(agentStateOptions[formData["agentState"]])
  // );

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      ) : (
        <>
          <Paper sx={{ width: "100%" }}>
            <div className="table-data">
              <label className="search-label">Add Agents</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SupportAgentIcon
                  color="primary"
                  style={{ fontSize: "3rem" }}
                />
                <span style={{ marginTop: "-10px" }}>+</span>
              </div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    <TableRow>
                      <TableCell>Agent Name *</TableCell>
                      <TableCell colSpan={3}>
                        <TextField
                          type="text"
                          name="Agent Name"
                          value={formData["agentName"]}
                          onChange={(e) =>
                            handleFormChange("agentName", e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Agent State *</TableCell>
                      <TableCell>
                        <FormControl sx={{ minWidth: 220 }}>
                          <InputLabel>State</InputLabel>
                          <Select
                            label="State"
                            value={formData["agentState"]}
                            MenuProps={{ style: { maxHeight: 300 } }}
                            onChange={(e) =>
                              handleFormChange("agentState", e.target.value)
                            }
                          >
                            {Object.keys(agentStateOptions).map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    ` `
                    <TableRow>
                      <TableCell>Agent Branch *</TableCell>
                      <TableCell>
                        <FormControl sx={{ minWidth: 220 }}>
                          <InputLabel>Branch</InputLabel>
                          <Select
                            label="Branch"
                            value={formData["agentBranch"]}
                            MenuProps={{ style: { maxHeight: 300 } }}
                            onChange={(e) =>
                              handleFormChange("agentBranch", e.target.value)
                            }
                            disabled={formData["agentState"] == ""}
                          >
                            {(
                              agentStateOptions[formData["agentState"]] || []
                            ).map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Agent Mobile Number *</TableCell>
                      <TableCell>
                        <TextField
                          type="Number"
                          name="Agent Mobile Number"
                          value={formData["agentMobileNumber"]}
                          onChange={(e) =>
                            handleFormChange(
                              "agentMobileNumber",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Address *</TableCell>
                      <TableCell>
                        <TextField
                          type="text"
                          name="Agent Address"
                          value={formData["agentAddress"]}
                          onChange={(e) =>
                            handleFormChange("agentAddress", e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Aadhaar card * </TableCell>
                      <TableCell>
                        <input
                          type="file"
                          name="aadhar_card"
                          onChange={(e) => handleFileChange(e)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pan card *</TableCell>
                      <TableCell>
                        <input
                          type="file"
                          name="pan_card"
                          onChange={(e) => handleFileChange(e)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bank Account No.*</TableCell>
                      <TableCell>
                        <TextField
                          type="text"
                          name="Bank AcNo"
                          value={formData["bankAccountNumber"]}
                          onChange={(e) =>
                            handleFormChange(
                              "bankAccountNumber",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bank IFSC *</TableCell>
                      <TableCell>
                        <TextField
                          type="text"
                          name="Bank IFSC"
                          value={formData["bankIfsc"]}
                          onChange={(e) =>
                            handleFormChange("bankIfsc", e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bank Branch *</TableCell>
                      <TableCell>
                        <TextField
                          type="text"
                          name="Bank Branch"
                          value={formData["bankBranchName"]}
                          onChange={(e) =>
                            handleFormChange("bankBranchName", e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cancelled Cheque *</TableCell>
                      <TableCell>
                        <input
                          type="file"
                          name="cancelled_cheque"
                          onChange={(e) => handleFileChange(e)}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              <Button variant="contained" onClick={() => validateFeilds()}>
                Validate
              </Button>
              &nbsp;
              {isFormValid && errorMessage.length == 0 && (
                <Button variant="contained" onClick={() => handleSubmit()}>
                  Submit
                </Button>
              )}
            </div>
          </Paper>
        </>
      )}
    </>
  );
};

export default AddAgent;
