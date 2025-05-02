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
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const products = [
  {
    id: 1,
    name: "Product 1",
    price: 49.99,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQwxpp8kvSn8bX_XNKLknxHSrIrUA7u9n7mA&s",
    description: "This shit gives u so much fps u wouldn't believe.",
    rating: 4.5
  },
  {
    id: 2,
    name: "Product 2",
    price: 79.99,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc67ljZXPR715oV0WajFx_WbqqeOSA8d5rVA&s",
    description: "This shit gives u so much fps u wouldn't believe.",
    rating: 3.0
  },
  {
    id: 3,
    name: "Product 3",
    price: 29.99,
    image: "https://www.asrock.com/Graphics-Card/photo/Radeon%20RX%209070%20XT%20Taichi%2016GB%20OC(M1).png",
    description: "This shit gives u so much fps u wouldn't believe.",
    rating: 5.0
  }
];

export default function IndexPage() {
  const [priceRange, setPriceRange] = React.useState([0, 100]);
  const [minRating, setMinRating] = React.useState(0);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const filteredProducts = products.filter(
    (product) => product.price >= priceRange[0] && product.price <= priceRange[1] && product.rating >= minRating
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
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
        </Toolbar>
      </AppBar>
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
                      {product.name}
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
