import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Checkout.css';
import axios from "axios";

// Environment variables (make sure they are defined correctly)
const BackEndURL = process.env.REACT_APP_BACKEND_URL;
const KEY = process.env.REACT_APP_KEYPAYMENT;

const Checkout = () => {
  const [formData, setFormData] = useState({ name: "", address: "" });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const totalAmount = location.state?.totalAmount || 500;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!KEY || KEY === "undefined") {
      alert("❌ Razorpay Public Key (REACT_APP_KEYPAYMENT) is missing.");
      return;
    }

    try {
      const orderResponse = await axios.post(`${BackEndURL}/create-order`, {
        amount: totalAmount * 100,
      });

      const { id: order_id, currency } = orderResponse.data;

      const options = {
        key: KEY,
        amount: totalAmount * 100,
        currency: currency,
        name: "My Shop",
        description: "Product Purchase",
        order_id: order_id,
        handler: async function (response) {
          try {
            await axios.post(`${BackEndURL}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setPaymentSuccess(true);

            setTimeout(() => {
              navigate("/cart");
            }, 5000);
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("❌ Payment verification failed");
          }
        },
        prefill: {
          name: formData.name,
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("❌ Failed to process order. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="back-btn" onClick={() => window.history.back()}>
          &#8592;
        </button>
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

          <button type="submit" className="confirm-btn">
            Pay ₹{totalAmount}
          </button>
        </form>
      )}
    </div>
  );
};

export default Checkout;
