import TodoPage from "./Todo/TodoPage";
import RegisterPage from "./Register/RegisterPage";
import LoginPage from "./Login/LoginPage";
import { Route, Routes } from "react-router-dom";
const CommonPage = () => {
    return (
    <div>
      <Routes>
        <Route path="/" element={<RegisterPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/todos/:username" element={<TodoPage />} />
      </Routes>
    </div>
  );
};

export default CommonPage;
