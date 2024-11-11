import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const InquiriesPage = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketCode, setTicketCode] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const handleGetTicketInfo = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8007/tickets', {number: ticketNumber});
      console.log(res.data)
      setPatientData(res.data.data.patientData);
      setTicketCode(res.data.data.ticket[0].ticketCode);
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
  };

  return (
    <div className="p-6 w-full mx-auto flex flex-col justify-center items-center gap-6">
      <div>
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

      {patientData && (
        <>
          <div className="w-full border p-4 bg-gradient-to-l from-blue-500 to-green-500 text-white rounded-lg hover:shadow-xl duration-200">
            <h2 className="text-2xl font-bold mb-4 underline">تفاصيل المريض</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">الاسم:</span> {patientData.name}</p>
              <p><span className="font-semibold">رقم التذكرة:</span> {ticketCode} #</p>
              <p><span className="font-semibold">العمر:</span> {patientData.age} سنوات</p>
              <p><span className="font-semibold">الجنس:</span> {patientData.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
              <p><span className="font-semibold">رقم الهاتف:</span> {patientData.phone}</p>
              <p><span className="font-semibold">العنوان:</span> {patientData.address}</p>
              <p><span className="font-semibold">الشكوى:</span> {patientData.medicalCondition}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InquiriesPage;
