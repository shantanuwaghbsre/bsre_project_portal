import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TableFooter,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import toast from "react-hot-toast";
import axios from "axios";
import Loading from "../../Components/Loading/Loading";

interface PanelData {
  r_guvnl_id: number;
  number_of_panels: number;
  type_of_structure: string;
  kilowatts: number;
  guvnl_price: number;
  date: string;
  modified_date: string;
}

const GuvnlPricesTable: React.FC = () => {
  const [data, setData] = useState<PanelData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [open, setOpen] = useState(false);
  const [totalPricesList, setTotalPricesList] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<PanelData | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdaingLoader, setIsUpdaingLoader] = useState(false);
  const [isDeletingLoader, setIsDeletingLoader] = useState(false);
  const [isCreatingLoader, setIsCreatingLoader] = useState(false);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedId !== null) {
      setIsDeletingLoader(true);
      try {
        const response = await axios.delete(
          `https://quotations.bsit.co.in/delete_me?r_guvnl_id=${selectedId}`
          // {
          //     headers: {
          //         'Authorization': `Bearer ${yourAccessToken}`
          //     }
          // }
        );
        setIsDeletingLoader(false);
        toast.success("Entry deleted successfully!");
        fetchGuvnlPrices();
      } catch (error) {
        console.log(error);
        setIsDeletingLoader(false);
        toast.error("Failed to delete entry.");
      }
      setSelectedId(null);
    }
    setDeleteDialogOpen(false);
    setSelectedId(null);
  };

  const handleEdit = (item: PanelData) => {
    setForm(item);
    setIsEditing(true);
    setOpen(true);
  };

  const handleAdd = () => {
    setForm({
      r_guvnl_id: 0,
      number_of_panels: 0,
      type_of_structure: "",
      kilowatts: 0,
      guvnl_price: 0,
      date: "",
      modified_date: "",
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(null);
  };

  const handleSave = async () => {
    if (form) {
      const param = {
        number_of_panels: form.number_of_panels,
        type_of_structure: form.type_of_structure,
        kilowatts: form.kilowatts,
        guvnl_price: form.guvnl_price,
      };

      try {
        if (isEditing) {
          setIsUpdaingLoader(true),
            await axios.put(
              `https://quotations.bsit.co.in/update_guvnl_price?r_guvnl_id=${form.r_guvnl_id}`,
              param
            );
          setIsUpdaingLoader(false);
          toast.success("Entry updated successfully!");
        } else {
          setIsCreatingLoader(true);
          await axios.post(
            `https://quotations.bsit.co.in/add_guvnl_price`,
            param
          );
          setIsCreatingLoader(false);
          toast.success("New entry added successfully!");
        }
        fetchGuvnlPrices();
      } catch (error) {
        console.log(error);
        setIsUpdaingLoader(false);
        setIsCreatingLoader(false);
        toast.error("An error occurred while saving the entry.");
      }
      handleClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (form) {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchGuvnlPrices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL +
          `/get_guvnl_price_list?limit=${rowsPerPage}&page=${page}`
      );

      setIsLoading(false);

      setData(response.data.data);
      setTotalPricesList(response.data.total_size);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGuvnlPrices();
  }, [page, rowsPerPage]);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            style={{ marginBottom: "20px" }}
          >
            Add New Entry
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "5rem" }}>Id</TableCell>
                  <TableCell>Number of Panels</TableCell>
                  <TableCell>Type of Structure</TableCell>
                  <TableCell>Kilowatts</TableCell>
                  <TableCell>GUVNL Price</TableCell>
                  <TableCell>Creation Date</TableCell>
                  <TableCell>Modified Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item?.r_guvnl_id}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item?.number_of_panels}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item?.type_of_structure}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item?.kilowatts}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item?.guvnl_price}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item?.date || "-"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {item?.modified_date || "-"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <IconButton onClick={() => handleEdit(item)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(item?.r_guvnl_id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[50, 100, 150, 200, 250]}
                    count={totalPricesList}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          {/* Dialog for Add/Edit */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              {isEditing ? "Edit Entry" : "Add New Entry"}
            </DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Number of Panels"
                name="number_of_panels"
                type="number"
                fullWidth
                value={form?.number_of_panels || ""}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Type of Structure"
                name="type_of_structure"
                fullWidth
                value={form?.type_of_structure || ""}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Kilowatts"
                name="kilowatts"
                type="number"
                fullWidth
                value={form?.kilowatts || ""}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="GUVNL Price"
                name="guvnl_price"
                type="number"
                fullWidth
                value={form?.guvnl_price || ""}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave} color="primary">
                {selectedId ? (
                  isUpdaingLoader ? (
                    <CircularProgress />
                  ) : (
                    "Save"
                  )
                ) : isCreatingLoader ? (
                  <CircularProgress />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Confirmation dialog for delete */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this entry? This action cannot
                be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="primary">
                {isDeletingLoader ? <CircularProgress /> : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default GuvnlPricesTable;
