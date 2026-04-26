import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Header from './components/Navbar'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RouteWrapper from './components/RouteWrapper'
import PublicRoute from './components/PublicRoute'

const App = () => {
  return (
    <div>
      <Header />
    
      <main className="pt-20 md:pt-24 min-h-screen bg-gradient-to-br from-red-100 to-red-400">
       < ToastContainer/>
        <Routes>
          <Route element={<RouteWrapper/>}>
            <Route path='/' element={<Home />} />
          </Route>
          
          <Route element={<PublicRoute/>}>
          <Route path='/login' element={<Login />} />

          </Route>


          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />
         
        </Routes>
      </main>
    </div>
  )
}

export default App
