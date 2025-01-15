import { useNavigate } from 'react-router-dom';
import '../App.css';
import { Button } from '@nextui-org/react';

function redirectToCAS() {
  const CAS_SERVER = 'https://cas.usask.ca/cas';
  const FRONTEND_URL = 'https://starr-lab-server.usask.ca';
  const serviceURL = `${FRONTEND_URL}/cas-callback`;

  window.location.href = `${CAS_SERVER}/login?service=${encodeURIComponent(
    serviceURL
  )}`;
}

export default function FrontPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  if (token) {
    navigate('/modify');
    return null; // Optional: Display a loading spinner while redirecting
  }

  const loginClicked = () => {
    redirectToCAS();
  };

  return (
    <div className="flex items-center justify-center p-[10%]">
      <div className="p-8 border border-gray-300 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-4 text-wrap">
          STARR Lab <br />
          Rad-Effects Database
        </h1>
        <h1 className="mb-4 py-10 pt-14 text-2xl">Login</h1>
        <Button
          className="bg-usask-green text-white text-2xl px-12 py-6 rounded-lg "
          onClick={loginClicked}
        >
          Usask Login
        </Button>

        <p className="pt-[40%] text-sm text-gray-500">
          Unable to login? Contact the system administrator
        </p>
      </div>
    </div>
  );
}
