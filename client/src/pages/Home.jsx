import React from 'react';
import LoginPage from './LoginPage';
import { useStatus } from '../StatusContext';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants/api';
import AddPatient from './AddPatient';
import { Users, Search, UserPlus, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

const Home = () => {
  const { isLoggedIn, setIsLoggedIn, isLoading, setIsLoading } = useStatus();
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticket, setTicket] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [nextPatient, setNextPatient] = useState(null);
  const [ads, setAds] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchAds = async() => {
    try {
      const res = await axios.get(`${API_ENDPOINTS.ADS}/active`);
      const data = res.data.data;
      setAds(data);
    }catch(err) {
      console.log('error fetching ads', err)
    }
  }
  
  const Carousel = () => {
    if (!ads || ads.length === 0) return null;
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    };
  
    const prevSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
    };
  
    useEffect(() => {
      if (!ads || ads.length === 0) return;
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }, [ads]);
  
    return (
      <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
        {ads.map((ad, index) => (
          <div
            key={ad._id}
            className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
              index === currentIndex ? 'translate-x-0' : index < currentIndex ? 'translate-x-full' : '-translate-x-full'
            }`}
          >
            <img
              src={ad.image}
              alt={ad.text}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 right-0 p-6 text-white">
                <p className="text-xl font-semibold">{ad.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={prevSlide}
          disabled={isLoading}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isLoading ? 'bg-white/10 cursor-not-allowed' : 'bg-white/30 hover:bg-white/50'}`}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isLoading}
          className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isLoading ? 'bg-white/10 cursor-not-allowed' : 'bg-white/30 hover:bg-white/50'}`}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
  
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 space-x-reverse">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              disabled={isLoading}
              className={`w-2 h-2 rounded-full transition-colors ${isLoading ? 'bg-white/10 cursor-not-allowed' : index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_ENDPOINTS.TICKETS}?status=waiting`);
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
    if (!ticketNumber) {
      toast.error("يرجى إدخال رقم التذكرة", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    setSearchLoading(true);
    try {
      const res = await axios.post(`${API_ENDPOINTS.TICKETS}/number`, { number: ticketNumber });
      setTicket(res.data.data.ticket);
      toast.success("تم جلب البيانات بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "خطأ في بيانات التذكرة", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setSearchLoading(false);
    }
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
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {isLoggedIn ? (
        <div className='w-full p-6 max-w-7xl mx-auto'>
          <Carousel />
          {nextPatient && (
            <div className='mb-8 bg-white rounded-xl shadow-lg p-6 border-2 border-green-500'>
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

          <div className='mb-8'>
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

          <div className='mb-8'>
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
                  disabled={searchLoading || !ticketNumber}
                  className={`px-6 py-2 bg-blue-500 text-white rounded-lg transition-colors duration-300 flex items-center gap-2 relative ${searchLoading || !ticketNumber ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                  {searchLoading ? (
                    <>
                      <span className="opacity-0 flex items-center gap-2">
                        <Search className='w-5 h-5' />
                        بحث
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Search className='w-5 h-5' />
                      بحث
                    </>
                  )}
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

          <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <UserPlus className='w-6 h-6 text-green-500' />
              <h2 className='text-2xl font-bold text-gray-800 text-right'>إضافة مريض جديد</h2>
            </div>
            <AddPatient />
          </div>
        </div>
      ) : (
        <LoginPage />
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;