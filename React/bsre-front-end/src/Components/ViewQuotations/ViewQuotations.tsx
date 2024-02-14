import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ViewQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(Number)

  const fetchData = async (page: number, limit: number) => {
    try {
      // const response = await axios.get(`http://localhost:5000/getAllQuotations?page=${page+1}&limit=${limit}`);
      const response = await axios.get(`http://192.168.29.62:5000/getAllQuotations?page=${page+1}&limit=${limit}`);
      setQuotations(response.data['quotations']);
      setTotalPages(response.data['totalPages']);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setLoading(true);
  };


  return (
     <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {quotations.length?Object.keys(quotations[0]).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              )): <TableCell/>}
            </TableRow>
          </TableHead>
          <TableBody>
            {quotations.length?quotations.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, index) => (
                  <TableCell key={index}>{value?String(value):""}</TableCell>
                ))}
                <TableCell>
                  <Button component={Link} to={{ pathname: '/ConsumerOnboarding',  }} state={{"quotation":quotations[index]}}>Onboard this Customer</Button>
                  </TableCell>
              </TableRow>
              
            )):<TableRow/>}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalPages * rowsPerPage}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => handleChangePage(event, newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ViewQuotations;
