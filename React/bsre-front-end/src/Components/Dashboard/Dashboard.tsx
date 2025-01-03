import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import { MailRounded } from "@mui/icons-material";
import { useRole } from "../../Contexts/RoleContext";

const Dashboard = (props: any) => {
  //for showing columns in table record
  const columns = [
    "Consumer number",
    "Consumer Id",
    "Meter number",
    "Project address",
    "Email Address",
    "Project in phase",
    "Project type",
    "Mail Sent to Consumer",
    "Action",
  ];
  axios.defaults.headers.common["token"] = props.token;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [querywords, setQuerywords] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState("all");
  const [isMailSeding, setIsMailSeding] = useState(false);
  const [sendingMailConsumerId, setSendingMailConsumerId] = useState("");
  // this will be use for disable input field while searching
  const [isDisabled, setIsDisabled] = useState(true);
  const [count, setCount] = useState(0);
  const { role, branchName, username } = useRole();

  const fetchData = async (page: number, limit: number) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL +
          `/getAllProjects?role=${role}&branch=${branchName}&page=${
            page + 1
          }&limit=${limit}&searchTerm=${searchTerm}&searchDropdown=${searchDropdown}&agent_code=${username}`
      );
      setProjects(response.data["projects"]);
      setCount(response.data["count"] || 0);
      console.log(response, "response");
      setLoading(false);
      setIsDisabled(false);
      console.log("data of search===>", response.data);
    } catch (error) {
      // toast.error(error.message)
      console.error("Error fetching data:", error);
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
    } else {
      setIsSearching(false);
      setSearchTerm(querywords);
    }
  };
  // Handel Search for Records by dropdown
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

  const mailSendToConsumer = async (consumer_id: string) => {
    setIsMailSeding(true);
    setSendingMailConsumerId(consumer_id);
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL +
          `/send_mail_to_consumer?consumer_id=${consumer_id}`
      );
      console.log(response, "response");
      fetchData(page, rowsPerPage);
      setIsMailSeding(false);
    } catch (error) {
      // toast.error(error.message)
      console.error("Error fetching data:", error);
      setIsMailSeding(false);
    }
  };
  // Helper function for determining the button label
  const getButtonLabel = (isMailSeding, sendingMailConsumerId, row) => {
    if (isMailSeding && sendingMailConsumerId === row.for_consumer_id) {
      return "Sending...";
    }
    return row.z_send_mail === null ? "Send Mail" : "Mail Sent";
  };

  // Function to handle the mail-sending logic
  const handleMailSend = (consumerId) => {
    mailSendToConsumer(consumerId);
  };

  return (
    <>
      {loading ? (
        <div className="loadinginComponent">
          <Loading />
        </div>
      ) : (
        <>
          <Paper sx={{ width: "100%", padding: "20px", margin: "20px" }}>
            <div className="table-data">
              <label className="search-label">
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Project List
                </Typography>
              </label>
              <div className="search-place" style={{ marginBottom: "10px" }}>
                <select
                  onChange={(e) => handleSelectChange(e)}
                  disabled={isDisabled}
                >
                  <option value={"all"}>All</option>
                  <option value={"consumer_number"}>Consumer Number</option>
                </select>
                &nbsp;&nbsp;
                <input
                  className="search"
                  type="text"
                  onChange={(e) => setQuerywords(e.target.value)}
                  placeholder="Search Records..."
                  disabled={isDisabled}
                />
                <div className="search-icon" aria-label="search">
                  <Tooltip title="Click">
                    <SearchIcon onClick={handleSearch} />
                  </Tooltip>
                </div>
              </div>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
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
                          {key === "for_consumer_id"
                            ? "Consumer Id"
                            : key === "project_email"
                            ? "Email Address"
                            : key.replace(/_/g, " ")[0].toUpperCase() +
                              key.replace(/_/g, " ").slice(1)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {!projects.length && (
                      <TableRow>
                        <TableCell colSpan={8} className="Records_Not_Found">
                          <span>No Data</span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableHead>
                  <TableBody>
                    {!isSearching && searchDropdown === "all" ? (
                      projects.length ? (
                        projects.map((row, index) => (
                          <TableRow key={index}>
                            {Object.keys(row).map((key) => (
                              <TableCell
                                sx={{ whiteSpace: "nowrap" }}
                                key={key}
                              >
                                {key === "z_send_mail"
                                  ? row[key] === null
                                    ? "Not Sent"
                                    : "Sent"
                                  : row[key]
                                  ? String(row[key])
                                  : ""}
                                {/* {row[key] ? String(row[key]) : ""} */}
                              </TableCell>
                            ))}
                            <TableCell>
                              <Button
                                variant="contained"
                                startIcon={<InfoIcon />}
                                component={Link}
                                to={{ pathname: "/ViewProject" }}
                                state={{
                                  consumer_number:
                                    projects[index].consumer_number,
                                  project_in_phase:
                                    projects[index].project_in_phase,
                                  for_consumer_id:
                                    projects[index].for_consumer_id,
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                startIcon={<MailRounded />}
                                disabled={
                                  (isMailSeding &&
                                    sendingMailConsumerId ===
                                      row.for_consumer_id) ||
                                  row.z_send_mail !== null
                                }
                                sx={{ whiteSpace: "nowrap" }}
                                onClick={() =>
                                  handleMailSend(row.for_consumer_id)
                                }
                              >
                                {getButtonLabel(
                                  isMailSeding,
                                  sendingMailConsumerId,
                                  row
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow />
                      )
                    ) : Object.values(projects).filter((index) => {
                        if (searchTerm === "") {
                          return index;
                        } else if (
                          index[searchDropdown]
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        ) {
                          return index;
                        }
                      }).length ? (
                      Object.values(projects)
                        .filter((index) => {
                          if (searchTerm === "") {
                            return index;
                          } else if (
                            index[searchDropdown]
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ) {
                            return index;
                          }
                        })
                        .map((row, index) => {
                          return (
                            <TableRow key={index}>
                              {Object.keys(row).map((key) => (
                                <TableCell
                                  key={key}
                                  sx={{ whiteSpace: "nowrap" }}
                                >
                                  {key === "z_send_mail"
                                    ? row[key] === null
                                      ? "Not Sent"
                                      : "Sent"
                                    : row[key]
                                    ? String(row[key])
                                    : ""}
                                </TableCell>
                              ))}
                              <TableCell>
                                <Button
                                  variant="contained"
                                  startIcon={<InfoIcon />}
                                  component={Link}
                                  to={{ pathname: "/ViewProject" }}
                                  state={{
                                    consumer_number:
                                      projects[index].consumer_number,
                                    project_in_phase:
                                      projects[index].project_in_phase,
                                    for_consumer_id:
                                      projects[index].for_consumer_id,
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  startIcon={<MailRounded />}
                                  disabled={
                                    (isMailSeding &&
                                      sendingMailConsumerId ===
                                        row.for_consumer_id) ||
                                    row.z_send_mail !== null
                                  }
                                  sx={{ whiteSpace: "nowrap" }}
                                  onClick={() =>
                                    handleMailSend(row.for_consumer_id)
                                  }
                                >
                                  {getButtonLabel(
                                    isMailSeding,
                                    sendingMailConsumerId,
                                    row
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    ) : // <TableRow>
                    //   <TableCell colSpan={8} className="Records_Not_Found">
                    //     <span></span>
                    //   </TableCell>
                    // </TableRow>
                    null}
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
export default Dashboard;
