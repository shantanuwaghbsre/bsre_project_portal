import React, { useState } from 'react';
import axios from 'axios';

const FileDownloader = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDownload = () => {
    // Initiate GET request with selectedOption as a parameter
    axios({
      method: 'get',
      url: 'http://localhost:5000/getConsumerDocuments',
      responseType: 'blob',
      params: {
        document_required: selectedOption,
        consumer_id: "741cdfd6-6ecf-41cc-a272-90c2c0a40ec0"
      },
    })
      .then((response) => {
        // Create a temporary URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', selectedOption + ".pdf");
        // Simulate a click on the link to start the download
        link.click();
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">Select an option</option>
        <option value="aadhar_card">aadhar card</option>
        <option value="pan_card">pan card</option>
        <option value="passport_photo">passport photo</option>
        <option value="other_document">other document</option>
      </select>
      <button onClick={handleDownload}>Download File</button>
    </div>

  );
};

export default FileDownloader;