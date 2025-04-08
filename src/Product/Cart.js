import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Cart.css';
const BackEndURL = process.env.REACT_APP_BACKEND_URL;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); // Hook for redirection

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
    if (!token) {
      navigate("/login"); // Redirect to login page if not logged in
    } else {
      fetchCart();
    }
  };

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("userId"); // fetch userId
      const token = localStorage.getItem("token");
  
      if (!userId || !token) return;
  
      const response = await axios.get(`${BackEndURL}/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  

  const updateQuantity = async (productId, change) => {
    try {
      const userId = localStorage.getItem("userId"); // ✅ correct key
      const token = localStorage.getItem("token");
  
      if (!userId || !token) {
        alert("User not authenticated.");
        return;
      }
  
      const response = await axios.put(
        `${BackEndURL}/cart/update`,
        { userId, productId, change },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setCart(response.data); // update UI with new cart
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  

  const removeFromCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.delete(`${BackEndURL}/cart/remove/${userId}/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.productId.price * item.quantity, 0);
  };

  const goToCheckout = () => {
    navigate("/checkout", { state: { totalAmount: calculateTotal() } });
  };

  return (
    <div className="container mx-auto p-4 max-w-md bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <button onClick={() => window.history.back()} className="text-2xl">←</button>
        <h2 className="text-xl font-bold">Your Cart</h2>
      </div>

      <div className="p-4">
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item._id} className="flex items-center p-3 mb-2 bg-gray-50 rounded shadow">
              <img src={item.productId.image} alt={item.productId.name} className="w-12 h-12 rounded mr-4 cartimg" />
              <div className="flex-1">
                <strong>{item.productId.name}</strong>
                <p>1KG</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.productId._id, -1)} className="px-2 bg-gray-300 rounded">➖</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId._id, 1)} className="px-2 bg-gray-300 rounded">➕</button>
              </div>
              <p className="font-bold ml-4">₹{item.productId.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item.productId._id)} className="ml-4 text-red-600">❌</button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-gray-100">
        <h3 className="text-lg font-bold">Total: ₹{calculateTotal()}</h3>
      </div>

      <button onClick={goToCheckout} className="w-full p-3 bg-yellow-500 text-lg font-bold">
        PAY
      </button>
    </div>
  );
};

export default Cart;
