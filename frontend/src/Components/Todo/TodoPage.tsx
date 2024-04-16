// @ts-nocheck
import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import TodoCard from "./TodoCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos, addTodo } from "../TodoStore/TodoReducers";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../TodoStore/UserReducer";
import Avatarr from "./Avatar";

const TodoPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mytodos = useSelector((state: any) => state.todos.todos);
  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  );

  const status = useSelector((state: any) => state.user.status);
  const username = useSelector((state: any) => state.user.username);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const description = newTodoText;

  const handleAddTodo = () => {
    dispatch(addTodo({ description, username, status }));
    setNewTodoText("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTodos()).catch((error: string) => {
        console.error("Error fetching todos:", error);
      });
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, dispatch]);

  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const loggingOutUser = () => {
    dispatch(logoutUser());
  };

  // Filter todos based on their status
  const incompleteTodos = mytodos.filter((todo: any) => !todo.status);
  const completedTodos = mytodos.filter((todo: any) => todo.status);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodoText(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <Avatarr loggingOutUser={loggingOutUser} />
      <div className="flex w-[22rem] md:w-[50rem] items-center">
        <input
          type="text"
          placeholder="Add a new todo"
          className="border border-gray-300 rounded-l-md px-4 py-2 flex-grow shadow-sm"
          value={newTodoText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md transition duration-300 ease-in-out"
          onClick={handleAddTodo}>
          Add Todo
        </button>
      </div>

      {mytodos.length > 0 ? (
        <>
          <div className="mt-8">
            {/* Render incomplete todos */}
            <div className="mb-5">
              {incompleteTodos.map((todo: any) => (
                <div key={todo._id} className="my-3">
                  <TodoCard todo={todo} />
                </div>
              ))}
            </div>

            {/* Button to toggle the visibility of completed tasks */}
            {completedTodos.length > 0 && (
              <button
                className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 border border-gray-300 rounded-md mb-4"
                onClick={toggleShowCompleted}>
                {showCompleted ? (
                  <>
                    <KeyboardArrowDownIcon /> Hide Completed {"("}
                    {completedTodos.length}
                    {")"}
                  </>
                ) : (
                  <>
                    <KeyboardArrowRightIcon /> Show Completed {"("}
                    {completedTodos.length}
                    {")"}
                  </>
                )}
              </button>
            )}

            {/* Render completed todos if showCompleted is true */}
            {showCompleted &&
              completedTodos.map((todo: any) => (
                <div key={todo._id} className="my-3">
                  <TodoCard todo={todo} />
                </div>
              ))}
          </div>
        </>
      ) : (
        <h1 className="text-2xl px-6 text-center md:text-3xl mt-48">
          Ready to conquer your day? Start making todos now 📝
        </h1>
      )}
    </div>
  );
};

export default TodoPage;
