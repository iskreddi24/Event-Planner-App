import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SwiperSection from "./SwiperSection";
import "../../styles/StoreFront.css";
import axios from "axios";

const StoreFront = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from backend API
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="storefront-container">
      <SwiperSection />

      <h2 className="storefront-title">Event Essentials Store</h2>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))
        ) : (
          <p className="no-products">No products available</p>
        )}
      </div>
    </div>
  );
};

export default StoreFront;
