import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import axios from 'axios'
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, backendurl, setUserData, setIsLoggedIn } =
    useContext(AuthContext);
  const isActive = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);


  const sendVerificationOtp = async()=>{
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendurl + '/api/auth/send-otp')
      if(data.success)
      {
        navigate('/email-verify')
      }

    }catch(error)
    {
      toast.error(error.message)
    }
  }


  const logout = async() =>{
    try{
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendurl + '/api/auth/logout')
        data.success && setIsLoggedIn(false)
        data.success && setUserData(false)
        navigate('/')
    }catch(error)
    {
      toast.error(error.message)
    }
  }
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-red-600">
          Auth Solutions
        </Link>

        <nav className="hidden md:flex items-center gap-6 relative">
          {userData ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200"
              >
                {userData.name?.[0]?.toUpperCase()}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg text-sm py-1">
                  {!userData?.isVerified && (
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setMenuOpen(false);
                        sendVerificationOtp();
                      }}
                    >
                      Verify Email
                    </button>
                  )}
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      setMenuOpen(false);
                      logout()
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={
                isActive("/login")
                  ? "text-red-600 font-semibold"
                  : "text-gray-700"
              }
              onClick={() => navigate("/login")}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Button */}
        <button className="md:hidden" onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-8 text-lg">
          <button
            className="absolute top-6 right-6"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>

          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/login" onClick={() => setOpen(false)}>
            Login
          </Link>
          <Link to="/email-verify" onClick={() => setOpen(false)}>
            Verify Email
          </Link>
          <Link to="/reset-password" onClick={() => setOpen(false)}>
            Reset Password
          </Link>
        </div>
      )}
    </header>
  );
}
