import avatar from '../assets/avatar.png';
import logo from '../assets/logo.png';
import { FaSignOutAlt } from 'react-icons/fa';  
import Cookies from 'js-cookie';
import { useStatus } from '../StatusContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/baseUrl';

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);

  const token = Cookies.get('token');

  const handleLogout = () => {
    Cookies.remove('role');
    Cookies.remove('token');
    window.location.reload();
  };
  
  const getUserInfo = async () => {
    try {
      const res = await axios.get(BASE_URL + '/users/info', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = res.data.data;
      setUserInfo(data)
    }catch(err) { 
      console.log(err)
    }
  }

  useEffect(() => {
    getUserInfo();
  }, [])

  return (
    <header className="w-full bg-white shadow-md p-3 flex justify-between items-center">
        <span className='flex items-center gap-2'>
            <img src={logo} alt="Logo" className="w-[40px]" />
            <p>نظام ادارة الرعاية الصحية</p>
        </span>
        {
          token &&
          <div className="flex items-center gap-4">
              <span className='flex items-center gap-2'>
                  <img src={avatar} alt="Logo" className="w-[40px]" />
                  <p className='select-none'>{userInfo?.name || ''}</p>
              </span>
              <button 
                  onClick={handleLogout} 
                  className="flex items-center duration-200 text-red-500 hover:text-red-700"
              >
                  <FaSignOutAlt className="text-lg" />
              </button>
          </div>
        }
    </header>
  );
};

export default Navbar;
