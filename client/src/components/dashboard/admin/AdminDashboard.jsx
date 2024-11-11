import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faClipboardList,
  faNotesMedical,
  faBars,
  faAdd,
  faVials,
  faHouseChimneyMedical,
} from "@fortawesome/free-solid-svg-icons";
import AddEmployee from "./AddEmployee";
import Employees from "./Employees";
import Clinics from "./Clinics";
import Tests from "./Tests";
import Medications from "./Medications";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState({
    name: "الموظفين",
    label: "الموظفين",
    icon: faClipboardList,
    comp: <Employees />,
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const tabs = [
    { name: "الموظفين", label: "الموظفين", icon: faUsers, comp: <Employees /> },
    { name: "إضافة موظف", label: "إضافة موظف", icon: faAdd, comp: <AddEmployee /> },
    { name: "العيادات", label: "العيادات", icon: faHouseChimneyMedical, comp: <Clinics /> },
    { name: "الفحوصات", label: "الفحوصات", icon: faVials, comp: <Tests /> },
    { name: "الأدوية", label: "الأدوية", icon: faNotesMedical, comp: <Medications /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 gap-14">
      <aside
        className={`fixed inset-0 bg-white shadow-lg transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-1/5`}
      >
        <ul className="space-y-2 mt-4 px-4">
          {tabs.map((tab) => (
            <li key={tab.name} className="duration-300">
              <button
                onClick={() => handleTabChange(tab)}
                className={`w-full p-3 flex items-center justify-start gap-3 rounded-md transition duration-300 bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:text-white ${
                  activeTab.name === tab.name
                    ? "bg-gradient-to-l from-blue-500 to-green-500 text-white"
                    : "text-pink-500"
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 z-50 md:hidden"
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      <div className="w-full p-4 md:p-8">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            {activeTab.label}
          </h2>
          {activeTab.comp}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
