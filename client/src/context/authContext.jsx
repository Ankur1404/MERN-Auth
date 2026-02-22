import { createContext, useEffect, useState } from "react";
// import axios from "axios";
import { toast } from "react-toastify";
export const AuthContext = createContext(null);
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { setAccessToken, clearAccessToken } from "../../utils/tokenStorage";

const backendurl = import.meta.env.VITE_BACKEND_URL;

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  //user-data
const getUserProfile = async () => {
  try {
    const { data } = await axiosInstance.get("/api/user/profile");

    if (data.success) {
      setUserData(data.user);
      setIsLoggedIn(true);
    } else {
      toast.error(data.message || "Failed to load user");
    }

  } catch (error) {
    clearAccessToken();
    setIsLoggedIn(false);
  }
};
  //is-authenticated
  //   const getAuthStatus = async () => {
  //     try {
  //       axios.defaults.withCredentials = true;
  //       const { data } = await axios.get(backendurl + "/api/auth/is-auth");
  //       if (data.success) {
  //         setIsLoggedIn(true);
  //         getUserProfile();
  //       } else {
  //         setIsLoggedIn(false);
  //       }
  //     } catch (error) {
  //       setIsLoggedIn(false);
  //       toast.error(error?.response?.data?.message || "Auth check failed");
  //       navigate("/login");
  //     }
  //   };

  const silentRefresh = async () => {
    try {
      const { data } = await axiosInstance.post("/api/auth/refresh-token");

      if (data.success) {
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
        await getUserProfile();
      }
    } catch (error) {
      clearAccessToken();
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
  try {
    await axiosInstance.post("/api/auth/logout");
  } catch (error) {}

  clearAccessToken();
  setIsLoggedIn(false);
  setUserData(null);
  setIsLoading(false);
  navigate("/login");
};

  useEffect(() => {
    silentRefresh();
  }, []);

  const value = {
    backendurl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserProfile,
    logout,
    // getAuthStatus,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

export default AuthContextProvider;
