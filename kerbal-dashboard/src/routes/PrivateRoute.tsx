import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";


const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('token') !== null
  const navigate = useNavigate()
  const toast = useToast()
  const toastId = 'login-first-error'

  useEffect(() => {
    if (!isAuthenticated && !toast.isActive(toastId)) {
      toast({
        id: toastId,
        position: 'top',
        status: 'error',
        duration: 2000,
        description: 'Please login first'
      })
      navigate('/login')
    }
  }, [isAuthenticated, navigate, toast])


  return <Outlet/>
}

export default PrivateRoute;
