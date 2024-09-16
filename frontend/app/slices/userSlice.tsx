import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isLoggedIn: boolean;
  token: string | null;
  tokenExpiration: number | null; // Store the expiration time as a timestamp
  userInfo: {
    username: string;
    profilePicture?: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  token: null,
  tokenExpiration: null, // Initialize expiration time
  userInfo: null,
};

// Helper function to check if the token is expired
const isTokenExpired = (expiration: number | null) => {
  if (!expiration) return true; // If no expiration, consider it expired
  return Date.now() > expiration; // Compare current time to expiration
};

// On page load, check if there's a token and expiration in localStorage
if (typeof window !== 'undefined') {
  const tokenFromLocalStorage = localStorage.getItem('jwt');
  const userInfoFromLocalStorage = localStorage.getItem('userInfo');
  const tokenExpirationFromLocalStorage = localStorage.getItem('tokenExpiration');

  if (
    tokenFromLocalStorage &&
    userInfoFromLocalStorage &&
    tokenExpirationFromLocalStorage &&
    !isTokenExpired(Number(tokenExpirationFromLocalStorage)) // Check if token is still valid
  ) {
    initialState.token = tokenFromLocalStorage;
    initialState.userInfo = JSON.parse(userInfoFromLocalStorage);
    initialState.tokenExpiration = Number(tokenExpirationFromLocalStorage);
    initialState.isLoggedIn = true;
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; userInfo: UserState['userInfo']; tokenExpiration: number }>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      state.tokenExpiration = action.payload.tokenExpiration;

      // Store token, user info, and expiration time in localStorage
      localStorage.setItem('jwt', action.payload.token);
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
      localStorage.setItem('tokenExpiration', action.payload.tokenExpiration.toString());
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.userInfo = null;
      state.tokenExpiration = null;

      // Remove token, user info, and expiration time from localStorage
      localStorage.removeItem('jwt');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('tokenExpiration');
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
