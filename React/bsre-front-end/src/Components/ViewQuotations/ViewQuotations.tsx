import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading/Loading";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import { useRole } from "../../Contexts/RoleContext";
import toast from "react-hot-toast";

const ViewQuotations = (props: any) => {
  //for showing columns in table record
  const columns = [
    "Agent name",
    "Consumer name",
    "Quotation type",
    "Solar panel type",
    "Structure",
    "Total kilowatts",
    "Action",
  ];
  axios.defaults.headers.common["token"] = props.token;
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [querywords, setQuerywords] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [norecords, setNorecords] = useState("");
  const [searchDropdown, setSearchDropdown] = useState("all");
  // this will be use for disable input field while searching
  const [isDisabled, setIsDisabled] = useState(true);
  const [count, setCount] = useState(0);
  const { branchName, role, username } = useRole();
  const fetchData = async (page: number, limit: number) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL +
          `/getAllQuotations?role=${role}&branch=${branchName}&page=${
            page + 1
          }&limit=${limit}&searchTerm=${searchTerm}&searchDropdown=${searchDropdown}&agent_code=${username}
`
      );

      // else {
      //   setQuotations([{ "Consumer name": "", "Agent name": "", "Total kilowatts": "", "Structure": "", "Solar panel type": "", "Quotation type": "" }]);
      // }
      setCount(response.data["count"] || 0);
      setIsDisabled(false);

      setQuotations(response.data["quotations"]);

      console.log("data of search===>", response.data);
      setLoading(false);
    } catch (error) {
      // toast.error(error.message)
      console.error("Error fetching data:", error);
      setLoading(false);
      setNorecords("Error 500:Internal Server Error");
    }
  };
  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage, searchTerm, searchDropdown]);
  // Handle Search for Records
  const handleSearch = (event: any) => {
    setSearchTerm(querywords);
    if (querywords.length > 0 && searchDropdown != "all") {
      setIsSearching(true);
    }
    if (
      querywords.length == 0 ||
      (querywords.length == null && searchDropdown == "all")
    ) {
      setIsSearching(false);
    }
  };
  // Handle Search for Records by dropdown
  const handleSelectChange = (e: any) => {
    const dropval = e.target.value;
    if (dropval != "" || dropval != null) {
      setIsSearching(false);
      setSearchDropdown(e.target.value);
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setLoading(true);
  };

  return (
    <>
      {loading ? (
        <div className="loadinginComponent">
          <Loading />
        </div>
      ) : (
        <>
          <Paper sx={{ width: "100%", padding: "20px" }}>
            <div className="table-data">
              <label className="search-label">
                <Typography variant="h6" sx={{ fontWeight: "bold" }} noWrap >
                  Quotations
                </Typography>
              </label>
              <div className="search-place">
                <select
                  onChange={(e) => handleSelectChange(e)}
                  disabled={isDisabled}
                >
                  <option value={"all"}>All</option>
                  <option value={"Agent name"}>Agent Name</option>
                  <option value={"Consumer name"}>Consumer Name</option>
                </select>
                &nbsp;&nbsp;
                <input
                  className="search"
                  type="text"
                  disabled={isDisabled}
                  onChange={(e) => setQuerywords(e.target.value)}
                  placeholder="Search Records..."
                />
                <div className="search-icon" aria-label="search">
                  <Tooltip title="Click">
                    <SearchIcon onClick={handleSearch} />
                  </Tooltip>
                </div>
              </div>
              <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((key) => (
                        <TableCell
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "17px",
                            whiteSpace: "nowrap",
                          }}
                          key={key}
                        >
                          {key === "Solar panel type" ? "Panel Type" : key}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotations.length > 0 ? (
                      quotations.map((row, index) => (
                        <TableRow key={index}>
                          {Object.keys(row).map((key) =>
                            [
                              "Consumer name",
                              "Agent name",
                              "Total kilowatts",
                              "Structure",
                              "Solar panel type",
                              "Quotation type",
                            ].includes(key as string) ? (
                              <TableCell
                                sx={{ whiteSpace: "nowrap" }}
                                key={key}
                              >
                                {row[key]?.toString()?.length
                                  ? String(row[key])
                                  : "-"}
                              </TableCell>
                            ) : null
                          )}
                          <TableCell>
                            <Button
                              variant="contained"
                              startIcon={<InfoIcon />}
                              component={Link}
                              to={{ pathname: "/ConsumerOnboarding" }}
                              state={{ quotation: quotations[index] }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="Records_Not_Found">
                          <span>{"No Data"}</span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) =>
                  handleChangePage(event, newPage)
                }
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </Paper>
        </>
      )}
    </>
  );
};

export default ViewQuotations;
