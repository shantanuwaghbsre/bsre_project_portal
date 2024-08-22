import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useLocation } from 'react-router';
import { Table, TableRow, TableCell, TableContainer, TableHead, TableBody, Paper, Select, MenuItem, Button, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import InfoIcon from '@mui/icons-material/Info';
import Loading from "../Loading/Loading";
import { toast } from 'react-toastify';



const ViewAgent = (props: any) => {
    // console.log(props)
    axios.defaults.headers.common['token'] = props.token
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [agent, setAgent] = useState({});
    const [agentDetails, setAgentDetails] = useState({});
    const [salesData, setSalesData] = useState({});
    const [agentsProjects, setAgentsProjects] = useState([]);
    const [isAgentDownloadDisabled, setIsAgentDownloadDisabled] = useState(true);
    const [options, setOptions] = useState([
        { label: 'Aadhar card', value: 'aadhar_card' },
        { label: 'Pan card', value: 'pan_card' },
        { label: 'Cancelled Cheque', value: 'cancelled_cheque' },
    ]);
    let newOptions = [];

    const [documentRequired, setDocumentRequired] = useState('');

    const urls = {
        "DummyAgentAPI": import.meta.env.VITE_BACKEND_URL + "/dummyAPI",
        "AgentSalesDetail": import.meta.env.VITE_BACKEND_URL + "/getAgentSales",
        "getLocationsURL": import.meta.env.VITE_BACKEND_URL + "/getLocations",
        "getAgentDetails": import.meta.env.VITE_BACKEND_URL + "/getAgentDetails"
    }
    //for download aadharCard,panCard and etc.
    async function handleDownload() {
        let blob = new Blob([]);
        try {
            const response = await axios.get(urls["getAgentDetails"] + "?agent_code=" + location.state.agent["agent_code"]);
            console.log(response.data);
            if (documentRequired === "aadhar_card" || documentRequired === 'pan_card' || documentRequired === 'cancelled_cheque') {

                // Decode the Base64 string to binary data
                const binaryString = atob(response.data[documentRequired]);

                // Convert the binary string to a Uint8Array
                const uint8Array = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    uint8Array[i] = binaryString.charCodeAt(i);
                }

                // Create a Blob from the Uint8Array
                blob = new Blob([uint8Array]);
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', `${location.state.agent["agent_code"]}_${documentRequired}.pdf`);
                link.target = '_blank';

                // Append the link to the document and trigger the click event
                document.body.appendChild(link);
                link.click();

                // Remove the link from the document
                document.body.removeChild(link);
            }
            else {
                toast.error("Please Select Document");
            }

        }
        catch (error) {
            console.error('Error decoding base64 string:', error);
        }
    }
    //For aggentDetails like name, email, phone,aadhar card etc
    useEffect(() => {
        try {
            setAgent(location.state.agent)
            //we can use also dummyapi for temporary data getAgentDetails==>DummyAgentAPI// axios.get(urls["DummyAgentAPI"] + "?agent_code=" + location.state.agent["agent_code"]).then(response => {
            axios.get(urls["getAgentDetails"] + "?agent_code=" + location.state.agent["agent_code"])
                .then(response => {
                    console.log("AgentDetails=>", response.data);
                    setAgentDetails(response.data);
                    setLoading(false);
                    if (response.data["aadhar_card"] == null && response.data["pan_card"] == null && response.data["cancelled_cheque"] == null) {
                        setIsAgentDownloadDisabled(true)
                    }
                    else {
                        setIsAgentDownloadDisabled(false)
                    }
                })
        }
        catch (error) {
            console.error('Error fetching data:', error);
            setLoading(true);
        }

    }, [])

    //for now we are using dummy data for graph
    useEffect(() => {
        try {
            setAgent(location.state.agent)
            //we can use also dummyapi for temporary data AgentSalesDetail==>DummyAgentAPI
            axios.get(urls["DummyAgentAPI"] + "?agent_code=" + location.state.agent["agent_code"]).then(response => {
                // console.log("Agent Id IS==>", location.state.agent["agent_code"]);
                const xAxis = Object.keys(response.data["sales"]);
                const sales = Object.values(response.data["sales"]);
                const projects = Object.values(response.data["projects"]);
                console.log("Graph Data=>", xAxis, sales, projects)
                setAgentsProjects(projects);
                setSalesData({
                    options: {
                        xaxis: {
                            categories: xAxis
                        }
                    },
                    series: [
                        {
                            name: 'kw',
                            data: sales
                        }
                    ]
                })
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(true);
        }
    }, []);
    // useEffect(() => {
    //     try {
    //         if (location.state) {
    //             setAgent(location.state.agent);
    //             if (location.state.agent["other_documents_names"].length) {
    //                 console.log("reached here might be an issue")
    //                 newOptions = [];
    //                 for (let i = 0; i < location.state.agent["other_documents_names"].length; i++) {
    //                     console.log(newOptions);
    //                     newOptions.push({ label: location.state.agent["other_documents_names"][i], value: location.state.agent["other_documents_names"][i] });
    //                 }
    //                 if (options.length == 3) {
    //                     setOptions(options.concat(newOptions));
    //                 }
    //             }
    //         }
    //     }
    //     catch (error) { }
    // }, [location])


    return (
        <>
            {loading ?
                <div className='loadinginComponent'>
                    <Loading />
                </div>
                :
                <>
                    <Paper sx={{ width: '100%' }}>
                        <div className='table-data' style={{ width: '1000px' }}>
                            <span style={{ display: 'block', textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>AGENT DETAILS</span>
                            <br />
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Agent ID :</TableCell>
                                        <TableCell><b>{agentDetails["agent_code"]}</b></TableCell>
                                        <TableCell>Agent Name :</TableCell>
                                        <TableCell><b>{agentDetails["agent_name"]}</b></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Agent's Branch :</TableCell>
                                        <TableCell><b>{agentDetails["agent_branch"]}</b></TableCell>
                                        <TableCell>State :</TableCell>
                                        <TableCell><b>{agentDetails["agent_state"]}</b></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Mobile Number :</TableCell>
                                        <TableCell>
                                            <b>
                                                +91 {agentDetails["agent_mobile_number"]}
                                            </b>
                                        </TableCell>
                                        <TableCell>
                                            All Documents :
                                        </TableCell>
                                        <TableCell style={{ display: "flex" }}>
                                            <Select label="Document Required"
                                                value={documentRequired}
                                                onChange={(e) => {
                                                    setDocumentRequired(e.target.value);
                                                }}
                                                disabled={isAgentDownloadDisabled}
                                            >
                                                {(options.concat(newOptions)).map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            &nbsp;&nbsp;
                                            <button className='btn-download' disabled={isAgentDownloadDisabled} onClick={handleDownload}>
                                                <Tooltip title="Download" >
                                                    <FileDownloadOutlinedIcon />
                                                </Tooltip>
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <br />
                            <span style={{ display: 'block', textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>SALES</span>
                            <div className="Charts">
                                {
                                    Object.keys(salesData).length != 0 &&
                                    <Chart
                                        options={salesData['options']}
                                        series={salesData['series']}
                                        type="bar"
                                        width="900"
                                        height="300"
                                    />
                                }
                            </div>
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <span style={{ display: 'block', textAlign: 'center', fontSize: '30px', fontStyle: 'italic', fontWeight: 'bold' }}>PROJECTS</span>
                                <br />
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><b>Sr.No</b></TableCell>
                                                <TableCell><b>Project Name</b></TableCell>
                                                <TableCell><b>K/w</b></TableCell>
                                                <TableCell><b>Action</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                Object.keys(agentsProjects).length != 0 &&
                                                agentsProjects.map((project: any, index) => {
                                                    return (
                                                        <TableRow key={project}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{project[0][0]}</TableCell>
                                                            <TableCell>{project[0][1]}</TableCell>
                                                            <TableCell>
                                                                <Button variant="contained" startIcon={<InfoIcon />} component={Link} to="/ViewProject" state={{ "agent_id": project[0].agent_code }} >Info</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
                            </Paper>
                        </div>
                    </Paper>
                </>
            }
        </>
    )
}

export default ViewAgent