import React, { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface FileDownloaderProps {
  apiUrl: string;
  downloadOptions: {
    document_required: string,
    id: string
};
  options: { label: string; value: string }[];
}

const FileDownloader: React.FC<FileDownloaderProps> = (props) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleDownload = () => {
    props.downloadOptions.document_required = selectedOption
    // Initiate GET request with selectedOption as a parameter
    axios({
      method: 'get',
      url: props.apiUrl,
      responseType: 'blob',
      params: props.downloadOptions
    })
      .then((response) => {
        // Create a temporary URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', selectedOption + '.pdf');
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
        {props.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button onClick={handleDownload}>Download File</button>
    </div>
  );
};

export default FileDownloader;