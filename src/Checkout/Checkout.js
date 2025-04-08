import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Checkout.css';
import axios from "axios";
const BackEndURL = process.env.REACT_APP_BACKEND_URL;
const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve amount passed from cart
  const totalAmount = location.state?.totalAmount || 500; // Default to ₹500 if not passed

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.delete(`${BackEndURL}/cart/clear`);

      setPaymentSuccess(true);

      setTimeout(() => {
        navigate("/cart");
      }, 5000);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      alert("❌ Failed to process order. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="back-btn" onClick={() => window.history.back()}>&#8592;</button>
        <div className="title">Checkout</div>
        <div></div>
      </div>

      {paymentSuccess ? (
        <div className="success-message">
          <h2>✅ Payment Successful!</h2>
          <p>Thank you for your purchase, {formData.name}.</p>
          <p>Amount Paid: ₹{totalAmount}</p>
          <p>Redirecting to your cart in 5 seconds...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Shipping Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="confirm-btn">Pay ₹{totalAmount}</button>
        </form>
      )}
    </div>
  );
};

export default Checkout;
