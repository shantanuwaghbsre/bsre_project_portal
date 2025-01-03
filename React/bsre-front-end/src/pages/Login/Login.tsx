import React, { useEffect, useState } from "react";
import {
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Container,
} from "@mui/material";

import axios from "axios";
import Loading from "../../Components/Loading/Loading";
import { useRole } from "../../Contexts/RoleContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

// Example logo URL, replace with your actual logo
const logoUrl = "/Images/BS-LOGO.jpg";
const urls = {
  submitURL: import.meta.env.VITE_BACKEND_URL + "/login",
};

const branches = [
  "Vadodara",
  "Bharuch",
  "Borsad",
  "Dholka",
  "Jambusar",
  "Bhavnagar",
  "Mahuva",
  "Palitana",
  "Rajula",
  "Amreli",
  "Surat",
]; // Example branches

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const blankFormData = {
    username: "",
    password: "",
    branch: "",
  };
  const [formData, setFormData] = useState(blankFormData);
  const [selectedBranch, setSelectedBranch] = useState("");
  const { login } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      ...formData,
      username: username,
      password: password,
      branch: selectedBranch,
    });
  }, [username, password, selectedBranch]);
  //clear  data from form
  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      branch: "",
    });
  };
  // POST DATAObject
  function submitdata() {
    if (username == "" || password == "" || selectedBranch == "") {
      toast.error("All fields are required");
      return;
    } else {
      setLoading(true);
      const postObject = new FormData();

      console.log("postObject", postObject);
      function camelToSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      }
      for (const [key, value] of Object.entries(formData)) {
        postObject.append(camelToSnakeCase(key), value);
      }
      axios
        .post(urls["submitURL"], postObject)
        .then(function (response) {
          setLoading(false);
          if (response.data.success === true) {
            // Save username to localStorage

            // Use the role from the response to login
            login(response.data.role, username, selectedBranch);
            toast.success(`Login successful ${username}`, {
              duration: 7000,
            });
            navigate("/");
          } else {
            toast.error("login failed");
          }
        })
        .catch(function (error) {
          setLoading(false);
          toast.error("Login failed");
          console.log(error);
        });
    }
    setLoading(true);
  }
  //handle submit
  const handleLogin = () => {
    // Handle login logic here
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Selected Branch:", selectedBranch);
    submitdata();
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
              <img
                src={logoUrl}
                alt="Logo"
                style={{ width: "100px", marginBottom: "20px" }}
              />
              <Typography variant="h5" gutterBottom>
                Login
              </Typography>
              <Stack spacing={2} sx={{ width: "100%" }}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth={true}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  select
                  label="Branch"
                  variant="outlined"
                  fullWidth
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Stack>
              <Typography>
                don't have an account <a href="/signup">Register</a>
              </Typography>
            </Box>
          </Container>
        </>
      )}
    </>
  );
};

export default Login;
