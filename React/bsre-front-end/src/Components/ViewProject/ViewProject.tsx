import axios from 'axios';
import React, { FormEvent, MouseEvent, useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import SelectListWithText from '../SelectListWithText/SelectListWithText';
import { Table, TableBody, TableRow, TableCell, InputLabel, FormControl, Button, TextField, Paper, MenuItem, Select, TableContainer, TableHead } from '@mui/material';
import CheckBox from '@mui/material/Checkbox';
import FileDownloader from '../FileDownloader/FileDownloader';
import { Label } from '@mui/icons-material';

const ViewProject = () => {
    const urls = {

    }
    const phase_8_document_options = [
      {"key_":"agreement_residential", "label":"Residential Agreement National Portal"},
      {"key_":"agreement_industrial", "label":"Industrial Agreement"},
      {"key_":"certificate_1", "label":"One Page Self Certificate"},
      {"key_":"certificate_4", "label":"Four Page Self Certificate"},
    ]
    let location = useLocation();
    const [project, setProject] = useState<{ [key: string]: { [key: string]: any } }>({
      phase_1: {
        property_tax: '',
        electricity_bill: '',
        meter_number: '',
        current_sanctioned_load: '',
        average_consumption_of_unit: '',
        consumer_number: '',
        consumer_name: '',
        cancelled_cheque: '',
        other_document: '',
        project_type: '',
        project_address: '',
        latitude: '',
        longitude: '',
        total_kilowatts: '',
        solar_panel_type: '',
        project_cost: '',
        deposit_amount: '',
        remaining_balance: '',
        deposited_money_in_words: '',
        payment_type: '',
        transaction_number: '',
        bank_details_with_branch: '',
        national_portal_registration_number: '',

      },
      phase_2: {
        consumer_number: '',
        discom_approval: '',
        notes: [],
      },
      phase_3: {
        consumer_number: '',
        notes: [],
        client_approved_cad: '',
      },
      phase_4: {
        consumer_number: '',
        notes: [],
        structure_ready: '',
      },
      phase_5: {
        consumer_number: '',
        notes: [],
        geda_approval: '',
        electrical_diagram: new Blob(),
      },
      phase_6: {
        consumer_number: '',
        notes: [],
        ready_to_transport: '',
      },
      phase_7: {},
      phase_8: {
        consumer_number: '',
      },
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [editable, setEditable] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
    const [file, setFile] = useState<File>();
    const [newNote, setNewNote] = useState('');
    const [fileChoice, setFileChoice] = useState(['', '']);
    const [panelDetails, setPanelDetails] = useState<{  [key: string]: any } >({
      efficiency: 0,
      panel_type: '',
      panel_serial_number: '',
      panel_manufacturer: '',
    });
    const [residentialAgreementValues, setResidentialAgreementValues] = useState<{  [key: string]: any } >({});
    const [industrialAgreementValues, setIndustrialAgreementValues] = useState<{ [key: string]: any }>({});
    const [onePageCertificateValues, setOnePageCertificateValues] = useState<{ [key: string]: any }>({});
    const [fourPageCertificateValues, setFourPageCertificateValues] = useState<{ [key: string]: any }>({});

    useEffect(() => {
      // console.log(project.phase_1.solar_panel_type)
        try {
          if (location.state) {
            console.log("location.state - ", location.state)
            setCurrentPage(location.state.project_in_phase);
            try {
              axios.get(`http://localhost:5000/getProject?consumer_number=${location.state.consumer_number}`).then(
                (response) => {
                    console.log("panel type", response.data.phase_1.solar_panel_type);
                  axios.get(`http://localhost:5000/getPanelDetails?solar_panel_type=${response.data.phase_1.solar_panel_type}`).then(
                    (response_panel) => {
                      setPanelDetails(response_panel.data);
                      console.log("panel details", response_panel.data);
                }
              )
                axios.get(`http://localhost:5000/getConsumerDetails?consumer_id=${location.state.for_consumer_id}`).then(
                  (response) => {
                    
                  }
                )
                  setProject(response.data);
                  setIsLoading(false);
                  setCurrentPage(Number(response.data.phase_1.project_in_phase));
                }
              )              
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }
        }
        catch (error) {}
        }, [])

    useEffect(() => {
      setResidentialAgreementValues({
        "document_required":'agreement',
        "document_type":'residential',
        "date":new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear(),
        "consumer_name":project.phase_1.consumer_name,
        "consumer_number":project.phase_1.consumer_number,
        "discom":'',
        "installation_address":project.phase_1.project_address,
        "total_capacity":project.phase_1.total_kilowatts,
        "solar_module_make":'',
        "solar_module_model":'',
        "solar_module_wattage":0,
        "efficiency":panelDetails.efficiency,
        "solar_module_wattage_in_kw":residentialAgreementValues.solar_module_wattage/1000,
        "total_cost":project.phase_1.project_cost,
        "advance_payment":'',
        "payment_before_dispatch":'',
        "payment_after_installation":'',
      })
    }, [project.phase_1, panelDetails]);

  
  const handleEditable = (page: number) => {
    setEditable((prevEditable) => {
      const newEditable = [...prevEditable];
      newEditable[page - 1] = !newEditable[page - 1];
      return newEditable;
    });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Number(prevPage) - 1);
    setEditable([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
    // throw new Error('Function not implemented.');
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Number(prevPage) + 1);
    setEditable([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
    // throw new Error('Function not implemented.');
  }

  const promoteToNextPhase = () => {
    axios.post('http://localhost:5000/promoteToNextPhase', { consumer_number: project.phase_1.consumer_number, project_in_phase: project.phase_1.project_in_phase }).then(
      (response) => {
        console.log(response.data);
        if (response.data.success) {
          setCurrentPage((prevPage) => Number(prevPage) + 1);
          setEditable([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
          axios.get(`http://localhost:5000/getProject?consumer_number=${project.phase_1.consumer_number}`).then(
            (response_project) => {
              console.log(response_project);
              setProject(response_project.data);
              setIsLoading(false);
            }
          )
        }
      }
    )
  }

  function handleInputChange(key: string, value: any): void {
    if (key == "notes") {
      setProject((prevProject) => ({
        ...prevProject,
        ["phase_" + currentPage]: {
           ...prevProject["phase_" + currentPage],
           [key]: project["phase_" + currentPage][key]=== null? value : project["phase_" + currentPage][key] + "\n\n" + value
          }
      }))
      setNewNote('');
    }
    else {
      setProject((prevProject) => ({
        ...prevProject,
        ["phase_" + currentPage]: {
           ...prevProject["phase_" + currentPage],
           [key]: value
          }
      }))
      console.log(project);
    }
  }

  function handleSave(currentPage: number): void {
    if (currentPage == project.phase_1.project_in_phase) {
      console.log("handle save reached")
      const postObject = new FormData();
      for (const [key, value] of Object.entries(project["phase_" + currentPage])) {
        postObject.append(key, value);
      }
      postObject.append("consumer_number", project.phase_1.consumer_number);
      postObject.append("project_in_phase", project.phase_1.project_in_phase);

      axios.post('http://localhost:5000/updatePhaseData', postObject).then(
      response => {
        console.log(response);
      }
      )
    }
    else {
      // check rights and add approval logic
      console.log("handle save reached for non current phase")
      const postObject = new FormData();
      for (const [key, value] of Object.entries(project["phase_" + currentPage])) {
        postObject.append(key, value);
      }
      postObject.append("consumer_number", project.phase_1.consumer_number);
      postObject.append("project_in_phase", currentPage);

      axios.post('http://localhost:5000/updatePhaseData', postObject).then(
      response => {
        console.log(response);
      }
      )
    }
    
    setEditable([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
  }

  function handleDownload(documentRequired: string, documentType: string): void {
    let blob = new Blob([])
    if (project.phase_1.project_in_phase === 5 && (typeof(project.phase_5[documentRequired])) == 'string') {
      const base64String = project.phase_5[documentRequired];
    
      try {
        // Decode the Base64 string to binary data
        const binaryString = atob(base64String);
    
        // Convert the binary string to a Uint8Array
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          uint8Array[i] = binaryString.charCodeAt(i);
        }

        // Create a Blob from the Uint8Array
        blob = new Blob([uint8Array]);
      }
      catch (error) {
        console.error('Error decoding base64 string:', error);
      }}
    else if (project.phase_1.project_in_phase === 8) {
      let urlAppend = ``
      if (documentRequired === 'agreement') {
        if (documentType === 'residential') {
          setResidentialAgreementValues({
            "consumer_name":project.phase_1.consumer_name,
            "consumer_number":project.phase_1.consumer_number,
            "discom":null,
            "installation_address":project.phase_1.project_address,
            "total_capacity":project.phase_1.total_kilowatts,
            "solar_module_make":null,
            "solar_module_model":null,
            "solar_module_wattage":null,
            "efficiency":panelDetails.efficiency,
            "solar_module_wattage_in_kw":null,
            "total_cost":project.phase_1.project_cost,
            "advance_payment":project.phase_1.deposit_amount,
            "payment_before_dispatch":0,
            "payment_after_installation":0,
          })
          
          for (let i in residentialAgreementValues) {
            urlAppend += `&${i}=${residentialAgreementValues[i]}`
          }
        }
        console.log(`http://localhost:5000/downloadFile?
        //   document_required=${documentRequired}&
        //   document_type=${documentType}&
        //   consumer_number=${project.phase_1.consumer_number}&
        //   `+urlAppend)

        // axios.get(`http://localhost:5000/downloadFile?
        //   document_required=${documentRequired}&
        //   document_type=${documentType}&
        //   consumer_number=${project.phase_1.consumer_number}&
        //   `+urlAppend).then(
        //     (response_project) => {
        //       console.log(response_project);
        //       setProject(response_project.data);
        //       setIsLoading(false);
        //     }
        //   )
      }
      
    }
    else {
        blob = new Blob([project["phase_" + project.phase_1.project_in_phase][documentRequired]]);
      }
      // Create a download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `${documentRequired}.pdf`);
      link.target = '_blank';
  
      // Append the link to the document and trigger the click event
      document.body.appendChild(link);
      link.click();
  
      // Remove the link from the document
      document.body.removeChild(link);
    }

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFile(event.target.files[0]);
  // }

  // const handleUpload = (event: React.MouseEvent<HTMLInputElement>) => {
    
  //   axios.post("http://localhost:5000/upload", {"file": file}, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   }).then(response => {
  //       console.log(response.data);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }
    

    return (
      <div style={{ paddingTop: 64 }}>
        <h2>Phase {currentPage}</h2>
        {!editable[currentPage - 1]?<Button onClick={()=>handleEditable(currentPage)}>Edit</Button>:<Button onClick={()=>handleSave(currentPage)}>Save</Button>}
      {currentPage == 1 && !isLoading &&
      <form>
       <Table>
         <TableBody>
          <TableRow>
            <TableCell>
              <InputLabel>Meter Number</InputLabel>
            </TableCell>
            <TableCell>
            {editable[currentPage - 1]?<TextField onChange={(event) => handleInputChange('meter_number', event.target.value)} value={project.phase_1.meter_number} disabled={!editable[currentPage - 1]} />:project.phase_1.meter_number}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Current Sanctioned Load</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) =>
                    handleInputChange('current_sanctioned_load', event.target.value)
                  }
                  value={project.phase_1.current_sanctioned_load}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.current_sanctioned_load
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Average Consumption of Unit</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) =>
                    handleInputChange('average_consumption_of_unit', event.target.value)
                  }
                  value={project.phase_1.average_consumption_of_unit}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.average_consumption_of_unit
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Consumer Number</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) =>
                    handleInputChange('consumer_number', event.target.value)
                  }
                  value={project.phase_1.consumer_number}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.consumer_number
              )}
            </TableCell>
          </TableRow>


          <TableRow>
            <TableCell>
              <InputLabel>Project Type</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('project_type', event.target.value)}
                  value={project.phase_1.project_type}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.project_type
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Project Address</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('project_address', event.target.value)}
                  value={project.phase_1.project_address}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.project_address
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Latitude</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('latitude', event.target.value)}
                  value={project.phase_1.latitude}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.latitude
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Longitude</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('longitude', event.target.value)}
                  value={project.phase_1.longitude}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.longitude
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Total Kilowatts</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('total_kilowatts', event.target.value)}
                  value={project.phase_1.total_kilowatts}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.total_kilowatts
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Solar Panel Type</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('solar_panel_type', event.target.value)}
                  value={project.phase_1.solar_panel_type}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.solar_panel_type
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Project Cost</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('project_cost', event.target.value)}
                  value={project.phase_1.project_cost}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.project_cost
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Deposit Amount</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('deposit_amount', event.target.value)}
                  value={project.phase_1.deposit_amount}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.deposit_amount
              )}
            </TableCell>
          </TableRow>


          <TableRow>
            <TableCell>
              <InputLabel>Remaining Balance</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('remaining_balance', event.target.value)}
                  value={project.phase_1.remaining_balance}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.remaining_balance
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Deposited Money in Words</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('deposited_money_in_words', event.target.value)}
                  value={project.phase_1.deposited_money_in_words}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.deposited_money_in_words
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Payment Type</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('payment_type', event.target.value)}
                  value={project.phase_1.payment_type}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.payment_type
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Transaction Number</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('transaction_number', event.target.value)}
                  value={project.phase_1.transaction_number}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.transaction_number
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Bank Details with Branch</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('bank_details_with_branch', event.target.value)}
                  value={project.phase_1.bank_details_with_branch}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.bank_details_with_branch
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>National Portal Registration Number</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('national_portal_registration_number', event.target.value)}
                  value={project.phase_1.national_portal_registration_number}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.national_portal_registration_number
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>From Quotation</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('from_quotation', event.target.value)}
                  value={project.phase_1.from_quotation}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.from_quotation
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Project Email</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('project_email', event.target.value)}
                  value={project.phase_1.project_email}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.project_email
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Project in Phase</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('project_in_phase', event.target.value)}
                  value={project.phase_1.project_in_phase}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.project_in_phase
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={2} align='right'>
            </TableCell>
          </TableRow>

          <TableRow>
          <TableCell align='left'>
            <button type="button" onClick={handlePreviousPage}>
              Previous
            </button>
          </TableCell>
          <TableCell align='right'>
          {currentPage < project.phase_1.project_in_phase?
            <button type="button" onClick={handleNextPage}>
              Next
            </button>:
            <button type="button" onClick={promoteToNextPhase}>
            Promote
          </button>}
          </TableCell>
          </TableRow>
         </TableBody>
       </Table>
      </form>
      }
      {
      project.phase_2 && currentPage === 2 && !isLoading &&
      <form>
          <Table>
            <TableBody>
            <TableRow>
              <TableCell>
                <InputLabel>Consumer Number</InputLabel>
              </TableCell>
              <TableCell>
                {editable[currentPage - 1] ? (
                  <TextField
                    onChange={(event) => handleInputChange('consumer_number', event.target.value)}
                    value={project.phase_2.consumer_number}
                    disabled={!editable[currentPage - 1]}
                  />
                ) : (
                  project.phase_2.consumer_number
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Discom Approval</InputLabel>
              </TableCell>
              <TableCell>
                <CheckBox checked={project.phase_2.discom_approval} onClick={() => handleInputChange('discom_approval', !project.phase_2.discom_approval)} disabled={!editable[currentPage - 1]}/>
                {project.phase_2.discom_approval}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <InputLabel>Notes</InputLabel>
              </TableCell>
              <TableCell>
              <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={project.phase_2.notes} disabled/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell/>
              <TableCell>
                <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={newNote} onChange={(e) => setNewNote(e.target.value)} disabled={!editable[currentPage - 1]}/>
                <Button onClick={() => handleInputChange("notes", newNote)} disabled={!editable[currentPage - 1]}>Add Note</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>
                <button type="button" onClick={handlePreviousPage}>
                  Previous
                </button>
              </TableCell>
              <TableCell align='right'>
              {currentPage < project.phase_1.project_in_phase?
                <button type="button" onClick={handleNextPage}>
                  Next
                </button>:
                <button type="button" onClick={promoteToNextPhase}>
                Promote
              </button>}
              </TableCell>
              </TableRow>
            </TableBody>
            </Table>
      </form>
      }
      {
      project.phase_3 && currentPage === 3 && !isLoading &&
      <form>
          <Table>
            <TableBody>
            <TableRow>
              <TableCell>
                <InputLabel>Consumer Number</InputLabel>
              </TableCell>
              <TableCell>
                {editable[currentPage - 1] ? (
                  <TextField
                    onChange={(event) => handleInputChange('consumer_number', event.target.value)}
                    value={project.phase_3.consumer_number}
                    disabled={!editable[currentPage - 1]}
                  />
                ) : (
                  project.phase_3.consumer_number
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Client CAD Approval</InputLabel>
              </TableCell>
              <TableCell>
                <CheckBox checked={project.phase_3.project_manager_approval} onClick={() => handleInputChange('project_manager_approval', !project.phase_3.project_manager_approval)} disabled={!editable[currentPage - 1]}/>
                {project.phase_3.project_manager_approval}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Notes</InputLabel>
              </TableCell>
              <TableCell>
              <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={project.phase_3.notes} disabled/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell/>
              <TableCell>
                <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={newNote} disabled={!editable[currentPage - 1]} onChange={(e) => setNewNote(e.target.value)}/>
                <Button onClick={() => handleInputChange("notes", newNote)} disabled={!editable[currentPage - 1]}>Add Note</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>
                <button type="button" onClick={handlePreviousPage}>
                  Previous
                </button>
              </TableCell>
              <TableCell align='right'>
              {currentPage < project.phase_1.project_in_phase?
                <button type="button" onClick={handleNextPage}>
                  Next
                </button>:
                <button type="button" onClick={promoteToNextPhase}>
                Promote
              </button>}
              </TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </form>
      }
      {
      project.phase_4 && currentPage === 4 && !isLoading &&
      <form>
          <Table>
            <TableBody>
            <TableRow>
              <TableCell>
                <InputLabel>Consumer Number</InputLabel>
              </TableCell>
              <TableCell>
                {editable[currentPage - 1] ? (
                  <TextField
                    onChange={(event) => handleInputChange('consumer_number', event.target.value)}
                    value={project.phase_4.consumer_number}
                    disabled={!editable[currentPage - 1]}
                  />
                ) : (
                  project.phase_4.consumer_number
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Structure Ready</InputLabel>
              </TableCell>
              <TableCell>
                <CheckBox checked={project.phase_4.structure_ready} onClick={() => handleInputChange('structure_ready', !project.phase_4.structure_ready)} disabled={!editable[currentPage - 1]}/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Notes</InputLabel>
              </TableCell>
              <TableCell>
              <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={project.phase_4.notes} disabled/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell/>
              <TableCell>
              <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={newNote} disabled={!editable[currentPage - 1]} onChange={(e) => setNewNote(e.target.value)}/>
                <Button onClick={() => handleInputChange("notes", newNote)} disabled={!editable[currentPage - 1]}>Add Note</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>
                <button type="button" onClick={handlePreviousPage}>
                  Previous
                </button>
              </TableCell>
              <TableCell align='right'>
              {currentPage < project.phase_1.project_in_phase?
                <button type="button" onClick={handleNextPage}>
                  Next
                </button>:
                <button type="button" onClick={promoteToNextPhase}>
                Promote
              </button>}
              </TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </form>
      }
      {
      project.phase_5 && currentPage === 5 && !isLoading &&
      <form>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <InputLabel>Consumer Number</InputLabel>
              </TableCell>
              <TableCell>
                {editable[currentPage - 1] ? (
                  <TextField
                    onChange={(event) => handleInputChange('consumer_number', event.target.value)}
                    value={project.phase_5.consumer_number}
                    disabled={!editable[currentPage - 1]}
                  />
                ) : (
                  project.phase_5.consumer_number
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>GEDA Approval for electric diagram</InputLabel>
              </TableCell>
              <TableCell>
                <CheckBox checked={project.phase_5.geda_approval} onClick={() => handleInputChange('geda_approval', !project.phase_5.geda_approval)} disabled={!editable[currentPage - 1]}/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Electrical Diagram</InputLabel>
              </TableCell>
              <TableCell>
                <Button
                variant="contained"
                component="label"
                >
                Upload Electrical Diagram
                <input type="file" name="electrical_diagram" onChange={(e) => handleInputChange('electrical_diagram', e.target.files[0])} hidden/> 
                </Button>
                <Button onClick={() => handleDownload("electrical_diagram", "")}>Download</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Notes</InputLabel>
              </TableCell>
              <TableCell>
              <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={project.phase_5.notes} disabled/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell/>
              <TableCell>
                <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={newNote} disabled={!editable[currentPage - 1]} onChange={(e) => setNewNote(e.target.value)}/>
                <Button onClick={() => handleInputChange("notes", newNote)} disabled={!editable[currentPage - 1]}>Add Note</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>
                <button type="button" onClick={handlePreviousPage}>
                  Previous
                </button>
              </TableCell>
              <TableCell align='right'>
              {currentPage < project.phase_1.project_in_phase?
                <button type="button" onClick={handleNextPage}>
                  Next
                </button>:
                <button type="button" onClick={promoteToNextPhase}>
                Promote
              </button>}
              </TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </form>
      }
      {
      project.phase_6 && currentPage === 6 && !isLoading &&
      <form>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <InputLabel>Consumer Number</InputLabel>
              </TableCell>
              <TableCell>
                {editable[currentPage - 1] ? (
                  <TextField
                    onChange={(event) => handleInputChange('consumer_number', event.target.value)}
                    value={project.phase_1.consumer_number}
                    disabled={!editable[currentPage - 1]}
                  />
                ) : (
                  project.phase_6.consumer_number
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Ready to Transport</InputLabel>
              </TableCell>
              <TableCell>
                <CheckBox checked={project.phase_6.ready_to_transport} onClick={() => handleInputChange('ready_to_transport', !project.phase_6.ready_to_transport)}/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Notes</InputLabel>
              </TableCell>
              <TableCell>
              <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={project.phase_6.notes} disabled/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell/>
              <TableCell>
              <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={newNote} disabled={!editable[currentPage - 1]} onChange={(e) => setNewNote(e.target.value)}/>
                <Button onClick={() => handleInputChange("notes", newNote)}>Add Note</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>
                <button type="button" onClick={handlePreviousPage}>
                  Previous
                </button>
              </TableCell>
              <TableCell align='right'>
              {currentPage < project.phase_1.project_in_phase?
                <button type="button" onClick={handleNextPage}>
                  Next
                </button>:
                <button type="button" onClick={promoteToNextPhase}>
                Promote
              </button>}
              </TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </form>
      }
      {
      project.phase_7 && currentPage === 7 && !isLoading &&
      <form>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
              <h1>SKIP FOR INVENTORY</h1>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>
                <button type="button" onClick={handlePreviousPage}>
                  Previous
                </button>
              </TableCell>
              <TableCell align='right'>
              {currentPage < project.phase_1.project_in_phase?
                <button type="button" onClick={handleNextPage}>
                  Next
                </button>:
                <button type="button" onClick={promoteToNextPhase}>
                Promote
              </button>}
              </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </form>
      }
      {
      project.phase_8 && currentPage === 8 && !isLoading &&
      <form>
        <Table>
          <TableBody>
            <TableRow>
            <Select label="Document Required" 
              value={fileChoice[0]+"_"+fileChoice[1]}
          onChange={(e) => {
            // console.log(e.target.value.split("_"));
            setFileChoice(e.target.value.split("_"));
          }}>
            {
              phase_8_document_options
              .map((option) => (
                <MenuItem key={option.key_} value={option.key_}>
                  {option.label}
                </MenuItem>
            ))}
          </Select>
            </TableRow>
            {
              fileChoice[0] == "agreement" && fileChoice[1] == "residential" && 
              <TableRow>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Information for {fileChoice[2]}</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(residentialAgreementValues).map(([field, value]) => (
                        <TableRow key={field}>
                          <TableCell>{field.replace(/_/g, ' ')}</TableCell>
                          <TableCell>
                            <TextField value={value}></TextField>
                            </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TableRow>
            }
            <TableRow>
              <TableCell>
              <Button onClick={() => handleDownload(fileChoice[0], fileChoice[1])}>Download</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>
                <button type="button" onClick={handlePreviousPage}>
                  Previous
                </button>
              </TableCell>
              <TableCell align='right'>
              {currentPage < project.phase_1.project_in_phase?
                <button type="button" onClick={handleNextPage}>
                  Next
                </button>:
                <button type="button" onClick={promoteToNextPhase}>
                Promote
              </button>}
              </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </form>
      }
    </div>
    )
}

export default ViewProject