import LoginPage from './LoginPage';
import { useStatus } from '../StatusContext';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../api/baseUrl';
import AddPatient from './AddPatient';

const Home = () => {
  const { isLoggedIn, setIsLoggedIn, isLoading, setIsLoading } = useStatus();
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticket, setTicket] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/tickets`);
      setTickets(res.data.tickets);
    } catch (err) {
      console.log(err);
    }finally {
      setIsLoading(false);
    }
  }

  const handleGetTicketInfo = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/tickets/number`, { number: ticketNumber });
      setTicket(res.data.data.ticket);
      toast.success("تم جلب البيانات بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.log(err);
      toast.error("خطأ في بيانات التذكرة", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    setIsLoading(false);
  };

  const fetchClinics = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/clinics`);
      setClinics(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("فشل في تحميل العيادات", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClinics();
    fetchTickets();
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, [setIsLoggedIn]);

  if (isLoading) return <Loading />;

  return (
    <div className='w-full min-h-screen bg-[#fafafa]'>
      {
        isLoggedIn ? (
          <div className='w-full p-5 flex flex-col items-center gap-6'>
            <h2 className='text-2xl font-bold ml-auto'>إنتظارالعيادات</h2>
            <div className='w-full grid grid-cols-3 gap-7'>
              {clinics.map((clinic) => (
                <div key={clinic._id} className={`p-2 h-[140px] rounded-lg bg-pink-500 duration-200 hover:bg-pink-400 text-white hover:text-pink-600 flex flex-col justify-between items-center`}>
                  <h3 className='font-bold text-xl'>{clinic.name}</h3>
                  <p className='font-bold text-xl mr-auto'>
                    {tickets.filter((ticket) => ticket.clinic === clinic._id && ticket.status === 'waiting').length}
                  </p>
                </div>
              ))}
            </div>
            <h2 className='text-xl font-bold ml-auto'>استعلم عن دورك</h2>
            <div className="w-full mx-auto flex flex-col justify-center items-center gap-6">
              <div className='w-full'>
                <label htmlFor="ticket" className="block text-sm font-medium text-gray-600 mb-1">
                  رقم التذكرة
                </label>
                <input
                  id="ticket"
                  type="number"
                  placeholder="أدخل رقم التذكرة"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleGetTicketInfo}
                  className="w-full mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:shadow-2xl transition duration-300 ease-in-out"
                >
                  عرض البيانات
                </button>
              </div>

              {ticket && (
                <>
                  <div className="w-full border p-4 bg-gradient-to-l from-blue-500 to-green-500 text-white rounded-lg hover:shadow-xl duration-200">
                    <h2 className="text-2xl font-bold mb-4 underline">تفاصيل المريض</h2>
                    <div className="space-y-2">
                      <p><span className="font-semibold">الاسم:</span> {ticket.patient.name}</p>
                      <p><span className="font-semibold">رقم التذكرة:</span> {ticket.ticketCode} #</p>
                      <p><span className="font-semibold">العمر:</span> {ticket.patient.age} سنوات</p>
                      <p><span className="font-semibold">الجنس:</span> {ticket.patient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                      <p><span className="font-semibold">رقم الهاتف:</span> {ticket.patient.phone}</p>
                      <p><span className="font-semibold">العنوان:</span> {ticket.patient.address}</p>
                      <p><span className="font-semibold">الشكوى:</span> {ticket.patient.medicalCondition}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <AddPatient />
          </div>
        ) : (
          <LoginPage />
        )
      }
      <ToastContainer />
    </div>
  );
};

export default Home;
