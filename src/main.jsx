import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.jsx'
import IndexPage from './Index.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductPage from './ProductPage.jsx';
import LoginPage from './LoginPage.jsx';
import AdminPanel from './AdminPanel.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  </BrowserRouter>,
)