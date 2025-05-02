import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { API_ENDPOINTS } from '../../../constants/api';

const Queue = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState(null);
  const [ticket, setTicket] = useState({ticketNumber: 'لا يوجد'});
  const [patientData, setPatientData] = useState(null);
  const [testOrders, setTestOrders] = useState(null);
  const token = Cookies.get('token');

  const axiosConfig = useMemo(() => ({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }), [token]);

  const [userInfo, setUserInfo] = useState(null);
  const [pdfFiles, setPdfFiles] = useState(null);
 
  const fetchTestOrders = useCallback(async () => {
    if (!patientData) return;

    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.TEST_ORDERS, axiosConfig);
      const data = res.data.data;
      const patientOrders = data.filter(order => order.patient_id === patientData._id);
      setTestOrders(patientOrders[0] || null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'خطأ في جلب طلبات الفحص';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [patientData, axiosConfig]);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} - يجب أن يكون ملف PDF`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} - حجم الملف يجب أن يكون أقل من 5 ميجابايت`);
        return false;
      }
      return true;
    });
    setPdfFiles(validFiles.length > 0 ? validFiles : null);
  }, []);

  const getUserInfo = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.USERS + '/info', {
            headers: {
            Authorization: `Bearer ${token}`
          }
        });
          const data = res.data.data;
          setUserInfo(data);
      } catch (err) {
          console.log(err);
      }
  };

  useEffect(() => {
    if (patientData) {
      fetchTestOrders();
    }
  }, [patientData]);

  const handleFetchTicket = useCallback(async (e) => {
    e.preventDefault();
    if (!ticketNumber.trim()) {
      toast.error('يرجى إدخال رقم التذكرة');
      return;
    }
    if (!userInfo?.clinicId) {
      toast.error('معرف العيادة غير متوفر');
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(API_ENDPOINTS.TICKETS, {
        number: ticketNumber.trim(),
        clinic: userInfo.clinicId
      }, axiosConfig);

      if (response.data.status === "success") {
        setPatientData(response.data.data.ticket.patient);
        toast.success('تم جلب بيانات التذكرة بنجاح');
      } else {
        const errorMsg = 'لم يتم العثور على بيانات للتذكرة المطلوبة';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'حدث خطأ أثناء استرجاع بيانات التذكرة';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [ticketNumber, userInfo, axiosConfig]);

  const handleGetTickets = useCallback(async () => {
    if (!userInfo?.clinicId) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${API_ENDPOINTS.TICKETS}?status=waiting&clinic=${userInfo.clinicId}`,
        axiosConfig
      );
      setTickets(res.data.tickets.length);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'خطأ في جلب قائمة الانتظار';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [userInfo, axiosConfig]);

  const handleNextPatient = useCallback(async () => {
    if (!userInfo?.clinicId) {
      toast.error('معرف العيادة غير متوفر');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${API_ENDPOINTS.TICKETS}/next?clinic=${userInfo.clinicId}`,
        axiosConfig
      );
      setPatientData(res.data.patientData);
      setTicket(res.data.data);
      toast.success('تم جلب بيانات المريض التالي', {
        position: "top-right",
        autoClose: 2000
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'لا يوجد مرضى آخرين';
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 2000
      });
    } finally {
      setLoading(false);
    }
  }, [userInfo, axiosConfig]);

  useEffect(() => {
    getUserInfo();
  }, [patientData]);

  useEffect(() => {
    if (userInfo) {
      handleGetTickets();
    }
  }, [userInfo, patientData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!pdfFiles || pdfFiles.length === 0) {
      toast.error('يرجى إرفاق ملفات PDF للنتائج');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Array.from(pdfFiles).forEach((file) => {
        formData.append("pdfFiles", file);
      });

      await Promise.all([
        axios.put(`${API_ENDPOINTS.TICKETS}/${ticket._id}`, { status: "completed" }, axiosConfig),
        axios.put(`${API_ENDPOINTS.PATIENTS}/${patientData._id}`, { status: "completed" }, axiosConfig),
        axios.put(`${API_ENDPOINTS.TEST_ORDERS}/${testOrders._id}`, formData, {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            "Content-Type": "multipart/form-data",
          },
        })
      ]);

      toast.success("تمت العملية بنجاح", {
        position: "top-right",
        autoClose: 2000
      });
      setPdfFiles(null);
      handleNextPatient();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء رفع الملفات';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [pdfFiles, ticket._id, patientData._id, testOrders._id, axiosConfig, handleNextPatient]);

  return (
    <div className="w-full flex flex-col gap-6 p-5">
      <form onSubmit={handleFetchTicket} className="space-y-6 w-full p-5 rounded-md shadow-lg bg-white">
        <div>
          <label htmlFor="ticket" className="block text-sm font-medium text-gray-600 mb-1">
            كشف مستعجل
          </label>
          <input
            id="ticket"
            name="ticket"
            type="number"
            placeholder="أدخل رقم التذكرة"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:shadow-2xl transition duration-300 ease-in-out"
        >
          {loading ? "جارٍ التحميل..." : "بدء الكشف"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div className='w-full flex items-center justify-between'>
        <div className='w-full h-[140px] ml-4 p-4 rounded-lg rounded-tr-xl shadow-lg flex flex-col items-center justify-between font-bold text-xl bg-blue-500 text-white duration-200 hover:bg-blue-400 hover:text-black hover:shadow-lg'>
          <h2>المريض الحالي</h2>
          <p className='mr-auto'>{ticket.ticketNumber}</p>
        </div>        
        <div className='w-full h-[140px] ml-4 p-4 rounded-lg rounded-tr-xl shadow-lg flex flex-col items-center justify-between font-bold text-xl bg-pink-500 text-white duration-200 hover:bg-pink-400 hover:text-black hover:shadow-lg'>
          <h2>قائمة الإنتظار</h2>
          <p className='mr-auto'>{tickets}</p>
        </div>        
      </div>

      <button
        className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:shadow-2xl transition duration-300 ease-in-out"
        onClick={handleNextPatient}
      >
        بدء الكشوفات
      </button>

      {patientData && (
        <>
          <div className="w-full border p-4 bg-gradient-to-l from-blue-500 to-green-500 text-white rounded-lg hover:shadow-xl duration-200">
            <h2 className="text-2xl font-bold mb-4 underline">تفاصيل المريض</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">الاسم:</span> {patientData.name}</p>
              <p><span className="font-semibold">لديه تأمين ؟</span> {patientData.hasInsurance ? 'نعم' : 'لا'}</p>
              <p><span className="font-semibold">رقم التذكرة:</span> {ticket.ticketCode} #</p>
              <p><span className="font-semibold">العمر:</span> {patientData.age} سنوات</p>
              <p><span className="font-semibold">رقم الهوية:</span> {patientData.national_id}</p>
              <p><span className="font-semibold">الجنس:</span> {patientData.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
              <p><span className="font-semibold">رقم الهاتف:</span> {patientData.phone}</p>
              <p><span className="font-semibold">العنوان:</span> {patientData.address}</p>
              <p><span className="font-semibold">الشكوى:</span> {patientData.medicalCondition}</p>
            </div>
          </div>

          <div className="border p-4 rounded-lg shadow-md w-full bg-white flex flex-col items-start gap-3">
            {
              ticket.patient.tests && ticket.patient.tests.length > 0 &&
              <>
              {ticket.patient.tests.map((test) => (
                <div key={test.test} className='w-full flex flex-col items-start gap-3'>
                  {test.test_name}
                </div>
              ))}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-600 mb-1">إرفاق نتائج الفحوصات</label>
                <input
                  id="file"
                  name="pdfFile"
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {pdfFiles && (
                  <div className="mt-2 space-y-1">
                    {Array.from(pdfFiles).map((file, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {file.name} ({Math.round(file.size / 1024)}KB)
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </>
            }

              {ticket.pdfFilesPath && ticket.pdfFilesPath.length > 0 &&
                <p className='ml-auto'>نتائج الفحوصات السابقة</p>
              }
              {ticket.pdfFilesPath && ticket.pdfFilesPath.length > 0 &&
                ticket.pdfFilesPath.map((filePath, index) => {
                return (
                  <div key={index}>
                    <a
                      target="_blank"
                      href={filePath}
                      download
                      className="text-blue-500 underline"
                    >
                      تحميل نتيجة التحليل {index + 1}
                    </a>
                  </div>
                );
              })
            }
              <button
                onClick={handleSubmit}
                disabled={loading || !pdfFiles}
                className="w-full py-2 bg-gradient-to-l from-blue-500 to-green-500 text-white font-semibold rounded duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {loading ? (
                  <>
                    <span className="opacity-0">الكشف التالي</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  </>
                ) : (
                  'الكشف التالي'
                )}
              </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Queue;
