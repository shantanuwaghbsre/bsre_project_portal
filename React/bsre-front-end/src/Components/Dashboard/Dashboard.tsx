import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './style.css';
import Loading from "../Loading/Loading";
import SearchIcon from '@mui/icons-material/Search';


const Dashboard = (props: any) => {
  axios.defaults.headers.common['token'] = props.token
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(Number);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  // this will be use for disable input field while searching
  const [isDisabled, setIsDisabled] = useState(true);


  const fetchData = async (page: number, limit: number) => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/getAllProjects?page=${page + 1}&limit=${limit}`);
      setProjects(response.data['projects']);
      setTotalPages(response.data['totalPages']);
      setLoading(false);
      setIsDisabled(false);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);
  // Handel Search for Records
  const handleSearch = (event: any) => {
    const val = event.target.value;
    if (val.length > 0) {
      setIsSearching(true);
      setSearchTerm(val);
    }
    else {
      setIsSearching(false);
    }
  }
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setLoading(true);
  };
  return (
    <>
      {loading ?
        <div style={{ display: 'flex', borderRadius: '50%', justifyContent: 'center', alignItems: 'center', height: '90vh', }}>
          <Loading />
        </div>
        :
        <div className='table-data'>
          <div className="search-place">

            <input className='search' type="text" disabled={isDisabled} onChange={(e) => handleSearch(e)} placeholder="Search For Record" />
            <div className='search-icon' aria-label="search">
              <SearchIcon />
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {projects.length ? Object.keys(projects[0]).map((key) => (
                    <TableCell style={{ color: 'black', fontWeight: 'bold', fontSize: '17px' }} key={key}>{key.replace(/_/g, ' ')[0].toUpperCase() + key.replace(/_/g, ' ').slice(1)}</TableCell>
                  )) :
                    <>
                      <TableCell colSpan={8} className="Records_Not_Found">
                        <p style={{ fontSize: '14px' }}>Records Not Found</p>
                        <p style={{ color: 'red', fontSize: '12px' }}>Error 500:Internal Server Error</p>
                      </TableCell>
                    </>
                  }
                  {
                    projects.length != 0 ? <TableCell style={{ color: 'black', fontWeight: 'bold', fontSize: '17px' }}>Action</TableCell> : null
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  !isSearching ? projects.length ? projects.map((row, index) => (
                    <TableRow key={index}>
                      {Object.keys(row).map((key) => (
                        <TableCell key={key}>{row[key] ? String(row[key]) : ""}</TableCell>
                      ))}
                      <TableCell>
                        <Button className='btn btn-info' component={Link} to={{ pathname: '/ViewProject' }} state={{ "consumer_number": projects[index].consumer_number, "project_in_phase": projects[index].project_in_phase, "for_consumer_id": projects[index].for_consumer_id }}>View</Button>
                      </TableCell>
                    </TableRow>

                  )) : <TableRow />
                    : Object.values(projects).filter((index) => {
                      if (searchTerm === "") {
                        return index;
                      }
                      else if (index.consumer_number.toLowerCase().includes(searchTerm.toLowerCase()) || index.consumer_number.toUpperCase().includes(searchTerm.toUpperCase())) {
                        return index;
                      }
                    }).length ? Object.values(projects).filter((index) => {
                      if (searchTerm === "") {
                        return index;
                      }
                      else if (index.consumer_number.toLowerCase().includes(searchTerm.toLowerCase()) || index.consumer_number.toUpperCase().includes(searchTerm.toUpperCase())) {
                        return index;
                      }
                    }).map((row, index) => {
                      return (
                        <TableRow key={index}>
                          {Object.keys(row).map((key) => (
                            <TableCell key={key}>{row[key] ? String(row[key]) : ""}</TableCell>
                          ))}
                          <TableCell>
                            <Button className='btn btn-info' component={Link} to={{ pathname: '/ViewProject' }} state={{ "consumer_number": projects[index].consumer_number, "project_in_phase": projects[index].project_in_phase, "for_consumer_id": projects[index].for_consumer_id }}>View</Button>
                          </TableCell>
                        </TableRow>
                      )
                    }) :
                      <TableRow>
                        <TableCell colSpan={8} className="Records_Not_Found">Records Not Found</TableCell>
                      </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination className='table-data'
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => handleChangePage(event, newPage)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      }
    </>
  );
}
export default Dashboard