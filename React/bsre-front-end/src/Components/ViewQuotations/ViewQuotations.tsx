import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from "../Loading/Loading";
import SearchIcon from '@mui/icons-material/Search';

const ViewQuotations = (props: any) => {
  axios.defaults.headers.common['token'] = props.token
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(Number);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  // this will be use for disable input field while searching
  const [isDisabled, setIsDisabled] = useState(true);

  const fetchData = async (page: number, limit: number) => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/getAllQuotations?page=${page + 1}&limit=${limit}`);
      setQuotations(response.data['quotations']);
      setTotalPages(response.data['totalPages']);
      setIsDisabled(false);
      console.log(response.data);
      setLoading(false);
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
            <div className='search-icon' aria-label="search" >
              <SearchIcon />
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {
                    quotations.length ? Object.keys(quotations[0]).map((key) => (
                      ["Consumer name", "Agent name", "Total kilowatts", "Structure", "Solar panel type", "Quotation type"].includes(key) ?
                        // ["Agent code","Agent name","Consumer address","Consumer email","Consumer mobile number","Consumer name","DISCOM/Torrent","GEB agreement fees","GUVNL amount","Installation AC MCB switch charges","Location","Net GUVNL system price","Number of panels"].includes(key) ?
                        <TableCell style={{ color: 'black', fontWeight: 'bold', fontSize: '17px' }} key={key}>{key}</TableCell>
                        : null
                    )) : 
                    <>
                      <TableCell colSpan={8} className="Records_Not_Found">
                        <p style={{ fontSize: '14px' }}>Records Not Found</p>
                        <p style={{ color: 'red', fontSize: '12px' }}>Error 500:Internal Server Error</p>
                      </TableCell>
                    </>
                    }
                  {
                    quotations.length != 0 ? <TableCell style={{ color: 'black', fontWeight: 'bold', fontSize: '17px' }}>Action</TableCell> : null
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {!isSearching ?
                  quotations.length ? quotations.map((row, index) => (
                    <TableRow key={index}>
                      {Object.keys(row).map((key) => (
                        ["Consumer name", "Agent name", "Total kilowatts", "Structure", "Solar panel type", "Quotation type"].includes(key as string) ?
                          <TableCell key={key}>{row[key] ? String(row[key]) : ""}</TableCell> :
                          null
                      ))}
                      <TableCell>
                        <Button className='btn btn-info' component={Link} to={{ pathname: '/ConsumerOnboarding', }} state={{ "quotation": quotations[index] }}>Onboard this Customer</Button>
                      </TableCell>
                    </TableRow>
                  )) : <TableRow />
                  :
                  Object.values(quotations).filter((index) => {
                    if (searchTerm == "") {
                      return index;
                    }
                    else if (index['Agent name'].toLowerCase().includes(searchTerm.toLowerCase())) {
                      return index;
                    }
                  }).length ?
                    Object.values(quotations).filter((index) => {
                      if (searchTerm == "") {
                        return index;
                      }
                      else if (index['Agent name'].toLowerCase().includes(searchTerm.toLowerCase())) {
                        return index;
                      }
                    }).map((row, index) => {
                      return (
                        <TableRow key={index}>
                          {Object.keys(row).map((key) => (
                            ["Consumer name", "Agent name", "Total kilowatts", "Structure", "Solar panel type", "Quotation type"].includes(key as string) ?
                              <TableCell key={key}>{row[key] ? String(row[key]) : ""}</TableCell> : null
                          ))}
                          <TableCell>
                            <Button className='btn btn-info' component={Link} to={{ pathname: '/ConsumerOnboarding', }} state={{ "quotation": quotations[index] }}>Onboard this Customer</Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                    :
                    <TableRow>
                      <TableCell colSpan={8} className="Records_Not_Found">Records Not Found</TableCell>
                    </TableRow>
                }
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

      }
    </>
  );
};

export default ViewQuotations;
