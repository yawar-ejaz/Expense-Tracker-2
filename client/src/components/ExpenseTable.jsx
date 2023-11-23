import React from "react";
import axios from "axios";

const ExpenseTable = ({ expenses, getExpenses }) => {
  const deleteExpense = async (expenseId) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("user"));
      const result = await axios.delete(`/expense/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getExpenses();
      //   expenses = result.data;
    } catch (error) {
      console.log(error);
    }
  };

  if (expenses.length === 0) {
    return <h1>You have no expenses</h1>;
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
            <th scope="col">DELETE</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.description}</td>
              <td>{expense.date}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
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
