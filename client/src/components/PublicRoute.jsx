
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {

  const {isLoggedIn,isLoading} = useContext(AuthContext)
  if(isLoading)
  { 
    return null;
    
  }

  if(isLoggedIn)
  {
    return <Navigate to="/" replace/>
  }

  return <Outlet />
}

export default PublicRoute;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        