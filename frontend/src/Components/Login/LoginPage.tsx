import  { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../TodoStore/UserReducer";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/login", {
        username,
        password,
      });

      if (response.data.token) {
        const { token, user } = response.data;

        // Dispatch login action with the required details
        dispatch(
          loginUser({
            username: user.username,
            password: user.password,
            authToken: token,
          })
        );
        // Remove spaces from the username and navigate
        const cleanUsername = removeSpacesFromUsername(user.username);
        navigate(`/todos/${cleanUsername}`);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        toast.error("Account does not exist.");
      }

      console.error(
        "Error logging in user:",
        error.response?.data?.error || error.message
      );
    }
  };

  // Function to remove spaces from a username
  function removeSpacesFromUsername(username: any) {
    return username.replace(/\s+/g, "");
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <ToastContainer />
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} method="post">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
