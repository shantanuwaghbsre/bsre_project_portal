import React, { useState, ChangeEvent, useEffect } from 'react';
import { useLocation } from 'react-router';
import { TextField, Button, Grid } from '@mui/material';

type FormData = {
  [key: string]: string;
};


const FormComponent = () => {
  const blankFormData = {
    quotationType: '',
    consumerName: '',
    consumerNumber: '',
    meterNumber: '',
    consumerAddress: '',
    solarInstallationPlantAddress: '',
    googleCoordinatesLatitude: '',
    googleCoordinatesLongitude: '',
    consumerMobileNumber: '',
    alternateMobileNumber: '',
    consumerEmail: '',
    aadharCardNumber: '',
    panCardNumber: '',
    propertyTax: '',
    electricityBill: '',
    cancelCheque: '',
    otherDocuments: '',
    solarRequirement: '',
    currentSanctionedLoad: '',
    averageConsumptionOfUnit: '',
    solarPanelType: '',
    projectCost: '',
    depositedMoney: '',
    remainingBalance: '',
    depositedMoneyInWords: '',
    transactionNumber: '',
    timestamp: '',
    bankDetailsWithBranch: '',
    nationalPortalRegistrationNumber: '',
    agentOrDistributorName: '',
    agentCode:'',
    attachedDocuments: '',
    }
  const [formData, setFormData] = useState<FormData>(blankFormData);

let location = useLocation()


useEffect(() => {
    try {
      console.log(location)
      if (location.state.quotation) {
        setFormData({
        ...blankFormData,
        consumerName: location.state.quotation["Consumer name"], 
        consumerAddress: location.state.quotation["Consumer address"], 
        consumerMobileNumber: location.state.quotation["Consumer mobile number"],
        consumerEmail: location.state.quotation["Consumer email"],
        solarRequirement: location.state.quotation["Total kilowatts"], 
        solarPanelType: location.state.quotation["Solar panel type"],
        projectCost: location.state.quotation["Project cost"],
        agentOrDistributorName: location.state.quotation["Agent name"],
        agentCode:location.state.quotation["Agent code"],
        })}
      else {
        setFormData(blankFormData)
      }}
    catch (error) {}
    }, [location.state.quotation])


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("was called")
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {Object.keys(formData).map((key) => (
          <Grid item xs={12} sm={6} key={key}>
            <TextField
              fullWidth
              name={key}
              label={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FormComponent;
