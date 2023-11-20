import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Navbar = ({ title = "Title here" }) => {
  const buyPremium = async () => {
    const { token } = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get("/purchase/premium", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleOpenRazorPay(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenRazorPay = (data) => {
    const options = {
      key: import.meta.env.VITE_RAZOR_PAY_KEY,
      name: "Expense Tracker",
      order_id: data.id,
      handler: async function (response) {
        try {
        //   const result = await axios.post("/premium/verify", response, {
        //     headers: {
        //       Authorization: `Bearer ${user.token}`,
        //     }
        //   });
        //   if (result.data.success) {
        //       alert("Payment Success");
        //   }
        } catch (error) {
          console.log(error);
        }
      }
    };
    const razorpayObject = new window.Razorpay(options);
    razorpayObject.open();
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <NavLink to="/dashboard" className="text-white text-lg font-bold">
            {title}
          </NavLink>

          <div className="flex space-x-4">
            <NavLink to="/" className="text-white">
              Home
            </NavLink>
            <NavLink to="/sign-in" className="text-white">
              Sign-in
            </NavLink>
            <NavLink to="#" className="text-white">
              Services
            </NavLink>
            <NavLink to="#" className="text-white">
              Contact
            </NavLink>
            <button
              onClick={buyPremium}
              className="bg-white text-black px-3 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none"
            >
              Buy Premium
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
