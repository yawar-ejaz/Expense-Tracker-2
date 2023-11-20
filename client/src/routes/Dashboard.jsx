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
      <div className="bg-white p-2 rounded w-full">
        <form
          onSubmit={handleSubmit(createExpense)}
          className="w-80 mx-auto flex flex-col gap-3"
        >
          <div className="flex flex-row gap-2">
            <input
              type="number"
              placeholder="Amount"
              className="mt-1 p-2 w-40 border rounded-md text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
              autoComplete="off"
              required
              {...register("amount")}
            />
            <select
              className="border border-gray-800 rounded-md focus:outline-none focus:border-gray-500 w-40"
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
              className="mt-1 p-2 w-full border rounded-md text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
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
