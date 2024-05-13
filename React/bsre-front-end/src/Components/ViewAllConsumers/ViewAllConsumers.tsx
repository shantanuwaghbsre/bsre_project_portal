import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Loading from "../Loading/Loading";
import SearchIcon from '@mui/icons-material/Search';

const ViewAllConsumers = (props: any) => {
  //for showing columns in table record
  const columns = ["Email Address", "Mobile Number", "Consumer name", "Agent code", "Action"];
  axios.defaults.headers.common['token'] = props.token
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(Number)
  const [querywords, setQuerywords] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState("all");
  // this will be use for disable input field while searching
  const [isDisabled, setIsDisabled] = useState(true);
  const [count, setCount] = useState(0);


  const fetchData = async (page: number, limit: number) => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/getAllConsumers?page=${page + 1}&limit=${limit}&searchTerm=${searchTerm}&searchDropdown=${searchDropdown}`);
      console.log(response.data);
      setConsumers(response.data['consumers']);
      setTotalPages(response.data['totalPages']);
      setIsDisabled(false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage, searchTerm, searchDropdown]);
  // Handel Search for Records
  const handleSearch = (event: any) => {
    if (querywords.length > 0 && searchDropdown != "all") {
      setIsSearching(true);
      setSearchTerm(querywords);
    }
    else {
      setIsSearching(false);
    }
  }
  // Handel Search for Records by dropdown
  const handleSelectChange = (e: any) => {
    const dropval = e.target.value;
    if (dropval != "" || dropval != null) {
      setIsSearching(false);
      setSearchDropdown(e.target.value);
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
        <div className='loadinginComponent'>
          <Loading />
        </div>
        :
        <div className='table-data'>
          <div className="search-place">
            <select onChange={(e) => handleSelectChange(e)} disabled={isDisabled}>
              <option value={"all"}>All</option>
              <option value={"consumer_name"}>Consumer Name</option>
            </select>
            &nbsp;&nbsp;
            <input className='search' type="text" disabled={isDisabled} onChange={(e) => setQuerywords(e.target.value)} placeholder="Search Records..." />
            <div className='search-icon' aria-label="search" >
              <SearchIcon onClick={handleSearch} />
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {/* {consumers.length ? Object.keys(consumers[0]).map((key) => (
                    ["consumer_name", "consumer_mobile_number", "consumer_email", "onboarded_by_agent_code"].includes(key) ?
                      <TableCell style={{ color: 'black', fontWeight: 'bold', fontSize: '17px' }} key={key} >{key === 'consumer_email' ? 'Email Address' : key === 'consumer_mobile_number' ? 'Mobile Number' : key === 'onboarded_by_agent_code' ? 'Agent code' : key.replace(/_/g, ' ')[0].toUpperCase() + key.replace(/_/g, ' ').slice(1)}</TableCell> : null
                  )) :
                    <>
                      <TableCell colSpan={8} className="Records_Not_Found">
                        <p>Error 500:Internal Server Error</p>
                      </TableCell>
                    </>
                  }
                  {
                    consumers.length != 0 ? <TableCell style={{ color: 'black', fontWeight: 'bold', fontSize: '17px' }}>Action</TableCell> : null
                  } */}
                  {
                    columns.map((key) => (
                      <TableCell style={{ color: 'black', fontWeight: 'bold', fontSize: '17px' }} key={key} >
                        {key.replace(/_/g, ' ')[0].toUpperCase() + key.replace(/_/g, ' ').slice(1)}
                      </TableCell>
                    ))
                  }

                </TableRow>
                {!consumers.length ?
                  <TableRow>
                    <TableCell colSpan={8} className="Records_Not_Found">
                      <p>Error 500:Internal Server Error</p>
                    </TableCell>
                  </TableRow>
                  : null
                }
              </TableHead>
              <TableBody>
                {!isSearching ?

                  consumers.length ? consumers.map((row, index) => (
                    <TableRow key={index}>
                      {Object.keys(row).map((key) => (
                        ["consumer_name", "consumer_mobile_number", "consumer_email", "onboarded_by_agent_code"].includes(key as string) ?
                          <TableCell key={key}>{row[key] ? String(row[key]) : ""}</TableCell> : null
                      ))}
                      <TableCell>
                        <Button className='btn btn-info' component={Link} to={{ pathname: '/ViewConsumer' }} state={{ "consumer": consumers[index] }}>View this Customer</Button>
                      </TableCell>
                    </TableRow>

                  )) : <TableRow />
                  :
                  Object.values(consumers).filter((index) => {
                    if (searchTerm == "") {
                      return index;
                    }
                    else if (index[searchDropdown].toLowerCase().includes(searchTerm.toLowerCase())) {
                      return index;
                    }
                  }).length ?
                    Object.values(consumers).filter((index) => {
                      if (searchTerm == "") {
                        return index;
                      }
                      else if (index[searchDropdown].toLowerCase().includes(searchTerm.toLowerCase())) {
                        return index;
                      }
                    }).map((row, index) => {
                      return (
                        <TableRow key={index}>
                          {Object.keys(row).map((key) => (
                            ["consumer_name", "consumer_mobile_number", "consumer_email", "onboarded_by_agent_code"].includes(key as string) ?
                              <TableCell key={key}>{row[key] ? String(row[key]) : ""}</TableCell> : null
                          ))}
                          <TableCell>
                            <Button className='btn btn-info' component={Link} to={{ pathname: '/ViewConsumer' }} state={{ "consumer": consumers[index] }}>View this Customer</Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                    :
                    <TableRow>
                      <TableCell colSpan={5} className="Records_Not_Found">
                        <p>Records Not Found</p>
                      </TableCell>
                    </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
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

export default ViewAllConsumers
