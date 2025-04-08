import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.css";
const BackEndURL = process.env.REACT_APP_BACKEND_URL;
const Product = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    checkLoginStatus();
    fetchProducts();
    updateCartCount();
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BackEndURL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const updateCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
  
      const response = await axios.get(`${BackEndURL}/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const cartItems = response.data;
      const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };
  

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // 👈 Get userId from localStorage
      if (!token || !userId) {
        alert("Please log in to add items to the cart.");
        navigate("/login");
        return;
      }
  
      const response = await axios.post(
        `${BackEndURL}/cart`,
        {
          userId, // 👈 Send userId in request
          productId: product._id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        console.log("Item added to cart:", response.data);
        updateCartCount();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  

  return (
    <div>
      <header>
        <div className="navbar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            &#8592;
          </button>
          <h1>Pulses</h1>
          <button className="cart-btn" onClick={() => navigate("/cart")}>
            🛒 <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <main className="product-container">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>1KG</p>
              <p className="price">₹{product.price}</p>
              <button className="add-btn" onClick={() => addToCart(product)}>
                ADD
              </button>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </main>
    </div>
  );
};

export default Product;
