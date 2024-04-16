import { combineReducers, configureStore } from "@reduxjs/toolkit";
import todoReducer from "./TodoReducers";
import userReducer from "./UserReducer";

// Combine reducers into a rootReducer
const rootReducer = combineReducers({
  todos: todoReducer,
  user: userReducer,
});

const Store = configureStore({
  reducer: rootReducer,
});

export default Store;
