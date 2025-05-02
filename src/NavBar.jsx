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
import { useNavigate, Link, useLocation } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    };
    
    const handleLogoutClick = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

    return (
        <AppBar position="static">
                <Toolbar>
                  <Typography
                    noWrap
                    variant="h6"
                    component={Link}
                    to={`/`}
                    sx={{ textDecoration: "none", color: "#ffffff", "&:hover": { textDecoration: "underline" } }}>
                    My E-Commerce Platform
                  </Typography>

                { location['pathname'] != '/login' ? (
                    <>
                    <Box sx={{ flexGrow: 1 }} />

                    { user ? (
                    <Button variant="outlined" color="#ffffff" onClick={handleLogoutClick}>
                        Logout
                    </Button> )
                    : (
                    <Button variant="outlined" color="#ffffff" onClick={handleLoginClick}>
                        Login
                    </Button>  ) }
                    </>
                ) : null
                }
                
                </Toolbar>
        </AppBar>
    );
}

export default NavBar;