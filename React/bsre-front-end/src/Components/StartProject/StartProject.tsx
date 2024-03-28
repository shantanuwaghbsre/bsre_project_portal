import { FormControl, InputLabel, Select, Input, MenuItem, TextField, Menu, ListSubheader, InputAdornment, Autocomplete, Table, TableBody, TableCell, TableRow, Button, List, ListItem, ListItemText } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import SearchIcon from "@mui/icons-material/Search";
import SelectListWithText from '../SelectListWithText/SelectListWithText';

const StartProject = (props:any) => {
    axios.defaults.headers.common['token'] = props.token
    let navigate = useNavigate();
    const goToProject = (project) => navigate('/ViewProject', { state: { "consumer_number": project.consumer_number, "project_in_phase": project.project_in_phase, "for_consumer_id": project.for_consumer_id } });
    const [currentPage, setCurrentPage] = useState(1);
    const [project, setProject] = useState({
        meter_number: "",
        current_phase: "",
        installation_phase: "",
        current_sanctioned_load: "",
        average_consumption_of_unit: "",
        consumer_number: "",
        project_type: "",
        project_address: "",
        latitude: "",
        longitude: "",
        total_kilowatts: "",
        solar_panel_type: "",
        project_cost: "",
        deposit_amount: "",
        remaining_balance: "",
        deposited_money_in_words: "",
        payment_type: "",
        transaction_number: "",
        bank_details_with_branch: "",
        national_portal_registration_number: "",
        from_quotation: "",
        project_email: "",
        project_in_phase: 1,
        for_consumer_id: "",
        solar_inverter_make: "",
        solar_panel_wattage: "",
        number_of_panels: "",
        other_documents_names: [],
    })
    const [files, setFiles] = useState({
        property_tax: new Blob(),
        electricity_bill: new Blob(),
        cancelled_cheque: new Blob(),
        other_documents: []
      })

    const [quotationSearchResults, setQuotationSearchResults] = useState<string[]>([]);
    
    // const urls = {
    //     "searchQuotationURL": "http://localhost:5000/searchQuotations",
    //     "createProjectURL": "http://localhost:5000/createProject",
    //     "searchSpecificQuotationURL": "http://localhost:5000/searchSpecificQuotation"
    // }

    const urls = {
        "searchQuotationURL": "http://192.168.29.62:5000/searchQuotations",
        "createProjectURL": "http://192.168.29.62:5000/createProject",
        "searchSpecificQuotationURL": "http://192.168.29.62:5000/searchSpecificQuotation"
    }
    
    let _location = useLocation();

    useEffect(() => {
        try {
            console.log(_location.state.consumer.consumer_id)
          if (_location.state) {
            setProject({...project, ["for_consumer_id"]: _location.state.consumer.consumer_id});
          }
        }
        catch (error) {}
        }, [_location.state])

    useEffect(() => {
        if (project.from_quotation.length === 17 && quotationSearchResults.includes(project.from_quotation)) {
            axios.get(urls['searchSpecificQuotationURL'], {params: {
                quotation_number: project.from_quotation.toUpperCase()
            }})
          .then(response => {
            console.log(response);
            setProject((project) => ({
                ...project,
                ...response.data
            }))
            // setQuotationSearchResults(response.data);
          })
          .catch(error => {
            console.error('Error fetching search results:', error);
          });
        }
        else if (project.from_quotation.length >= 3) {
          // Make API call to get search results
          axios.get(urls['searchQuotationURL'], {params: {
            partial_quotation_number: project.from_quotation.toUpperCase()
              }})
            .then(response => {
              setQuotationSearchResults(response.data);
            })
            .catch(error => {
              console.error('Error fetching search results:', error);
            });
        } else {
          setQuotationSearchResults([]);
        }
        
        
      }, [project.from_quotation]);
    

    const handleRemoveDocument = (index:string) => {
        setProject({ ...project, ["other_documents_names"]: project["other_documents_names"].filter((item, i) => i !== parseInt(index)) });
        setFiles((files) => ({
          ...files,
          ["other_documents"]: files["other_documents"].filter((item, i) => i !== parseInt(index))
        }));
      }

    const handleInputChange = (name: string, value: string) => {
        setProject((project) => ({
            ...project,
            [name]:  value
          }));
          console.log(name, value, project)
      }

      const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault(); 

        const postObject = new FormData();
        console.log(files);
        for (const [filename, file] of Object.entries(files)) {
            console.log(filename)
            if (filename == "other_documents") {
              for (let i=0; i<file.length; i++) {
                postObject.append(i.toString(), file[i], project.other_documents_names[i]);
              }
            }
            else {
              postObject.append(filename, file);
            }
          }
        
    
        for (const [key, value] of Object.entries(project)) {
          postObject.append(key, value);
        }
        
        axios.post(urls['createProjectURL'], postObject)
          .then(response => {
            if (response.data["success"] == true) {
              goToProject(project);
            }
            else {
              console.log(response.data);
            }    
        }
              )
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

      const handleFileChange = (event:any) => {
        // setFiles((files) => ({
        //   ...files,
        //   [event.target.name]: event.target.files[0],
        // }));
        console.log(event.target.name, event.target.files)


        if (event.target.name == "property_tax" || event.target.name == "electricity_bill" || event.target.name == "cancelled_cheque") {
            setFiles({...files, [event.target.name]: event.target.files[0]});
          }
          else if (event.target.name == "other_documents"){
            setFiles((files) => ({
              ...files,
              [event.target.name]: [...(files[event.target.name] || []), event.target.files[0]]
            }));
            setProject({ ...project, ["other_documents_names"]: [...(project["other_documents_names"] || []), event.target.files[0].name] });
          }
        
      }

    return (
        <div className='table-data' style={{ paddingTop: 64 }}>
        {currentPage === 1 &&
         <form onSubmit={handleSubmit}>
         <Table>
           <TableBody>
             <TableRow>
               <TableCell>
                 <InputLabel>Generate project from which quotation</InputLabel>
               </TableCell>
               <TableCell>
               <FormControl sx={{ m: 1, minWidth: 220 }}>
               <SelectListWithText searchResults={quotationSearchResults} value={project.from_quotation} change={handleInputChange} label="Select Quotation"/>
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
        
        }
        {
          currentPage === 2 &&
          <form onSubmit={handleSubmit}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Property Tax</InputLabel>
                        </TableCell>
                        <TableCell>
                            <Button
                            variant="contained"
                            component="label"
                            >
                            Upload Property Tax
                            <input type="file" name="property_tax" onChange={handleFileChange} hidden/> 
                            </Button>
                        
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Electricity Bill</InputLabel>
                        </TableCell>
                        <TableCell>
                            <Button
                            variant="contained"
                            component="label"
                            >
                            Upload Electricity Bill
                            <input type="file" name="electricity_bill" onChange={handleFileChange} hidden/> 
                            </Button>
                        
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Meter Number</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Meter Number"
                                type="text"
                                name="meter_number"
                                value={project.meter_number}
                                onChange={(e)=>handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Current Phase</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Current Phase"
                                type="text"
                                name="current_phase"
                                value={project.current_phase}
                                onChange={(e)=>handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Current Sanctioned Load</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Current Sanctioned Load"
                                type="text"
                                name="current_sanctioned_load"
                                value={project.current_sanctioned_load}
                                onChange={(e)=>handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Average Consumption of Unit</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Average Consumption of Unit"
                                type="text"
                                name="average_consumption_of_unit"
                                value={project.average_consumption_of_unit}
                                onChange={(e)=>handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Consumer Number</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Consumer Number"
                                type="text"
                                name="consumer_number"
                                value={project.consumer_number}
                                onChange={(e)=>handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Cancelled Cheque</InputLabel>
                        </TableCell>
                        <TableCell>
                            <Button
                            variant="contained"
                            component="label"
                            >
                            Upload Cancelled Cheque
                            <input type="file" name="cancelled_cheque" onChange={handleFileChange} hidden/> 
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
                        <input type="file" name="other_documents" onChange={handleFileChange} hidden/>
                        </Button>
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell>
                        <InputLabel>Uploaded Documents</InputLabel>
                        </TableCell>
                        <TableCell>
                        <List>
                            {project["other_documents_names"].map((documentName, index) => (
                                <ListItem key={index}>
                                <ListItemText primary={documentName} />
                                <Button
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
        }
        {
          currentPage === 3 &&
          <form onSubmit={handleSubmit}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Project Address</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Project Address"
                                type="text"
                                name="project_address"
                                value={project.project_address}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <InputLabel>Latitude</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Latitude"
                                type="text"
                                name="latitude"
                                value={project.latitude}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <InputLabel>Longitude</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Longitude"
                                type="text"
                                name="longitude"
                                value={project.longitude}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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
        }
        {
          currentPage === 4 &&
          <form onSubmit={handleSubmit}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Total Kilowatts</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Total Kilowatts"
                                type="text"
                                name="total_kilowatts"
                                value={project.total_kilowatts}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <InputLabel>Solar Panel Type</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Solar Panel Type"
                                type="text"
                                name="solar_panel_type"
                                value={project.solar_panel_type}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <InputLabel>Project Cost</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Project Cost"
                                type="text"
                                name="project_cost"
                                value={project.project_cost}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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
        }
        {
          currentPage === 5 &&
          <form onSubmit={handleSubmit}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <InputLabel>Deposit Amount</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Deposit Amount"
                                type="text"
                                name="deposit_amount"
                                value={project.deposit_amount}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <InputLabel>Remaining Balance</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Remaining Balance"
                                type="text"
                                name="remaining_balance"
                                value={project.remaining_balance}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <InputLabel>Deposited Money in Words</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Deposited Money in Words"
                                type="text"
                                name="deposited_money_in_words"
                                value={project.deposited_money_in_words}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <InputLabel>Payment Type</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Payment Type"
                                type="text"
                                name="payment_type"
                                value={project.payment_type}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <InputLabel>Transaction Number</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Transaction Number"
                                type="text"
                                name="transaction_number"
                                value={project.transaction_number}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <InputLabel>Bank Details with Branch</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Bank Details with Branch"
                                type="text"
                                name="bank_details_with_branch"
                                value={project.bank_details_with_branch}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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
        }
        {
          currentPage === 6 &&
          <form onSubmit={handleSubmit}>
            <Table>
                <TableBody>
                    `<TableRow>
                        <TableCell>
                            <InputLabel>Registration Number</InputLabel>
                        </TableCell>
                        <TableCell>
                            <TextField
                                label="Registration Number"
                                type="text"
                                name="national_portal_registration_number"
                                value={project.national_portal_registration_number}
                                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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
                            <button type="button" onClick={(e) => handleSubmit(e)}>
                                Submit
                            </button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          </form>
        }
    </div>
    )
}
export default StartProject
