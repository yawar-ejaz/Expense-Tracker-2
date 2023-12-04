import React, { useState } from "react";
import axios from "axios";

const ExpenseTable = ({ expenses, getExpenses }) => {
//   const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
    
//   const itemsPerPage = 10;

  const dateOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  const deleteExpense = async (expenseId) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("user"));
      const result = await axios.delete(`/expense/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getExpenses();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
  };  

  if (expenses.length === 0) {
    return (
      <div className="container mx-auto text-center">
        <h1 className="text-2xl font-bold">You currently have no expenses</h1>
      </div>
    );
  }

  return (
    <>
      <table className="table table-zebra table-md my-4">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">AMOUNT</th>
            <th scope="col">CATEGORY</th>
            <th scope="col">DESCRIPTION</th>
            <th scope="col">DATE</th>
            <th scope="col">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.description}</td>
              <td>
                {new Date(expense.date).toLocaleDateString(
                  "en-US",
                  dateOptions
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline btn-error"
                  onClick={() => deleteExpense(expense._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ExpenseTable;
