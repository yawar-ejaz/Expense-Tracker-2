import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title = "Title here" }) => {
  const navigate = useNavigate();
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
          const { token } = JSON.parse(localStorage.getItem("user"));
          const result = await axios.post("/premium/verify", response, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (result.data.success) {
            alert("Payment Success");
          }
        } catch (error) {
          console.log(error);
        }
      },
    };
    const razorpayObject = new window.Razorpay(options);
    razorpayObject.open();
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <NavLink to="/dashboard" className="text-white my-auto">
              <FaHome className="h-6 w-6" />
            </NavLink>
            <h1 className="text-white text-lg font-bold">{title}</h1>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={buyPremium}
              className="bg-white text-black px-3 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none"
            >
              Buy Premium
            </button>
            <button
              onClick={() => navigate("/leaderboard")}
              className="bg-white text-black px-3 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none"
            >
              Leaderboard
            </button>
            <button
              onClick={() => navigate("/download-report")}
              className="bg-white text-black px-3 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none"
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
