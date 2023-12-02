import "./App.css";
import {
  SignIn,
  SignUp,
  Root,
  Dashboard,
  Leaderboard,
  ForgotPassword,
  ResetPassword,
  Report
} from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/download-report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
