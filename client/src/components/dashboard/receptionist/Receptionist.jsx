import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faUsers,
  faClipboardList,
  faFileMedicalAlt,
  faBars,
  faXRay,
} from "@fortawesome/free-solid-svg-icons";
import QueuePAge from "./QueuePage";
import UpdateData from "./UpdateData";
import InquiriesPage from "./InquiriesPage";
import PharmacyPage from "./PharmacyPage";
import XrayAndTestsPage from "./XrayAndTestsPage";

const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState({
    name: "حجز كشف",
    label: "حجز كشف",
    icon: faClipboardList,
    comp: <QueuePAge />,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const tabs = [
    { name: "حجز كشف", label: "حجز كشف", icon: faClipboardList, comp: <QueuePAge /> },
    { name: "تعديل بيانات", label: "تعديل بيانات", icon: faUsers, comp: <UpdateData /> },
    { name: "استعلامات", label: "استعلامات", icon: faFileMedicalAlt, comp: <InquiriesPage /> },
    { name: "الصيدلية", label: "الصيدلية", icon: faUserGroup, comp: <PharmacyPage /> },
    { name: "الاشعات و التحاليل", label: "الاشعات و التحاليل", icon: faXRay, comp: <XrayAndTestsPage /> },
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

export default ReceptionistDashboard;
