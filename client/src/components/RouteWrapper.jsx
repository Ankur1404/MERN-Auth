import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { Navigate,Outlet } from 'react-router-dom'
const RouteWrapper = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext)
  if(isLoading)
  {
    //loader instead
    return null;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace/>
  }
  return <Outlet />;
}

export default RouteWrapper;
