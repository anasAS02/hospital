import avatar from '../assets/avatar.png';
import logo from '../assets/logo.png';
import { FaSignOutAlt } from 'react-icons/fa';  
import Cookies from 'js-cookie';
import { useStatus } from '../StatusContext';

const Navbar = () => {
  const {isLoggedIn, setIsLoggedIn} = useStatus();

  const handleLogout = () => {
    Cookies.remove('role');
    Cookies.remove('token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <header className="w-full bg-white shadow-md p-3 flex justify-between items-center">
        <span className='flex items-center gap-2'>
            <img src={logo} alt="Logo" className="w-[40px]" />
            <p>نظام ادارة الرعاية الصحية</p>
        </span>
        {
          isLoggedIn &&
          <div className="flex items-center gap-4">
              <span className='flex items-center gap-2'>
                  <img src={avatar} alt="Logo" className="w-[40px]" />
                  <p className='select-none'>كريم الأمير</p>
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
