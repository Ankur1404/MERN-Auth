import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { getAuthStatus } = useContext(AuthContext);

  useEffect(() => {
    const syncAuth = async () => {
      await getAuthStatus();
      await new Promise(resolve => setTimeout(resolve,3000));
      navigate('/');
    };
    syncAuth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Welcome!</h1>
        <p className="text-gray-600 mb-4">Signing you in...</p>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}