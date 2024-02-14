import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(Number)

  const fetchData = async (page: number, limit: number) => {
    try {
      const response = await axios.get(`http://192.168.29.62:5000/getAllProjects?page=${page+1}&limit=${limit}`);
      // const response = await axios.get(`http://localhost:5000/getAllProjects?page=${page+1}&limit=${limit}`);
      setProjects(response.data['projects']);
      setTotalPages(response.data['totalPages']);
      setLoading(false);
      console.log(response.data);
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
              {projects.length ? Object.keys(projects[0]).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              )) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.length?projects.map((row, index) => (
              <TableRow key={index}>
                {Object.keys(row).map((key) => (
                  <TableCell key={key}>{row[key]?String(row[key]):""}</TableCell>
                ))}
                <TableCell>
                <Button component={Link} to={{ pathname: '/ViewProject' }} state={{"consumer_number":projects[index].consumer_number, "project_in_phase":projects[index].project_in_phase, "for_consumer_id":projects[index].for_consumer_id}}>View this Project</Button>
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
}
export default Dashboard