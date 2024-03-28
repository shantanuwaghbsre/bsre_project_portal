import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

const ViewAllConsumers = (props: any) => {
  axios.defaults.headers.common['token'] = props.token
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(Number)


  const fetchData = async (page: number, limit: number) => {
    try {
      // const response = await axios.get(`http://localhost:5000/getAllConsumers?page=${page+1}&limit=${limit}`);
      const response = await axios.get(`http://192.168.29.62:5000/getAllConsumers?page=${page + 1}&limit=${limit}`);
      console.log(response.data);
      setConsumers(response.data['consumers']);
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
    <div className='table-data'>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {consumers.length ? Object.keys(consumers[0]).map((key) => (
                ["consumer_name", "consumer_mobile_number", "consumer_email", "onboarded_by_agent_code"].includes(key) ?
                  <TableCell style={{ color: 'black', fontWeight: 'bold',fontSize: '17px' }} key={key} >{key.replace(/_/g, ' ')[0].toUpperCase() + key.replace(/_/g, ' ').slice(1)}</TableCell> : null
              )) : null}
              <TableCell style={{ color: 'black', fontWeight: 'bold',fontSize: '17px' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consumers.length ? consumers.map((row, index) => (
              <TableRow key={index}>
                {Object.keys(row).map((key) => (
                  ["consumer_name", "consumer_mobile_number", "consumer_email", "onboarded_by_agent_code"].includes(key as string) ?
                    <TableCell key={key}>{row[key] ? String(row[key]) : ""}</TableCell> : null
                ))}
                <TableCell>
                  <Button className='btn btn-info' component={Link} to={{ pathname: '/ViewConsumer' }} state={{ "consumer": consumers[index] }}>View this Customer</Button>
                </TableCell>
              </TableRow>

            )) : <TableRow />}
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

export default ViewAllConsumers


// return (
//     <div>
//
//         View this Customer
//       </Button>
//     </div>
//   )