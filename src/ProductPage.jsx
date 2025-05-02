import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  TextField,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid
} from "@mui/material";
import { Link, useParams } from 'react-router-dom';

// Same product list or import from a shared file
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

const dummyReviews = [
    { name: "Alice", rating: 5, comment: "Loved it!" },
    { name: "Bob", rating: 4, comment: "Very good, but could be cheaper." }
];

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const [reviews, setReviews] = useState(dummyReviews);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: ""
  });

  if (!product) {
    return (
      <Container>
        <Typography variant="h4" mt={4}>Product not found</Typography>
      </Container>
    );
  }

  const handleReviewChange = (field) => (event) => {
    setNewReview({ ...newReview, [field]: event.target.value });
  };

  const handleRatingChange = (event, value) => {
    setNewReview({ ...newReview, rating: value });
  };

  const handleReviewSubmit = () => {
    if (newReview.name && newReview.comment && newReview.rating > 0) {
      setReviews([...reviews, newReview]);
      setNewReview({ name: "", rating: 0, comment: "" });
    }
  };

  return (
    <Box>
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
    <Box sx={{ flex: 1 }}>
      <Card>
        <CardMedia
          component="img"
          width="640"
          height="480"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Rating value={product.rating} precision={0.5} readOnly size="large" />
          <Typography variant="h6" color="text.primary">
            ${product.price}
          </Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary">
              Add to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>
      </Box>

      <Box sx={{ flex: 1 }}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ textAlign: "center"}}>Reviews</Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
        <List>
          {reviews.map((rev, index) => (
            <ListItem key={index} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Rating value={rev.rating} readOnly size="small" />
              <ListItemText
                primary={rev.name}
                secondary={rev.comment}
              />
            </ListItem>
          ))}
        </List>
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* Add Review Form */}
        <Typography variant="h6"  textAlign="center">Add a Review</Typography>
        <Divider sx={{ my: 2 }} />
        <TextField
          label="Your Name"
          fullWidth
          margin="normal"
          value={newReview.name}
          onChange={handleReviewChange("name")}
        />
        <Rating
          value={newReview.rating}
          onChange={handleRatingChange}
          precision={0.5}
        />
        <TextField
          label="Your Review"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={newReview.comment}
          onChange={handleReviewChange("comment")}
        />
        <Button variant="outlined" onClick={handleReviewSubmit}>
          Submit Review
        </Button>
        </Box>
        </Box>
    </Container>
    </Box>
  );
}