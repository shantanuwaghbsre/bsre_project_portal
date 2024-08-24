import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';


function createData(
  heading: string,
  details: {}[]
) {
  return {
    heading,
    detail: details
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate()
  console.log("row=>", row);
  console.log(row.detail?.map((data: any) => data.consumer_number));

  const handleViewProject = (consumerNumber: number) => {
    navigate({ pathname: '/ViewProject', search: `?consumer_number=${consumerNumber}` })
  }
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.heading}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Number</TableCell>
                    <TableCell >Kilowatts</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.detail.map((detailRow, index) => (
                    <TableRow key={index} >
                      {Object.keys(detailRow).map((key, index2) => (
                        <TableCell key={index2}>{detailRow[key]}</TableCell>
                      ))}
                      <Button variant="contained"
                        component={Link}
                        to={{ pathname: "/ViewProject" }}
                        state={{
                          consumer_number:
                            detailRow.consumer_number,
                          // project_in_phase:
                          //   detailRow.project_in_phase,
                          // for_consumer_id:
                          //   detailRow.for_consumer_id,
                        }}
                      >view</Button>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


export default function CollapsibleTable(props: any) {
  console.log("props=>", props);

  const rows = []
  Object.keys(props.tableData).forEach(heading => {
    console.log("heading=>", heading);
    rows.push(createData(heading, props.tableData[heading]));
  });
  console.log("rows after foreach=>", rows);
  return (
    <>
      <Typography variant='h4' sx={{ fontWeight: 700, textAlign: 'center' }}>{props.tableTitle}</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <Row key={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer></>
  );
}
