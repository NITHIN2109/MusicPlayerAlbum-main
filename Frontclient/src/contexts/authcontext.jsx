import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/config";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [Username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(BASE_URL  , {
          withCredentials: true,
        });
        if (res.status === 200) {
          setIsLoggedIn(true);
          setIsAdmin(res.data.isadmin);
          setUsername(res.data.name);
        } else {
          setUsername(false);
        }
      } catch (error) {
        console.log(error);
        // setIsDataLoaded(true);
        // alert(error.response?.data?.message || "Error fetching data");
        navigate("/Home");
      } finally {
        setIsDataLoaded(true);
      }
    }

    fetchData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // const login = async (loginData) => {
  //   try {
  //     const res = await axios.post("https://musicplayeralbum-main.onrender.com/Login", loginData, {
  //       withCredentials: true,
  //     });

  //     if (res.status === 200) {
  //       navigate("/dashboard/home");
  //       const setCookieHeader = res.headers["set-Cookie"];
  //       console.log("Set-Cookie Header:", setCookieHeader);
  //       setIsLoggedIn(true);
  //       setIsAdmin(res.data.isadmin);
  //       console.log(res.data.isadmin);
  //       setUsername(res.data.name);
  //     }

  //     console.log(res);
  //     console.log(res.data.message);
  //     alert(res.data.message);
  //   } catch (err) {
  //     if (err.response?.status === 500) console.log(err);
  //     if (err.response?.status === 401) alert(err.response.data.message);
  //   }
  // };
  // const login = async (loginData) => {
  //   try {
  //     const res = await axios.post("https://musicplayeralbum-main.onrender.com/Login", loginData, {
  //       withCredentials: true,
  //     });

  //     if (res.status === 200) {
  //       navigate("/dashboard/home");
  //       const setCookieHeader = res.headers["set-Cookie"];
  //       console.log("Set-Cookie Header:", setCookieHeader);
  //       setIsLoggedIn(true);
  //       setIsAdmin(res.data.isadmin);
  //       console.log(res.data.isadmin);
  //       setUsername(res.data.name);
  //     }

  //     console.log(res);
  //     console.log(res.data.message);
  //   } catch (err) {
  //     throw new Error(
  //       err.response?.data?.message || "An error occurred during login"
  //     );
  //   }
  // };

  const login = async (loginData) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/Login`,
        loginData,
        {
          withCredentials: true,
        }
      );
  
      if (res.status === 200) {
        console.log(res);
        const token = res.data.token; // Assuming the token is returned in the response data
        console.log(token)
        if (!axios.defaults.headers.common) {
          axios.defaults.headers.common = {};
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log(token)
        navigate("/dashboard/home");
        setIsLoggedIn(true);
        setIsAdmin(res.data.isadmin);
        setUsername(res.data.name);
      }
  
      console.log(res);
      console.log(res.data.message);
    } catch (err) {
      console.log(err)
      throw new Error(
        err.response?.data?.message || "An error occurred during login"
      );
    }
  };
  
  const logout = (e) => {
    e.preventDefault();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
    delete axios.defaults.headers.common["Authorization"];
    axios.defaults.headers = {};
    navigate("/Login");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const values = { isLoggedIn, isAdmin, login, Username, logout };

  if (!isDataLoaded) {
    return <div>Loading...54321</div>;
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
