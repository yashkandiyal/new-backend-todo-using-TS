import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

// Define the type for a Todo item
interface Todo {
  _id: string;
  description: string;
  username: string;
  status: string;
}

// Define the initial state type
interface TodoState {
  todos: Todo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Define the initial state
const initialState: TodoState = {
  todos: [],
  status: "idle",
  error: null,
};

// Define the async thunk for fetching todos from the backend
export const fetchTodos = createAsyncThunk<Todo[], void, { state: any }>(
  "todos/fetchTodos",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().user.authToken as string;

    const response = await axios.get<Todo[]>(
      `http://localhost:4000/todos/${thunkAPI.getState().user.username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

// Define the async thunk for adding a new todo
export const addTodo = createAsyncThunk<
  Todo,
  { description: string; username: string; status: string },
  { state: any }
>("todos/addTodo", async ({ description, username, status }, thunkAPI) => {
  const token = thunkAPI.getState().user.authToken as string;

  try {
    const response: AxiosResponse<Todo> = await axios.post<Todo>(
      `http://localhost:4000/todos/${username}`,
      { description, username, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

// Define the async thunk for removing a todo
export const removeTodo = createAsyncThunk<
  string,
  { username: string; todoId: string },
  { state: any }
>("todos/removeTodo", async ({ username, todoId }, thunkAPI) => {
  const token = thunkAPI.getState().user.authToken as string;

  const url = `http://localhost:4000/todos/${username}/${todoId}`;

  await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return todoId;
});

// Define the async thunk for updating a todo
export const updateTodo = createAsyncThunk<
  { todoId: string; description: string },
  { todoId: string; description: string; username: string },
  { state: any }
>("todos/updateTodo", async ({ todoId, description, username }, thunkAPI) => {
  const token = thunkAPI.getState().user.authToken as string;

  await axios.put(
    `http://localhost:4000/todos/${username}/${todoId}`,
    { description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return { todoId, description };
});

// Define the async thunk for toggling the status of a todo
export const toggleTodoStatus = createAsyncThunk<
  Todo,
  { username: string; todoId: string },
  { state: any }
>("todos/toggleTodoStatus", async ({ username, todoId }, thunkAPI) => {
  const token = thunkAPI.getState().user.authToken as string;

  const response: AxiosResponse<Todo> = await axios.put<Todo>(
    `http://localhost:4000/todos/${username}/${todoId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
});

// Define the slice
export const todoSlice = createSlice({
  name: "Todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch todos";
      })
      .addCase(addTodo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.status = "succeeded";
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add todo";
      })
      .addCase(removeTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      })
      .addCase(
        updateTodo.fulfilled,
        (
          state,
          action: PayloadAction<{ todoId: string; description: string }>
        ) => {
          const { todoId, description } = action.payload;
          const index = state.todos.findIndex((todo) => todo._id === todoId);
          if (index !== -1) {
            state.todos[index].description = description;
          }
        }
      )
      .addCase(
        toggleTodoStatus.fulfilled,
        (state, action: PayloadAction<Todo>) => {
          const todoIndex = state.todos.findIndex(
            (todo) => todo._id === action.payload._id
          );

          // Update the todo status if the todo item was found
          if (todoIndex !== -1) {
            state.todos[todoIndex].status = action.payload.status;
          }
        }
      );
  },
});

export default todoSlice.reducer;
