import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Container, CssBaseline } from "@mui/material";
import NavBar from "./NavBar";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    Promise.all([
      fetch("http://localhost:3000/orders").then((res) => res.json()),
      fetch("http://localhost:3000/products").then((res) => res.json()),
    ]).then(([ordersData, productsData]) => {
      const userOrders = ordersData.filter((order) => order.user_id.toString() === user.id.toString());
      setOrders(userOrders);
      setProducts(productsData);
    });
  }, []);

  const getProductNames = (productIdsStr) => {
    const ids = productIdsStr.split(",");
    return ids
      .map((id) => {
        const product = products.find((p) => p.id.toString() === id.trim());
        return product ? product.name : `Unknown (${id})`;
      })
      .join(", ");
  };

  return (
    <Box>
        <CssBaseline/>
        <NavBar/>
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography><strong>Order ID:</strong> {order.id}</Typography>
              <Typography><strong>Products:</strong> {getProductNames(order.products)}</Typography>
              <Typography><strong>Shipping Address:</strong> {order.address}, {order.city} {order.zip}</Typography>
              <Typography><strong>Status:</strong> {order.status}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
    </Box>
  );
}