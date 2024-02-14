import axios from 'axios';
import React, { FormEvent, MouseEvent, useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { Table, TableBody, TableRow, TableCell, InputLabel, FormControl, Button, TextField, Paper, MenuItem, Select, TableContainer, TableHead } from '@mui/material';
import CheckBox from '@mui/material/Checkbox';

const ViewProject = () => {
    const urls = {

    }
    const options = [
      { "label": "Property Tax", "value": 'property_tax' },
      { "label": "Electricity Bill", "value": 'electricity_bill' },
      { "label": "Cancelled Cheque", "value": 'cancelled_cheque' },  
    ]
    const phase_2_discom_options = [
      {"key_":"DGVCL", "label":"Dakshin Gujarat Vij Company Limited"},
      {"key_":"MGVCL", "label":"Madhya Gujarat Vij Company Limited"},
      {"key_":"PGVCL", "label":"Paschim Gujarat Vij Company Limited"},
      {"key_":"UGVCL", "label":"Uttar Gujarat Vij Company Limited"},
      {"key_":"Torrent", "label":"Torrent Power Limited"},
    ]
    const phase_8_document_options = [
      {"key_":"agreement_residential", "label":"Residential Agreement"},
      {"key_":"agreement_industrial", "label":"Industrial Agreement"},
      {"key_":"certificate_1", "label":"One Page Self Certificate"},
      {"key_":"certificate_4", "label":"Four Page Self Certificate"},
    ]
    let location = useLocation();
    const [documentRequired, setDocumentRequired] = useState<string>('');
    const [project, setProject] = useState<{ [key: string]: { [key: string]: any } }>({
      phase_1: {
        property_tax: '',
        electricity_bill: '',
        cancelled_cheque: '',
        other_documents: '',
        other_documents_names: [],
        meter_number: '',
        current_sanctioned_load: '',
        average_consumption_of_unit: '',
        consumer_number: '',
        consumer_name: '',
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
        current_phase: '',
        installation_phase: '',
        location: '',
        solar_inverter_make: '',
        solar_module_wattage: '',
        number_of_panels: '',
      },
      phase_2: {
        consumer_number: '',
        discom: '',
        discom_approval: '',
        notes: '',
      },
      phase_3: {
        consumer_number: '',
        notes: '',
        client_approved_cad: '',
      },
      phase_4: {
        consumer_number: '',
        notes: '',
        structure_ready: '',
      },
      phase_5: {
        consumer_number: '',
        notes: '',
        ready_to_transport: '',
      },
      phase_6: {

      },
      phase_7: {
        consumer_number: '',
        notes: '',
        geda_approval: '',
        electrical_diagram: new Blob(),
      },
      phase_8: {
        consumer_number: '',
      },
      phase_9: {
        consumer_number: '',
        meter_report: new Blob(),
        joint_inspection: new Blob(),
      },
      phase_10: {
        consumer_number: '',
        invoice_from_accounts: new Blob(),
        dcr: '',
      }
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [editable, setEditable] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
    const [file, setFile] = useState<File>();
    const [newNote, setNewNote] = useState('');
    const [fileChoice, setFileChoice] = useState(['', '']);
    const [agreementValues, setAgreementValues] = useState<{  [key: string]: any } >({});
    const [onePageCertificateValues, setOnePageCertificateValues] = useState<{ [key: string]: any }>({});
    const [fourPageCertificateValues, setFourPageCertificateValues] = useState<{ [key: string]: any }>({});
    const [dcrValues, setDcrValues] = useState<{ [key: string]: any }>({});
    let newOptions = []
    const inputOptions = {
        agreement: ["letter_date","voltage"],
        onePageCertificate: [],
        fourPageCertificate: [],
        dcr: ["", ""],
      }

    useEffect(() => {
      // console.log(project.phase_1.solar_panel_type)
        try {
          if (location.state) {
            console.log("location.state - ", location.state)
            setCurrentPage(location.state.project_in_phase);
            try {
                            // axios.get(`http://localhost:5000/getProject?consumer_number=${location.state.consumer_number}`).then(
              axios.get(`http://192.168.29.62:5000/getProject?consumer_number=${location.state.consumer_number}`).then(
                (response) => {
                  // console.log(response.data);
                  setProject(response.data);
                  console.log(response.data);
                  setIsLoading(false);
                  setCurrentPage(Number(response.data.phase_1.project_in_phase));
                  for (let i=0; i<response.data.phase_1["other_documents_names"].length; i++) {
                    console.log(newOptions);
                    newOptions.push({ label: response.data.phase_1["other_documents_names"][i], value: response.data.phase_1["other_documents_names"][i]});
                  }
                }
              );
              }
              catch (error) {
                console.error(error);
              }           
        }}
        catch (error) {
          console.error(error);
        }}, []);
        
      useEffect(() => {
        if (project.phase_1.project_type != "Residential") {
        setAgreementValues(
          {...agreementValues, 
            "discom": project.phase_2.discom,
            "consumer_name": project.phase_1.consumer_name,
            "consumer_number": project.phase_1.consumer_number,
            "project_address": project.phase_1.project_address,
            "total_kilowatts": project.phase_1.total_kilowatts,
        });
        setDcrValues(
          {...dcrValues, 
            "consumer_name": project.phase_1.consumer_name, 
            "project_address": project.phase_1.project_address,
            "total_kilowatts": project.phase_1.total_kilowatts,
            "registration_number": project.phase_1.national_portal_registration_number,
            "discom": project.phase_2.discom,
            "solar_panel_wattage": project.phase_1.solar_panel_wattage,
            "number_of_panels": project.phase_1.number_of_panels,
          });
        }
      }, [project.phase_1, project.phase_2])

      useEffect(() => {
                // axios.get(`http://localhost:5000/getConsumerDetails?consumer_id=${location.state.for_consumer_id}`).then(
        axios.get(`http://192.168.29.62:5000/getConsumerDetails?consumer_id=${location.state.for_consumer_id}`).then(
        (response_consumer_details) => {
          console.log("consumer details", response_consumer_details.data);
          setProject((prevProject) => {
            // Retrieve the dictionary you want to modify
            const dictToUpdate = prevProject.phase_1 || {};

            // Create a copy of the dictionary
            const updatedDict = { ...dictToUpdate };

            // Set the desired key and value within the copied dictionary
            updatedDict.consumer_name = response_consumer_details.data;

            // Update the state variable with the modified dictionary
              return { ...prevProject, phase_1: updatedDict };
            });
            console.log(project.phase_1)
          });            
      }, [location.state.for_consumer_id])
      // if(!project.phase_1.consumer_name.length) {
                // axios.get(`http://localhost:5000/getConsumerDetails?consumer_id=${location.state.for_consumer_id}`).then(  
      //   axios.get(`http://192.168.29.62:5000/getConsumerDetails?consumer_id=${location.state.for_consumer_id}`).then(
        //   (response_consumer_details) => {
        //     console.log("consumer details", response_consumer_details.data);
        //     setProject((prevProject) => {
        //       // Retrieve the dictionary you want to modify
        //       const dictToUpdate = prevProject.phase_1 || {};
          
        //       // Create a copy of the dictionary
        //       const updatedDict = { ...dictToUpdate };
          
        //       // Set the desired key and value within the copied dictionary
        //       updatedDict.consumer_name = response_consumer_details.data;
          
        //       // Update the state variable with the modified dictionary
        //       return { ...prevProject, phase_1: updatedDict };
        //     });
        //     console.log(project.phase_1)
        //   });}

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
        // axios.post('http://localhost:5000/promoteToNextPhase', { consumer_number: project.phase_1.consumer_number, project_in_phase: project.phase_1.project_in_phase }).then(
    axios.post('http://192.168.29.62:5000/promoteToNextPhase', { consumer_number: project.phase_1.consumer_number, project_in_phase: project.phase_1.project_in_phase }).then(
      (response) => {
        console.log(response.data);
        if (response.data.success) {
          setCurrentPage((prevPage) => Number(prevPage) + 1);
          setEditable([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
                    // axios.get(`http://localhost:5000/getProject?consumer_number=${project.phase_1.consumer_number}`).then(
          axios.get(`http://192.168.29.62:5000/getProject?consumer_number=${project.phase_1.consumer_number}`).then(
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
    console.log(key, value, project);
    if (value == undefined){
      value = '';
    }
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

            // axios.post('http://localhost:5000/updatePhaseData', postObject).then(
      axios.post('http://192.168.29.62:5000/updatePhaseData', postObject).then(
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

            // axios.post('http://localhost:5000/updatePhaseData', postObject).then(
      axios.post('http://192.168.29.62:5000/updatePhaseData', postObject).then(
      response => {
        console.log(response);
      }
      )
    }
    
    setEditable([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
  }

  
  function handleDownload(documentRequired_: string, documentType: string): void {
    console.log("documentRequired ", documentRequired_)
    let blob = new Blob([])
    console.log(project["phase_"+currentPage], documentRequired_);
        // let url = `http://localhost:5000/downloadFile?document_required=${documentRequired}&document_type=${documentType}`
    let url = `http://192.168.29.62:5000/downloadFile?document_required=${documentRequired_}&document_type=${documentType}`
    if (documentRequired_ === "electrical_diagram" || documentRequired_ === 'meter_report' || documentRequired_ === 'joint_inspection') {
      console.log("in if 1")
      if ((project["phase_"+currentPage][documentRequired_] != false && typeof(project["phase_"+currentPage][documentRequired_]) == 'string') || (project["phase_"+currentPage][documentRequired_] != null && typeof(project["phase_"+currentPage][documentRequired_]) == 'object')) {
      console.log("in if 2 because", project["phase_"+currentPage][documentRequired_] != false, project["phase_"+currentPage][documentRequired_] != null)
      const base64String = project["phase_"+currentPage][documentRequired_];
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
      }
    }
    else {
      url += `&consumer_number=${project.phase_1.consumer_number}`
    }}
    else if (documentRequired_ === 'agreement') {
          for (let i in agreementValues) {
            url += `&${i}=${agreementValues[i]}`
          }
      }
      else if (documentRequired_ === 'certificate') {
        if (documentType === '1') {
          for (let i in onePageCertificateValues) {
            url += `&${i}=${onePageCertificateValues[i]}`
          }
        }
        else if (documentType === '4') {
          for (let i in fourPageCertificateValues) {
            url += `&${i}=${fourPageCertificateValues[i]}`
          }
        }
    }
    else if (documentRequired_ === 'dcr') {
        for (let i in dcrValues) {
          url += `&${i}=${dcrValues[i]}`
        }
        console.log(dcrValues)
  }
    // else if () {
    //   if (project.phase_7[documentRequired].length) {
    //     const base64String = project.phase_7[documentRequired];
    //     try {
    //       // Decode the Base64 string to binary data
    //       const binaryString = atob(base64String);
      
    //       // Convert the binary string to a Uint8Array
    //       const uint8Array = new Uint8Array(binaryString.length);
    //       for (let i = 0; i < binaryString.length; i++) {
    //         uint8Array[i] = binaryString.charCodeAt(i);
    //       }
  
    //       // Create a Blob from the Uint8Array
    //       blob = new Blob([uint8Array]);
    //     }
    //     catch (error) {
    //       console.error('Error decoding base64 string:', error);
    //     }
    //   }
    // }

      if (url.match(/\&/g).length > 1){
        axios.get(url).then(
          (response_project) => {
            try {
              // Decode the Base64 string to binary data
              const binaryString = atob(response_project.data);
          
              // Convert the binary string to a Uint8Array
              const uint8Array = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
              }

              // Create a Blob from the Uint8Array
              blob = new Blob([uint8Array]);
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.setAttribute('download', `${documentRequired_}.pdf`);
              link.target = '_blank';
          
              // Append the link to the document and trigger the click event
              document.body.appendChild(link);
              link.click();
          
              // Remove the link from the document
              document.body.removeChild(link);

              setProject((prevProject) => ({
                ...prevProject,
                [`phase_${currentPage}`]: {
                  ...prevProject[`phase_${currentPage}`],
                  [documentRequired_]: response_project.data
                }
              }))
            }
            catch (error) {
              console.error('Error decoding base64 string:', error);
            }

            // console.log("response data type - ", typeof(response_project.data))
            // console.log(response_project.data)
            // blob = new Blob(response_project.data);
            
          }
        )
      }
      
    }    

    return (
      <div style={{ paddingTop: 64 }}>
        <Table>
        <TableBody>
        <TableRow>
        {Array.from({ length: 10 }, (_, index) => (
          <TableCell key={index}>
            <Button
              variant={index > project.phase_1.project_in_phase -1 ? 'disabled' : currentPage - 1 === index ? 'contained' : 'outlined'}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          </TableCell>
        ))}
      </TableRow>
      </TableBody>
        </Table>
        <h2>Phase {currentPage}</h2>
        {currentPage!=8 && (!editable[currentPage - 1]?<Button onClick={()=>handleEditable(currentPage)}>Edit</Button>:<Button onClick={()=>handleSave(currentPage)}>Save</Button>)}
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
              <InputLabel>Current Phase</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) =>
                    handleInputChange('current_phase', event.target.value)
                  }
                  value={project.phase_1.current_phase}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.current_phase
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <InputLabel>Installation Phase</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) =>
                    handleInputChange('installation_phase', event.target.value)
                  }
                  value={project.phase_1.installation_phase}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.installation_phase
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
              <InputLabel>Solar Inverter Make</InputLabel>
            </TableCell>
            <TableCell>
              {editable[currentPage - 1] ? (
                <TextField
                  onChange={(event) => handleInputChange('solar_inverter_make', event.target.value)}
                  value={project.phase_1.solar_inverter_make}
                  disabled={!editable[currentPage - 1]}
                />
              ) : (
                project.phase_1.solar_inverter_make
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
            <TableCell>
            <Select label="Document Required" 
            value={documentRequired}
            onChange={(e) => {
              setDocumentRequired(e.target.value);
            }}>
              {(options.concat(newOptions)).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            </TableCell>
            <TableCell>
          <Button onClick={handleDownload}>Download</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} align='right'>
            </TableCell>
          </TableRow>

          <TableRow>
          
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
                <InputLabel>Discom Name</InputLabel>
              </TableCell>
              <TableCell>
                <Select label="Discom Name" 
                  value={project.phase_2.discom || ''}
                  onChange={(e) => {
                    handleInputChange('discom', e.target.value);
              }
              }
                  disabled={!editable[currentPage - 1]}
                  >
                {
                  phase_2_discom_options
                  .map((option) => (
                    <MenuItem key={option.key_} value={option.key_}>
                      {option.label}
                    </MenuItem>
                ))}
              </Select>
                
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
                {project.phase_5.consumer_number}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Ready to Transport</InputLabel>
              </TableCell>
              <TableCell>
                <CheckBox checked={project.phase_5.ready_to_transport} onClick={() => handleInputChange('ready_to_transport', !project.phase_5.ready_to_transport)} disabled={!editable[currentPage - 1]}/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Notes</InputLabel>
              </TableCell>
              <TableCell>
              <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={project.phase_5.notes} disabled={!editable[currentPage - 1]}/>
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
      project.phase_7 && currentPage === 7 && !isLoading &&
      <form>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <InputLabel>Consumer Number</InputLabel>
              </TableCell>
              <TableCell>
                  {project.phase_7.consumer_number}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>GEDA Approval for electric diagram</InputLabel>
              </TableCell>
              <TableCell>
                <CheckBox checked={project.phase_7.geda_approval} onClick={() => handleInputChange('geda_approval', !project.phase_7.geda_approval)} disabled={!editable[currentPage - 1]}/>
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
                disabled={!editable[currentPage - 1]}
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
              <TextField style={{maxHeight: 200, width: 1000, overflow: 'auto'}} multiline value={project.phase_7.notes} disabled/>
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
      project.phase_8 && currentPage === 8 && !isLoading &&
      <form>
        <Table>
          <TableBody>
            <TableRow>
            <Select
              value={fileChoice[0]+"_"+fileChoice[1]}
              onChange={(e) => {
            setFileChoice(e.target.value.split("_"));
          }}
              sx={{ minWidth: 320 }}>
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
              fileChoice[0] == "agreement" && 
              <TableRow>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field{fileChoice[2]}</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(inputOptions.agreement).map((field) => (
                        <TableRow key={field[0]}>
                          <TableCell>{field[1].replace(/_/g, ' ')}</TableCell>
                          <TableCell>
                            <TextField onChange={(e) => setAgreementValues({...agreementValues, [field[1]]: e.target.value})}></TextField>
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
      {
        project.phase_9 && currentPage === 9 && !isLoading &&
        <form>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <InputLabel>Consumer Number</InputLabel>
                </TableCell>
                <TableCell>
                  {project.phase_9.consumer_number}
                </TableCell>
              </TableRow>
              <TableRow>
              <TableCell>
                <InputLabel>Meter Report</InputLabel>
              </TableCell>
              <TableCell>
                <Button
                variant="contained"
                component="label"
                disabled={!editable[currentPage - 1]}
                >
                Upload Meter Report
                <input type="file" name="meter_report" onChange={(e) => handleInputChange('meter_report', e.target.files[0])} hidden/> 
                </Button>
                <Button onClick={() => handleDownload("meter_report", "")}>Download</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>Joint Inspection</InputLabel>
              </TableCell>
              <TableCell>
                <Button
                variant="contained"
                component="label"
                disabled={!editable[currentPage - 1]}
                >
                Upload Joint Inspection
                <input type="file" name="joint_inspection" onChange={(e) => handleInputChange('joint_inspection', e.target.files[0])} hidden/> 
                </Button>
                <Button onClick={() => handleDownload("joint_inspection", "")}>Download</Button>
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
        project.phase_10 && currentPage === 10 && !isLoading &&
        <form>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <InputLabel>Consumer Number</InputLabel>
                </TableCell>
                <TableCell>
                  {project.phase_10.consumer_number}
                </TableCell>
              </TableRow>
              <TableRow>
              <TableCell>
                <InputLabel>Invoice from accounts</InputLabel>
              </TableCell>
              <TableCell>
                <Button
                variant="contained"
                component="label"
                disabled={!editable[currentPage - 1]}
                >
                Upload Invoice
                <input type="file" name="invoice_from_accounts" onChange={(e) => handleInputChange('invoice_from_accounts', e.target.files[0])} hidden/> 
                </Button>
                <Button onClick={() => handleDownload("invoice_from_accounts", "")}>Download</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <InputLabel>DCR</InputLabel>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDownload("dcr", "")}>Download</Button>
              </TableCell>
            </TableRow>
              <TableRow>
              <TableCell align='left'>
                <button type="button" onClick={handlePreviousPage}>
                  Previous
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

export default ViewProject