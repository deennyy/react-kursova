import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  CssBaseline,
  AppBar,
  Toolbar,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from "@mui/material";
import NavBar from "./NavBar";

export default function AdminPanel() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    rating: 0
  });

  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const handleChange = (field) => (event) => {
    setNewProduct({ ...newProduct, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          rating: parseFloat(newProduct.rating)
        })
      });
      if (res.ok) {
        setNewProduct({ name: "", price: "", image: "", description: "", rating: 0 });
        fetchProducts();
      } else {
        alert("Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProducts(products.filter((product) => product.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (!user || user['username'] !== "Admin") {
    return (
          <Container>
            <Typography variant="h4" mt={4}>Unauthorized</Typography>
          </Container>
        );
  }

  return (
    <Box>
      <CssBaseline />
      <NavBar></NavBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add New Product
          </Typography>
          <TextField label="Name" fullWidth margin="normal" value={newProduct.name} onChange={handleChange("name")} />
          <TextField label="Price" type="number" fullWidth margin="normal" value={newProduct.price} onChange={handleChange("price")} />
          <TextField label="Image URL" fullWidth margin="normal" value={newProduct.image} onChange={handleChange("image")} />
          <TextField label="Description" multiline rows={4} fullWidth margin="normal" value={newProduct.description} onChange={handleChange("description")} />
          <TextField label="Rating" type="number" inputProps={{ min: 0, max: 5, step: 0.5 }} fullWidth margin="normal" value={newProduct.rating} onChange={handleChange("rating")} />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" gutterBottom>
          Existing Products
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia component="img" height="140" image={product.image} alt={product.name} sx={{width: 140}} />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {   product.name.length > 11
                        ? `${product.name.slice(0, 8)}...`
                        : product.name
                    }
                  </Typography>
                  <Typography variant="body2">${product.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button color="error" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}