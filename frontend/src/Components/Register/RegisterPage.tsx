import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios  from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const RegisterPage= () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState ("");
  const [password, setPassword] = useState  ("");
  const [confirmPassword, setConfirmPassword] = useState ("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/", {
        username,
        password,
      });

      if (response.status === 201) {
        navigate("/login");
      } else if (response.status === 400) {
        toast.error("Account already created!");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  const handleUsernameChange = (e:any) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <ToastContainer />
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit} method="post">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Register
          </button>
          <p className="text-center mt-4 text-gray-700">
            Already have an account?{" "}
            <button onClick={goToLoginPage} className="text-blue-500">
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
