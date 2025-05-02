import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import { StatusProvider } from "./StatusContext";
import Cookies from 'js-cookie';

const Home = lazy(() => import('./pages/Home'));
const AdminDashboard = lazy(() => import("./components/dashboard/admin/AdminDashboard"));
const ReceptionistDashboard = lazy(() => import("./components/dashboard/receptionist/Receptionist"));
const DoctorDashboard = lazy(() => import("./components/dashboard/doctor/DoctorDashboard"));
const PharmacistDashboard = lazy(() => import("./components/dashboard/pharmacist/PharmacistDashboard"));
const LaboratoryDoctorDashboard = lazy(() => import("./components/dashboard/laboratory-doctor/Laboratory-doctor-Dashboard"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPassword"));

function App() {
  const role = Cookies.get('role');
  const token = Cookies.get('token');

  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const getDashboardComponent = () => {
    const dashboards = {
      admin: AdminDashboard,
      superadmin: AdminDashboard,
      receptionist: ReceptionistDashboard,
      doctor: DoctorDashboard,
      'laboratory-doctor': LaboratoryDoctorDashboard,
      pharmacist: PharmacistDashboard
    };
    
    const DashboardComponent = dashboards[role];
    return DashboardComponent ? (
      <ProtectedRoute>
        <DashboardComponent />
      </ProtectedRoute>
    ) : <Navigate to="/" replace />;
  };

  return (
    <StatusProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={getDashboardComponent()} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </Router>
    </StatusProvider>
  );
}

export default App;
