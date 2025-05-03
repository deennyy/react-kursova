import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Slider,
  Box,
  Divider,
  Rating
} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar.jsx'

const drawerWidth = 240;

export default function IndexPage() {
  const [priceRange, setPriceRange] = React.useState([0, 100]);
  const [minRating, setMinRating] = React.useState(0);

  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const filteredProducts = products.filter(
    (product) => product.price >= priceRange[0] && product.price <= priceRange[1] && product.rating >= minRating
  );

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      <NavBar></NavBar>
      <Box sx={{ display: "flex", flex: 1 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              top: "auto"
            }
          }}
        >
          <Box sx={{ overflow: "auto", p: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <Divider sx={{m: 1}} flexItem/>
            <Typography gutterBottom>Price Range</Typography>
            <Box sx={{ m: 1 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                size="small"
              />
            </Box>
            <Divider sx={{m: 1}} flexItem/>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Box>
              <Rating
                name="min-rating"
                value={minRating}
                precision={0.5}
                onChange={(event, newValue) => setMinRating(newValue || 0)}
              />
            </Box>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="lg" sx={{ m: 0 }}>
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.image}
                      alt={product.name}
                      sx={{width: 140}}
                    />
                    <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component={Link}
                      to={`/products/${product.id}`}
                      sx={{ textDecoration: "none", color: "primary.main", "&:hover": { textDecoration: "underline" } }}>
                      {   product.name.length > 11
                        ? `${product.name.slice(0, 8)}...`
                        : product.name
                    }
                    </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${product.price}
                      </Typography>
                      <Rating value={product.rating} precision={0.5} readOnly size="small" />
                    </CardContent>
                    <CardActions>
                      <Button size="small">Add to Cart</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
