import { store } from "../redux/store";
import { setAuthenticated, setAuthLoader, setUserData } from "../redux/slices/authSlice";
import { clearToken } from "./getToken";


// interface AuthUser {
//     id: string;
//     email: string;
//     name: string;
//   }
  
export const updateAuthState = (user: any) => {
    store.dispatch(setUserData(user));
    store.dispatch(setAuthenticated(true));
    store.dispatch(setAuthLoader(false));
  };

  export const resetUserData = (user: any) => {
    store.dispatch(setUserData(user));
  };
  
  
export const clearAuthState = () => {
    clearToken();
    store.dispatch(setUserData(null));
    store.dispatch(setAuthenticated(false));
    store.dispatch(setAuthLoader(false));
  };

export const handleAuthError = (error: unknown) => {
    console.error("Auth Error:", error);
    store.dispatch(setAuthLoader(false));
    store.dispatch(setAuthenticated(false));
    store.dispatch(setUserData(null))
    throw error instanceof Error ? error : new Error('Authentication failed');
  };

  
