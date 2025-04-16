import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; 
import { API_PATHS } from '../../utils/apiPaths'; 
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext'; 

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); 
      
      axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log("Google Auth user data:", res.data); 
        updateUser(res.data); 
        navigate("/dashboard", { replace: true }); 
      })
      .catch((err) => {
        console.error("Error fetching user info:", err);
        navigate("/login", { replace: true }); 
      });
    }
  }, [navigate, updateUser]);

  return (
    <div>Loading...</div> 
  );
};

export default GoogleAuthCallback;
