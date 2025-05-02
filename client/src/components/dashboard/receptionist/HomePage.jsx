import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../constants/api";
import { useStatus } from '../../../StatusContext';
import Loading from '../../Loading';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Users, Search, Clock } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const { setIsLoggedIn, isLoading, setIsLoading } = useStatus();
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticket, setTicket] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [nextPatient, setNextPatient] = useState(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_ENDPOINTS.TICKETS}`, {params: {status: 'waiting'}});
      setTickets(res.data.tickets);
      const nextWaitingTicket = res.data.tickets.find(t => t.status === 'waiting');
      setNextPatient(nextWaitingTicket);
    } catch (err) {
      console.log(err);
    } finally {
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
      const res = await axios.get(API_ENDPOINTS.CLINICS);
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

    const interval = setInterval(() => {
      fetchTickets();
    }, 60000);

    return () => clearInterval(interval);
  }, [setIsLoggedIn]);

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 w-full mx-auto flex flex-col justify-center items-center gap-6">
      {nextPatient && (
        <div className='w-full mb-8 bg-white rounded-xl shadow-lg p-6 border-2 border-green-500'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Clock className='w-8 h-8 text-green-500' />
              <div>
                <h2 className='text-2xl font-bold text-gray-800'>المريض القادم</h2>
                <p className='text-gray-600'>رقم التذكرة: {nextPatient.ticketCode}#</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-lg font-semibold text-gray-800'>{nextPatient.patient.name}</p>
              <p className='text-sm text-gray-600'>{nextPatient.patient.medicalCondition}</p>
            </div>
          </div>
        </div>
      )}

      <div className='w-full mb-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 text-right'>إنتظار العيادات</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {clinics.map((clinic) => (
            <div 
              key={clinic._id} 
              className='bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden'
            >
              <div className='p-6 border-b border-gray-100'>
                <div className='flex items-center justify-between'>
                  <Users className='w-6 h-6 text-blue-500' />
                  <h3 className='font-bold text-xl text-gray-800'>{clinic.name}</h3>
                </div>
              </div>
              <div className='p-6 bg-gradient-to-r from-blue-50 to-indigo-50'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>في الانتظار</span>
                  <span className='text-2xl font-bold text-blue-600'>
                    {tickets.filter((ticket) => ticket.clinic === clinic._id && ticket.status === 'waiting').length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='w-full mb-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 text-right'>استعلم عن دورك</h2>
        <div className='bg-white rounded-xl shadow-md p-6'>
          <div className='flex gap-4'>
            <input
              type="number"
              placeholder="أدخل رقم التذكرة"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-right"
            />
            <button
              onClick={handleGetTicketInfo}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
            >
              <Search className='w-5 h-5' />
              بحث
            </button>
          </div>

          {ticket && (
            <div className='mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg'>
              <h3 className='text-xl font-bold text-gray-800 mb-4 text-right'>تفاصيل المريض</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-right'>
                <div>
                  <p className='text-gray-600'>الاسم: <span className='font-semibold text-gray-800'>{ticket.patient.name}</span></p>
                  <p className='text-gray-600'>رقم التذكرة: <span className='font-semibold text-gray-800'>#{ticket.ticketCode}</span></p>
                  <p className='text-gray-600'>العمر: <span className='font-semibold text-gray-800'>{ticket.patient.age} سنوات</span></p>
                  <p className='text-gray-600'>الجنس: <span className='font-semibold text-gray-800'>{ticket.patient.gender === 'male' ? 'ذكر' : 'أنثى'}</span></p>
                </div>
                <div>
                  <p className='text-gray-600'>رقم الهاتف: <span className='font-semibold text-gray-800'>{ticket.patient.phone}</span></p>
                  <p className='text-gray-600'>العنوان: <span className='font-semibold text-gray-800'>{ticket.patient.address}</span></p>
                  <p className='text-gray-600'>الشكوى: <span className='font-semibold text-gray-800'>{ticket.patient.medicalCondition}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
