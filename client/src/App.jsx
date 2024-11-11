import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { StatusProvider } from "./StatusContext";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard.jsx";
import ReceptionistDashboard from "./components/dashboard/receptionist/Receptionist.jsx";
import DoctorDashboard from "./components/dashboard/doctor/DoctorDashboard.jsx";
import Cookies from 'js-cookie';
import PharmacistDashboard from "./components/dashboard/pharmacist/PharmacistDashboard.jsx";
import LaboratoryDoctorDashboard from "./components/dashboard/laboratory-doctor/Laboratory-doctor-Dashboard.jsx";

function App() {
  const role = Cookies.get('role');
  console.log(role)
  return (
    <StatusProvider>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={ 
              role === 'admin' ? <AdminDashboard /> : 
              role === 'receptionist' ? <ReceptionistDashboard /> : 
              role === 'doctor' ? <DoctorDashboard /> : 
              role === 'laboratory-doctor' ? <LaboratoryDoctorDashboard /> : 
              role === 'pharmacist' ? <PharmacistDashboard /> : 
              <Home /> 
            } 
          />          
        </Routes>
      </Router>
      <ToastContainer />
    </StatusProvider>
  );
}

export default App;
