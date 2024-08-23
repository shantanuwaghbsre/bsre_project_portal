import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Loading from "../Loading/Loading";
import SearchIcon from '@mui/icons-material/Search';

import InfoIcon from '@mui/icons-material/Info';
import { useRole } from '../../Contexts/RoleContext';
import { Agent } from 'http';

const ViewAllAgents = (props: any) => {
    //for showing columns in table record
    const columns = ["agent_name", "agent_mobile_number", "agent_state", "agent_address"]
    axios.defaults.headers.common['token'] = props.token
    const [Agents, setAgents] = useState([]);
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
    const { branchName, role, username } = useRole();


    const fetchData = async (page: number, limit: number) => {
        try {
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/getAgents?role=${role}&branch=${branchName}&page=${page + 1}&limit=${limit}&searchTerm=${searchTerm}&searchDropdown=${searchDropdown}agent_code=${username}`);
            console.log(response.data,"fetchData");
            setAgents(response.data);
            setTotalPages(response.data['totalPages']);
            setIsDisabled(false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(true);
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
                <>
                    <Paper sx={{ width: '100%' }}>
                        <div className='table-data'>
                            <label className='search-label'>Agents</label>
                            <div className="search-place">
                                <select onChange={(e) => handleSelectChange(e)} disabled={isDisabled}>
                                    <option value={"all"}>All</option>
                                    <option value={"agent_name"}>Agent Name</option>
                                </select>
                                &nbsp;&nbsp;
                                <input className='search' type="text" disabled={isDisabled} onChange={(e) => setQuerywords(e.target.value)} placeholder="Search Records..." />
                                <div className='search-icon' aria-label="search">
                                    <Tooltip title='Click'>
                                        <SearchIcon onClick={handleSearch} />
                                    </Tooltip>
                                </div>
                            </div>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            {
                                                columns.map((key) => (
                                                    <TableCell style={{ color: 'black', fontWeight: 'bold', fontSize: '17px' }} key={key} >
                                                        {
                                                            key === 'agent_mobile_number' ? 'Mobile Number' : key.replace(/_/g, ' ')[0].toUpperCase() + key.replace(/_/g, ' ').slice(1)
                                                        }
                                                    </TableCell>
                                                ))
                                            }
                                            {
                                                <TableCell style={{ color: 'black', fontWeight: 'bold', fontSize: '17px' }}>Action</TableCell>
                                            }
                                        </TableRow>
                                        {!Agents.length ?
                                            <TableRow>
                                                <TableCell colSpan={8} className="Records_Not_Found">
                                                    <span>Error 500:Internal Server Error</span>
                                                </TableCell>
                                            </TableRow>
                                            : null
                                        }
                                    </TableHead>
                                    <TableBody>
    {!isSearching ?
        Agents.length ? Agents.map((row, index) => (
            <TableRow key={index}>
                {columns.map((key) => (
                    <TableCell key={key}>{row[key] ? String(row[key]) : ""}</TableCell>
                ))}
                <TableCell>
                    <Button
                        variant="contained"
                        startIcon={<InfoIcon />}
                        component={Link}
                        to={{ pathname: '/ViewAgent' }}
                        state={{ "agent": row }} // Pass the current row's data
                    >
                        View
                    </Button>
                </TableCell>
            </TableRow>
        )) : <TableRow />
        :
        Object.values(Agents).filter((index) => {
            if (searchTerm === "") {
                return index;
            }
            else if (index[searchDropdown]?.toLowerCase().includes(searchTerm.toLowerCase())) {
                return index;
            }
        }).length ?
            Object.values(Agents).filter((index) => {
                if (searchTerm === "") {
                    return index;
                }
                else if (index[searchDropdown]?.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return index;
                }
            }).map((row, index) => (
                <TableRow key={index}>
                    {columns.map((key) => (
                        <TableCell key={key}>{row[key] ? String(row[key]) : ""}</TableCell>
                    ))}
                    <TableCell>
                        <Button
                            variant="contained"
                            startIcon={<InfoIcon />}
                            component={Link}
                            to={{ pathname: '/ViewAgent' }}
                            state={{ "agent": row }} // Pass the current row's data
                        >
                            View
                        </Button>
                    </TableCell>
                </TableRow>
            ))
            :
            <TableRow>
                <TableCell colSpan={5} className="Records_Not_Found">
                    <span>Records Not Found</span>
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
                    </Paper>
                </>
            }
        </>
    );

}

export default ViewAllAgents
