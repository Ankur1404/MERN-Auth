import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const Header = () => {
  
  const navigate = useNavigate()
  const { isLoggedIn,userData } = useContext(AuthContext)
  return (
    <div className='flex flex-col items-center justify-center mt-20 px-4'>
      <h1>Hii,There{userData ? userData.name:"Dev"}</h1>
      {isLoggedIn ? <h1 className='py-4'>Woah!
        <span className='text-red-500'> you are in {userData?.name}</span>
         </h1> :<h1 className='py-4'>Let's
        <span className='text-red-500'> authenticate </span> 
         you !!</h1>}
      
      <button onClick={() => navigate('/login')} className='cursor-pointer border border-gray-500 rounded-full px-4 py-2 hover:bg-black hover:text-white transition-all'>Get Started</button>
    </div>
  )
}

export default Header
