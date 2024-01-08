import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import FileDownloader from '../FileDownloader/FileDownloader';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';


const ViewConsumer = () => {
    let location = useLocation();
    const [consumer, setConsumer] = useState({});
    useEffect(() => {
        try {
          if (location.state) {
            setConsumer(location.state.consumer);
          }
        }
        catch (error) {}
        }, [location.state])
    
    const [documentRequired, setDocumentRequired] = useState('');

  function handleDownload(): void {
      let blob = new Blob([])
      if ((typeof(consumer[documentRequired])) == 'string') {
        const base64String = consumer[documentRequired];
      
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
        else {
          blob = new Blob([project.phase_5[documentRequired]]);
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
  const options=[
            { label: 'Aadhar card', value: 'aadhar_card' },
            { label: 'Pan card', value: 'pan_card' },
            { label: 'Passport photo', value: 'passport_photo' },
            { label: 'Other document', value: 'other_document' },
  ]

    return (
    <div>
        <Table>
      <TableHead>
        <TableRow>
          <TableCell>Attribute</TableCell>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Aadhar Card Number</TableCell>
          <TableCell>{consumer["aadhar_card_number"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alternate Phone Number</TableCell>
          <TableCell>{consumer["alternate_phone_number"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Consumer Address</TableCell>
          <TableCell>{consumer["consumer_address"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Consumer Email</TableCell>
          <TableCell>{consumer["consumer_email"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Consumer ID</TableCell>
          <TableCell>{consumer["consumer_id"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Consumer Mobile Number</TableCell>
          <TableCell>{consumer["consumer_mobile_number"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Consumer Name</TableCell>
          <TableCell>{consumer["consumer_name"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Onboarded by Agent Code</TableCell>
          <TableCell>{consumer["onboarded_by_agent_code"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>PAN Card Number</TableCell>
          <TableCell>{consumer["pan_card_number"]}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
          <Select label="Document Required" 
          value={documentRequired}
          onChange={(e) => {
            setDocumentRequired(e.target.value);
          }}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleDownload}>Download</Button>
        <br/>
        <Button component={Link} to="/StartProject" color="inherit" state={{consumer: consumer}} >Start New Project</Button>
    </div>
  )
}

export default ViewConsumer