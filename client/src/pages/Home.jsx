import LoginPage from './LoginPage';
import { useStatus } from '../StatusContext';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Home = () => {
  const { isLoggedIn, setIsLoggedIn, isLoading, setIsLoading } = useStatus();
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    phone: "",
    address: "",
    gender: "male",
    medicalCondition: "",
    clinicId: "",
  });

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8007/tickets");
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
      const res = await axios.post('http://127.0.0.1:8007/tickets', { number: ticketNumber });
      console.log("DATA", res.data.data.ticket)
      setTicketData(res.data.data.ticket);
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
      const res = await axios.get("http://127.0.0.1:8007/clinics");
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

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8007/patients/", patient);
      toast.success("تم حجز الكشف بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });

      setPatient({
        name: "",
        age: "",
        phone: "",
        address: "",
        gender: "male",
        medicalCondition: "",
        clinicId: clinics?.[0]?._id || "",
      });
    }catch (err) {
      console.log(err)
    }finally {
      setIsLoading(false);
    }
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
                    {tickets.filter((ticket) => ticket.clinic === clinic._id).length}
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

              {ticketData && (
                <div className="w-full border p-4 bg-gradient-to-l from-blue-500 to-green-500 text-white rounded-lg hover:shadow-xl duration-200">
                  <h2 className="text-2xl font-bold mb-4 underline">تفاصيل المريض</h2>
                  <div className="space-y-2">
                    <p><span className="font-semibold">الاسم:</span> {ticketData.patient.name}</p>
                    <p><span className="font-semibold">رقم التذكرة:</span> {ticketData.ticketCode} #</p>
                    <p><span className="font-semibold">العمر:</span> {ticketData.patient.age}</p>
                    <p><span className="font-semibold">الجنس:</span> {ticketData.patient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                    <p><span className="font-semibold">الدور:</span> {ticketData.patient.queueNumber}</p>
                  </div>
                </div>
              )}
            </div>
            <h2 className='text-xl font-bold ml-auto'>حجز</h2>
            <form onSubmit={handleSubmit} className="w-full p-5 rounded-md shadow-lg space-y-6 bg-white">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">الاسم الكامل</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="أدخل الاسم الكامل"
                  value={patient.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-600 mb-1">العمر</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="أدخل العمر"
                  value={patient.age}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">رقم الهاتف</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="أدخل رقم الهاتف"
                  value={patient.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">العنوان</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="أدخل العنوان"
                  value={patient.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">الجنس</label>
                <select
                  id="gender"
                  name="gender"
                  value={patient.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div>
                <label htmlFor="clinicId" className="block text-sm font-medium text-gray-600 mb-1">اختيار العيادة</label>
                <select
                  id="clinicId"
                  name="clinicId"
                  value={patient.clinicId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {clinics.map((clinic) => (
                    <option key={clinic._id} value={clinic._id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="medicalCondition" className="block text-sm font-medium text-gray-600 mb-1">الشكوى</label>
                <textarea
                  id="medicalCondition"
                  name="medicalCondition"
                  value={patient.medicalCondition}
                  onChange={handleChange}
                  placeholder="أدخل الشكوى الطبية"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-400 to-green-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-blue-500 hover:to-green-600 hover:shadow-2xl transition duration-300 ease-in-out"
              >
                تأكيد الحجز
              </button>
            </form>
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
