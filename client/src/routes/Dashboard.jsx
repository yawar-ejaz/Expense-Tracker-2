import React from "react";
import { useForm } from "react-hook-form";
import { Navbar } from "../components";
import axios from "axios";

function Dashboard() {
  const { handleSubmit, register, reset } = useForm();

  const createExpense = async (data) => {
    const { token } = JSON.parse(localStorage.getItem("user"));
    try {
      const result = await axios.post("/expense", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(result?.data?.message);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
    reset();
  };
  return (
    <>
      <Navbar title="ADD EXPENSE" />

      {/* <div className="card w-96 bg-base-100 shadow-xl"> */}
      {/* <div className="card-body"> */}
      {/* <h2 className="card-title">Shoes!</h2> */}
      <div className="card w-[90] md:w-[60] lg:w-[40] max-w-md bg-base-100 p-2 shadow-xl mx-auto">
        <form onSubmit={handleSubmit(createExpense)} className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Amount"
              className="input input-bordered w-full"
              autoComplete="off"
              required
              {...register("amount")}
            />
            <select
              className="select select-bordered w-full"
              {...register("category")}
            >
              <option value="food">Food</option>
              <option value="rent">Rent</option>
              <option value="fuel">Fuel</option>
              <option value="fashion">Fashion</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Description (optional)"
              className="input input-bordered w-full"
              autoComplete="off"
              {...register("description")}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 btn btn-neutral normal-case"
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
}

export default Dashboard;
