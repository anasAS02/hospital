import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { StatusProvider } from "./StatusContext";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import ReceptionistDashboard from "./components/dashboard/receptionist/Receptionist";
import DoctorDashboard from "./components/dashboard/doctor/DoctorDashboard";
import Cookies from 'js-cookie';
import PharmacistDashboard from "./components/dashboard/pharmacist/PharmacistDashboard";
import LaboratoryDoctorDashboard from "./components/dashboard/laboratory-doctor/Laboratory-doctor-Dashboard";

function App() {
  const role = Cookies.get('role');
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
