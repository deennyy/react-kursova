import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  Divider,
  CssBaseline,
} from "@mui/material";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
              <Container>
                <Typography variant="h4" mt={4}>Unauthenticated</Typography>
              </Container>
            );
  }

  const userId = user['id'];

  const [cartProducts, setCartProducts] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartRes = await fetch(`http://localhost:3000/carts?user_id=${userId}`);
      const carts = await cartRes.json();
      const cart = carts[0];
      if (cart && cart.product_ids) {
        const ids = cart.product_ids.split(",");
        const productFetches = ids.map((id) =>
          fetch(`http://localhost:3000/products/${id}`).then((res) => res.json())
        );
        const products = await Promise.all(productFetches);
        setCartProducts(products);
      }
    };

    fetchCartItems();
  }, [userId]);

  if (cartProducts.length == 0) {
    return (
        <Container>
          <Typography variant="h4" mt={4}>No items in cart</Typography>
        </Container>
      );
  }

  const handleInputChange = (field) => (e) => {
    setShippingInfo({ ...shippingInfo, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!cartProducts.length) {
      alert("Your cart is empty!");
      return;
    }
  
    // Prepare products string in the format "1,1,1" (IDs of products in the cart)
    const productIds = cartProducts.map((p) => p.id).join(",");
  
    const newOrder = {
      user_id: String(userId), // You would get this from the logged-in user
      products: productIds,
      address: shippingInfo.address,
      city: shippingInfo.city,
      zip: shippingInfo.zip,
      status: "Placed", // Initial status can be "Placed"
    };
  
    try {
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });
  
      if (res.ok) {
        alert("Order submitted successfully!");
  
        // Optionally, clear the cart after submitting the order
        const cartRes = await fetch(`http://localhost:3000/carts?user_id=${userId}`);
        const userCart = await cartRes.json();
        if (userCart.length) {
          await fetch(`http://localhost:3000/carts/${userCart[0].id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_ids: "" }), // Clear cart in API
          });
        }
  
        // Reset form fields and cart state in the UI
        setShippingInfo({ address: "", city: "", zip: "" });
        setCartProducts([]);
      } else {
        alert("Failed to submit order");
      }
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("An error occurred while submitting the order.");
    }
  };

  const handleDeleteItem = async (index) => {
    // Remove product from cartProducts by index
    const updatedCartProducts = [...cartProducts];
    updatedCartProducts.splice(index, 1);  // Remove the product at the given index
    setCartProducts(updatedCartProducts);
  
    // Get the current user's cart
    const cartRes = await fetch(`http://localhost:3000/carts?user_id=${userId}`);
    const userCart = await cartRes.json();
  
    if (userCart.length) {
      const productIdsArray = userCart[0].product_ids.split(",");
  
      // Remove the product ID at the corresponding index
      productIdsArray.splice(index, 1);
      
      // Update the cart on the server with the new product_ids
      await fetch(`http://localhost:3000/carts/${userCart[0].id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_ids: productIdsArray.join(","),
        }),
      });
    }

    console.log(userCart);
    console.log(userCart[0].product_ids.split(",").length);
    if (userCart[0].product_ids.split(",").length == 1) {
        navigate("/");
    }
  };

  return (
    <Box>
        <CssBaseline/>
        <NavBar/>
    <Container maxWidth="md" sx={{ mt: 4 }}>
        
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {cartProducts.map((product, index) => (
          <Grid item xs={12} md={6} key={(Math.floor(Math.random() * 100000))}>
            <Card>
              <CardMedia component="img" sx={{width: 140}} height="140" image={product.image} alt={product.name} />
              <CardContent>
                <Typography variant="h6">{ product.name.length > 11 ? `${product.name.slice(0, 8)}...` : product.name }</Typography>
                <Typography>${product.price}</Typography>
                <Button variant="outlined" onClick={() => handleDeleteItem(index)}>
                    Remove
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>Shipping Details</Typography>
      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={shippingInfo.name = user['username']}
          onChange={handleInputChange("name")}
          disabled
        />
        <TextField
          label="Address"
          fullWidth
          margin="normal"
          value={shippingInfo.address}
          onChange={handleInputChange("address")}
        />
        <TextField
          label="City"
          fullWidth
          margin="normal"
          value={shippingInfo.city}
          onChange={handleInputChange("city")}
        />
        <TextField
          label="ZIP Code"
          fullWidth
          margin="normal"
          value={shippingInfo.zip}
          onChange={handleInputChange("zip")}
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
          Place Order
        </Button>
      </Box>
    </Container>
    </Box>
  );
};

export default CheckoutPage;