import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for user state
interface UserState {
  username: string | null;
  password: string | null;
  authToken: string | null;
  isAuthenticated: boolean;
}

// Define the initial state of the user reducer
const initialState: UserState = {
  username: null,
  password: null,
  authToken: null,
  isAuthenticated: false,
};

// Load user details from local storage
const loadUserFromLocalStorage = (): UserState => {
  const userData = localStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData) as UserState;
  }
  return initialState;
};

// Create the user slice using Redux Toolkit's createSlice function
const userSlice = createSlice({
  name: "user",
  initialState: loadUserFromLocalStorage(),
  reducers: {
    // Action to log in a user
    loginUser: (
      state,
      action: PayloadAction<{
        username: string;
        authToken: string;
        password: string;
      }>
    ) => {
      const { username, authToken, password } = action.payload;
      state.username = username;
      state.password = password;
      state.authToken = authToken;
      state.isAuthenticated = true;

      // Store user details in local storage
      localStorage.setItem("user", JSON.stringify(state));
    },
    // Action to log out a user
    logoutUser: (state) => {
      state.username = null;
      state.authToken = null;
      state.isAuthenticated = false;

      // Clear user details from local storage
      localStorage.removeItem("user");
    },
  },
});

// Export the actions for use in other components
export const { loginUser, logoutUser } = userSlice.actions;

// Export the reducer for integration into the Redux store
export default userSlice.reducer;
