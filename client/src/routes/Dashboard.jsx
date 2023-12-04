import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navbar, ExpenseTable } from "../components";
import axios from "axios";

function Dashboard() {
  const { handleSubmit, register, reset } = useForm();
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getExpenses = async () => {
    const { token } = JSON.parse(localStorage.getItem("user"));
    try {
      const result = await axios.get(`/expense?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(result.data.expenses);
      setTotalPages(result.data.totalPages);
      setPage(result.data.currentPage);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
  };

  useEffect(() => {
    getExpenses();
  }, [page]);

  const createExpense = async (data) => {
    const { token } = JSON.parse(localStorage.getItem("user"));
    try {
      const result = await axios.post("/expense", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(result?.data?.message);
      getExpenses();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
    reset();
  };

  //const totalPages = Math.ceil(expenses.length / itemsPerPage);
  //   const startIndex = (page - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   const currentExpenses = expenses.slice(startIndex, endIndex);

  const increasePage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const decreasePage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <>
      <Navbar title="ADD EXPENSE" />

      <div className="card w-[90%] md:w-[60%] lg:w-[40%] max-w-md bg-base-100 mt-2 mb-5 shadow-md mx-auto sm:w-[75%]">
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
              placeholder="Description"
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
      <ExpenseTable expenses={expenses} getExpenses={getExpenses} />
      <div className="pagination flex space-x-4 my-auto">
        <button className="btn btn-sm btn-outline" onClick={decreasePage}>
          Prev
        </button>
        <h3>
          {page} of {totalPages}
        </h3>
        <button className="btn btn-sm btn-outline" onClick={increasePage}>
          Next
        </button>
      </div>
    </>
  );
}

export default Dashboard;
