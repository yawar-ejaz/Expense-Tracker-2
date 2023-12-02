import { useEffect, useState } from "react";
import { Header, LeaderboardTable, Navbar } from "../components";
import axios from "axios";

const Leaderboard = () => {
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const showLeaderboard = async () => {
          const { token } = JSON.parse(localStorage.getItem("user"));
          try {
            const response = await axios.get("/premium/leaderboard", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setAccounts(response.data);
          } catch (error) {
              console.log(error);
              alert(error.response?.data?.message);
          }
        };
        showLeaderboard();
    }, []);
  
  return (
    <>
      <Navbar title="Leaderboard" />
      <LeaderboardTable accounts={accounts} />
    </>
  );
};

export default Leaderboard;
