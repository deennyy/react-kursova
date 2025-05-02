import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  CssBaseline
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "./NavBar.jsx";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:3000/users?username=${formData.username}&password=${formData.password}`);
        const users = await response.json();
    
        if (users.length === 1) {
          // Login successful
          const user = users[0];
          localStorage.setItem("user", JSON.stringify(user)); // store session
          navigate("/");
        } else {
          // Login failed
          alert("Invalid username or password.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
      }
  };

  const handleRegisterRedirect = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:3000/users`, {method: "POST", body: JSON.stringify({username: formData.username, password: formData.password})});
        const users = await response.json();
        const user_arr = [users];
    
        if (user_arr.length === 1) {
          // Register successful
          const user = user_arr[0];
          localStorage.setItem("user", JSON.stringify(user)); // store session
          navigate("/");
        } else {
          alert("Registartion failed.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registartion.");
      }
  };

  return (
    <Box>
        <CssBaseline></CssBaseline>
        <NavBar></NavBar>

    <Container maxWidth="sm">

      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Username"
            type="username"
            fullWidth
            required
            margin="normal"
            value={formData.username}
            onChange={handleChange("username")}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={formData.password}
            onChange={handleChange("password")}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography align="center">Don't have an account?</Typography>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleRegisterRedirect}
          sx={{ mt: 1 }}
        >
          Register
        </Button>
      </Paper>
    </Container>
    </Box>
  );
};

export default LoginPage;