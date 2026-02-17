import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
//user-data
  const getUserProfile = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendurl + "/api/user/profile");
      data.success
        ? setUserData(data.user)
        : toast.error(data.message || "Failed to load user");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load user");
    }
  };
//is-authenticated
  const getAuthStatus = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendurl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        getUserProfile();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      toast.error(error?.response?.data?.message || "Auth check failed");
    }
  };

  


  useEffect(() => {
    getAuthStatus();
  }, []);

  const value = {
    backendurl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserProfile,
    getAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export default AuthContextProvider;