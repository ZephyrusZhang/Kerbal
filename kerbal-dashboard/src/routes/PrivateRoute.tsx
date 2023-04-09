import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";


const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('token')
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        position: 'top',
        status: 'error',
        description: 'Please login first'
      })
      navigate('/sign-in')
    }
  }, [isAuthenticated, navigate, toast])


  return <Outlet/>
}

export default PrivateRoute;
