import React, { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  Container,
} from "@mui/material";
import axios from "axios";
import Loading from "../../Components/Loading/Loading";
import { useRole } from "../../Contexts/RoleContext";
import toast from "react-hot-toast";

const urls = {
  changePwdURL: import.meta.env.VITE_BACKEND_URL + "/changePassword",
};

const ChangePwd: React.FC = () => {
  // const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { username } = useRole();
  const resetForm = () => {
    // setCurrentPassword('');
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleChangePwd = () => {
    if (newPassword === "" || confirmNewPassword === "") {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);

    const postObject = {
      username: username,
      new_password: newPassword,
    };
    console.log(postObject);

    axios
      .post(urls.changePwdURL, postObject)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          resetForm();
          toast.success("Password changed successfully!");
        } else {
          toast.error(
            "Failed to change password. Please check your current password."
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error("An error occurred. Please try again later.");
      });
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Loading />
        </div>
      ) : (
        <>
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
                width: {
                  md: 400,
                  xs: 300,
                },
                "& .MuiTextField-root": {
                  margin: 1,
                  width: "100%",
                },
                "& .MuiButton-root": {
                  margin: 1,
                  width: "100%",
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  textAlign: "center",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                }}
                gutterBottom
              >
                Change Password
              </Typography>
              <Stack spacing={2} sx={{ width: "100%" }}>
                <TextField
                  label="New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangePwd}
                >
                  Change Password
                </Button>
              </Stack>
            </Box>
          </Container>
        </>
      )}
    </>
  );
};

export default ChangePwd;
