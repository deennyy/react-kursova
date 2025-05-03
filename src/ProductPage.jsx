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
import NavBar from "./NavBar.jsx";

export default function ProductPage() {
  const [products, setProducts] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const { id } = useParams();
  const product = products.find((p) => p.id == parseInt(id));

  React.useEffect(() => {
    if (!product?.id) return;
  
    const fetchReviewsWithUsers = async () => {
      try {
        const reviewsRes = await fetch(`http://localhost:3000/reviews?product_id=${product.id}`);
        const reviewsData = await reviewsRes.json();
  
        const reviewsWithUser = await Promise.all(
          reviewsData.map(async (rev) => {
            const userRes = await fetch(`http://localhost:3000/users/${rev.user_id}`);
            const userData = await userRes.json();
            return {
              ...rev,
              name: userData.username || "Unknown"
            };
          })
        );
  
        setReviews(reviewsWithUser);
      } catch (err) {
        console.error("Failed to load reviews or users", err);
      }
    };
  
    fetchReviewsWithUsers();
  }, [product?.id]);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 2.5,
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

  const user = JSON.parse(localStorage.getItem("user"));

  const handleReviewSubmit = async () => {
    if (newReview.name && newReview.comment && newReview.rating > 0) {
      try {
        await fetch(`http://localhost:3000/reviews`, {method: 'POST', body: JSON.stringify({product_id: product.id, user_id: user.id, rating: newReview.rating, comment: newReview.comment})});
      } catch (error) {
        console.error("Failed to add new review", err);
      }
      setReviews([...reviews, newReview]);
      setNewReview({ name: "", rating: 2.5, comment: "" });
    }
  };

  return (
    <Box>
    <CssBaseline />
    <NavBar></NavBar>
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
          value={ user ? newReview.name = user['username'] : newReview.name = "Your Name" }
          onChange={handleReviewChange("name")}
          disabled
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
        {
            user ?
        <Button variant="outlined" onClick={handleReviewSubmit}>
          Submit Review
        </Button>
        :
        <Typography>
            Login to submit a review
        </Typography>
        }   
        </Box>
        </Box>
    </Container>
    </Box>
  );
}