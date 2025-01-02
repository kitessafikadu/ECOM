import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import UploadProductPage from "./pages/UploadProductPage";
import ProductListingPage from "./pages/ProductListingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/upload" element={<UploadProductPage />} />
        <Route path="/products" element={<ProductListingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
