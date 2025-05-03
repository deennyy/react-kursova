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
    const location = useLocation();

    const handleLoginClick = () => {
        navigate("/login");
    };
    
    const handleLogoutClick = () => {
        localStorage.removeItem("user");

        if (location['pathname'] != '/') {
            navigate("/");
        } else {
            window.location.reload();
        }
    };

    const handleAdminClick = () => {
        navigate("/admin");
    };

    const user = JSON.parse(localStorage.getItem("user"));

    const [cartItems, setCartItems] = React.useState([]);
    const [cartOpen, setCartOpen] = React.useState(false);
    
    React.useEffect(() => {
      const fetchCart = async () => {
        if (!user) return;
        const userId = user['id'];
        if (!userId) return;
    
        const res = await fetch(`http://localhost:3000/carts?user_id=${userId}`);
        const carts = await res.json();
        if (carts.length && carts[0].product_ids) {
          const ids = carts[0].product_ids.split(",");
          const products = await Promise.all(
            ids.map((id) =>
              fetch(`http://localhost:3000/products/${id}`).then((res) => res.json())
            )
          );
          setCartItems(products);
        }
      };
    
      fetchCart();
    }, []);

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
                    
                    { user && <Typography sx={{pr: 1}}>Logged in as: {user['username']}</Typography> }
                    
                    { user && cartItems.length > 0 ? 

                    <Box
                        onMouseEnter={() => setCartOpen(true)}
                        onMouseLeave={() => setCartOpen(false)}
                        sx={{ position: "relative", ml: "auto", cursor: "pointer" }}
                    >
                    <Typography variant="button" sx={{ color: "#fff", mr: 1 }}>
                        Your Cart ({cartItems.length})
                    </Typography>
                    {cartOpen && (
                        <Box
                            sx={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            backgroundColor: "white",
                            color: "black",
                            boxShadow: 3,
                            p: 2,
                            minWidth: 200,
                            zIndex: 10,
                            }}
                        >
                    {cartItems.length === 0 ? (
                        <Typography>No items in cart</Typography>
                    ) : (
                        cartItems.map((item) => (
                        <Typography key={item.id} variant="body2">
                            {item.name}
                        </Typography>
                        ))
                    )}
                        </Box>
                    )}
                    </Box>
                    : null
                    }

                    { user && user['username'] === "Admin" ? <Button variant="outlined" sx={{ mr: 1, color: "#ff0000" }} color="#ff0000" onClick={handleAdminClick}>Admin Panel</Button> : null }

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