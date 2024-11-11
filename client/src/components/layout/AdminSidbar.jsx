import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setOpenSidebar } from "../../store/reducers/authSlice";
import { logout } from "../../store/reducers/authSlice";
import { IoCloseSharp } from "react-icons/io5";

//import ConfirmModal from "../Confirm/ConfirmModal";
import { useState } from "react";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const handleLogout = () => {
    setIsModalOpen(true); // Open the confirmation modal
  };
  const confirmLogout = () => {
    dispatch(logout());
    // notify("you Logged out successfully", "success");
    navigate("/auth");
  };
  // Cancel the cancel action
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <aside
        id="sidebar-multi-level-sidebar"
        className={`w-60 md:w-1/4 z-50 fixed top-0 right-0 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className=" h-full py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          {/* Logo */}

          <div className="flex items-center text-darkest justify-between">
            <svg
              className="flex justify-center items-center py-4"
              width="70"
              height="110"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.1874 31.0452C2.72485 29.5873 2.54537 26.0904 4.84573 24.388L35.6436 1.59589C36.9481 0.630476 38.7066 0.54895 40.0948 1.38953L78.9721 24.9297C81.3858 26.3912 81.5683 29.8251 79.3231 31.5341L49.393 54.3169C48.0975 55.303 46.3335 55.4055 44.9325 54.5761L5.1874 31.0452Z"
                fill="#10197A"
              />
              <path
                d="M42.172 16V20.628H45.2344V24.6538H42.172V33.1699C42.172 33.8695 42.2982 34.357 42.5505 34.6323C42.8029 34.9075 43.3018 35.0452 44.0473 35.0452C44.6208 35.0452 45.1025 35.0108 45.4925 34.9419V39.0882C44.4487 39.4208 43.3591 39.5871 42.2237 39.5871C40.228 39.5871 38.7541 39.1168 37.8022 38.1763C36.8502 37.2358 36.3742 35.8079 36.3742 33.8925V24.6538H34V20.628H36.3742V16H42.172Z"
                fill="white"
              />
              <rect x="48.5996" y="35" width="5" height="5" fill="#7E95FF" />
            </svg>

            <button onClick={toggleSidebar}>
              <IoCloseSharp
                style={{ fontSize: "30px" }}
                className=" block md:hidden"
              />
            </button>
          </div>

          {/* pages */}
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                className={` mb-4 flex items-center p-2 group ${
                  isActive("/")
                    ? "bg-darkest dark:bg-gray-600 text-white rounded-r-lg"
                    : "text-darkest dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="ms-3 font-bold">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                onClick={handleLogout}
                className={`flex items-center p-2 rounded-lg group text-darkest dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="flex-1 ms-3 whitespace-nowrap font-bold">
                  Log Out
                </span>
              </Link>
            </li>
          </ul>
          {/* Add the ConfirmModal */}
          {/* <ConfirmModal
            message="Are you sure you want to Leave Us 💔"
            onConfirm={confirmLogout}
            onCancel={closeModal}
            isOpen={isModalOpen}
          /> */}
        </div>
      </aside>
    </div>
  );
}
