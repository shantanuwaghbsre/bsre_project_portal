import React, { useState, useEffect } from "react";
import {
    TextField,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Button,
    Stack,
    Typography,
    Paper,
    Link
} from "@mui/material";
import axios from "axios";
import Loading from "../../Components/Loading/Loading";
import toast from "react-hot-toast";

const urls = {
    submitURL: import.meta.env.VITE_BACKEND_URL + "/addAgent",
    // submitURL: import.meta.env.VITE_BACKEND_URL + "/dummyAPI",
    getLocationsURL: import.meta.env.VITE_BACKEND_URL + "/getLocations",
    getAgentBranches: import.meta.env.VITE_BACKEND_URL + "/getAgentBranches",
};
// Logo URL
const logoUrl = '/Images/BS-LOGO.jpg';

const Signup = (props: any) => {
    const blankFormData = {
        agentName: "",
        agentBranch: "",
        agentState: "",
        agentMobileNumber: "",
        agentAddress: "",
        bankAccountNumber: "",
        bankIfsc: "",
        password: "",
        confirmPassword: "",
    };

    // Convert camelCase to snake_case
    const camelToSnakeCase = (str: string): string => {
        return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    };

    axios.defaults.headers.common["token"] = props.token;

    const agentStateOptions = {
        "Gujarat": [
            'Amreli',
            'Bhavnagar',
            'Bharuch',
            'Borsad',
            'Dholka',
            'Jambusar',
            'Mahuva',
            'Palitana',
            'Rajula',
            'Surat',
            'Vadodara',
        ]
    };

    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState(blankFormData);
    const [files, setFiles] = useState<any>({});

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (files && files[0]) {
            const validTypes = ["application/pdf"];
            if (!validTypes.includes(files[0].type)) {
                toast.error("Invalid file type. Only PDF files are allowed.");
                return;
            }
            if (["aadhar_card", "pan_card", "cancelled_cheque"].includes(name)) {
                setFiles((prevFiles) => ({ ...prevFiles, [name]: files[0] }));
            } else {
                setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
            }
        }
    };

    const handleSubmit = () => {
        if (validateFields() === true) {
            setErrorMessage([]);
            setLoading(true);
            const postObject = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                postObject.append(camelToSnakeCase(key), value);
            });
            Object.entries(files).forEach(([filename, file]) => {
                postObject.append(filename, file);
            });

            axios.post(urls.submitURL, postObject)
                .then((response) => {
                    setLoading(false);
                    if (response.data.completed) {
                        resetForm();
                        toast.success(`Successfully created user ${response.data.agent_code}`, {
                            position: "top-center",
                            theme: "colored",
                            autoClose: 2000,
                            hideProgressBar: true,
                        });
                    } else {
                        setErrorMessage((prevErrorMessage) => [
                            ...prevErrorMessage,
                            "Error while creating Account. Please try again.",
                        ]);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    toast.error("An error occurred while submitting the form.");
                });
        }
    };

    useEffect(() => {
        // Fetch agent branches or locations if needed
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
                    theme: "colored",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        }
    }, [errorMessage]);

    const validateFields = () => {
        let isFormValid_ = true;
        const errorMessages = [];
        if (!formData["agentName"]) errorMessages.push("Agent Name is required");
        else if (!formData["agentState"]) errorMessages.push("Agent's State is required");
        else if (!formData["agentBranch"]) errorMessages.push("Agent's Branch is required");
        else if (!formData["agentMobileNumber"]) errorMessages.push("Agent's Mobile Number is required");
        else if (!formData["agentAddress"]) errorMessages.push("Agent's Address is required");
        else if (!formData["bankAccountNumber"]) errorMessages.push("Agent's Bank Account Number is required");
        else if (!formData["bankIfsc"]) errorMessages.push("Agent's Bank else ifSC is required");
        else if (!formData["bankBranchName"]) errorMessages.push("Agent's Bank branch is required");
        else if (!files["aadhar_card"]) errorMessages.push("Please upload Aadhar card");
        else if (!files["pan_card"]) errorMessages.push("Please upload Pan card");
        else if (!files["cancelled_cheque"]) errorMessages.push("Please upload cancelled cheque");
        else if (!formData["password"]) errorMessages.push("Password is required");
        else if (formData["password"] !== formData["confirmPassword"]) errorMessages.push("Passwords do not match");

        if (errorMessages.length > 0) {
            setErrorMessage(errorMessages);
            isFormValid_ = false;
        }
        return isFormValid_;
    };

    const handleFormChange = (field: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setFormData(blankFormData);
        setFiles({});
        setIsFormValid(false);
    };

    return (
        <>
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <Loading />
                </div>
            ) : (
                <Paper sx={{ padding: 3, maxWidth: 1000, margin: 'auto' }}>
                    <Stack spacing={2} sx={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                        <img src={logoUrl} alt="Logo" style={{ width: '50px', marginBottom: '20px' }} />
                        <Typography variant="h5" sx={{ textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 'bold' }} gutterBottom>
                            Sign Up
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Agent Name"
                                variant="outlined"
                                sx={{ width: "400px" }}
                                value={formData["agentName"]}
                                onChange={(e) => handleFormChange("agentName", e.target.value)}
                            />
                            <FormControl sx={{ width: "400px" }}>
                                <InputLabel>State</InputLabel>
                                <Select
                                    label="State"
                                    value={formData["agentState"]}
                                    onChange={(e) => handleFormChange("agentState", e.target.value)}
                                >
                                    {Object.keys(agentStateOptions).map((state) => (
                                        <MenuItem key={state} value={state}>
                                            {state}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ width: "400px" }}>
                                <InputLabel>Branch</InputLabel>
                                <Select
                                    label="Branch"
                                    value={formData["agentBranch"]}
                                    onChange={(e) => handleFormChange("agentBranch", e.target.value)}
                                    disabled={!formData["agentState"]}
                                >
                                    {(agentStateOptions[formData["agentState"]] || []).map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Agent Mobile Number"
                                type="tel"
                                variant="outlined"
                                sx={{ width: "400px" }}
                                value={formData["agentMobileNumber"]}
                                onChange={(e) => handleFormChange("agentMobileNumber", e.target.value)}
                            />
                            <TextField
                                label="Address"
                                variant="outlined"
                                multiline
                                rows={4}
                                sx={{ width: "400px" }}
                                value={formData["agentAddress"]}
                                onChange={(e) => handleFormChange("agentAddress", e.target.value)}
                            />
                            <Stack direction="row" spacing={2} justifyContent="left">
                                <label htmlFor="aadhar_card">Aadhar Card:</label>
                                <input
                                    type="file"
                                    name="aadhar_card"
                                    onChange={handleFileChange}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2} justifyContent="left">
                                <label htmlFor="pan_card">Pan Card:</label>
                                <input
                                    type="file"
                                    name="pan_card"
                                    onChange={handleFileChange}
                                />
                            </Stack>
                            <TextField
                                label="Bank Account Number"
                                variant="outlined"
                                sx={{ width: "400px" }}
                                value={formData["bankAccountNumber"]}
                                onChange={(e) => handleFormChange("bankAccountNumber", e.target.value)}
                            />
                            <TextField
                                label="Bank IFSC"
                                variant="outlined"
                                sx={{ width: "400px" }}
                                value={formData["bankIfsc"]}
                                onChange={(e) => handleFormChange("bankIfsc", e.target.value)}
                            />
                            <TextField
                                label="Bank Branch"
                                variant="outlined"
                                sx={{ width: "400px" }}
                                value={formData["bankBranchName"]}
                                onChange={(e) => handleFormChange("bankBranchName", e.target.value)}
                            />
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <label htmlFor="cancelled_cheque">Cancelled Cheque:</label>
                                <input
                                    type="file"
                                    name="cancelled_cheque"
                                    onChange={handleFileChange}
                                />
                            </Stack>
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                sx={{ width: "400px" }}
                                value={formData["password"]}
                                onChange={(e) => handleFormChange("password", e.target.value)}
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                sx={{ width: "400px" }}
                                value={formData["confirmPassword"]}
                                onChange={(e) => handleFormChange("confirmPassword", e.target.value)}
                            />
                            <Stack direction="row" spacing={2} justifyContent="center">


                                <Button variant="contained" onClick={handleSubmit}>
                                    Submit
                                </Button>

                            </Stack>
                            <Typography variant="body2" sx={{ textAlign: 'center', marginTop: 2 }}>
                                Already have an account? <Link href="/login" underline="hover">Login</Link>
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            )}
        </>
    );
};

export default Signup;
