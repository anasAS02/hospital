import { useEffect, useState } from 'react';
import api, { BASE_URL } from "../../../api/baseUrl";
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const Queue = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [medicationsList, setMedicationsList] = useState([]);
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState("");
  const [medicationNotes, setMedicationNotes] = useState(""); 
  const [tests, setTests] = useState([]);
  const [testTypeInput, setTestTypeInput] = useState("");
  const [preparationInstructionsInput, setPreparationInstructionsInput] = useState("");

  const [tickets, setTickets] = useState(null);
  const [ticket, setTicket] = useState({ticketNumber: 'لا يوجد'});
  const [patientData, setPatientData] = useState(null);

  const [testList, setTestList] = useState([]);

  const [userInfo, setUserInfo] = useState(null);

  const token = Cookies.get('token');

  const getUserInfo = async () => {
      try {
          const res = await axios.get(BASE_URL + '/users/info', {
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

  const fetchTestList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/test-types`);
      const data = res.data.data;
      setTestList(data);
    }catch (err) {
      console.log(err)
    }
  }

  const fetchMedications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/medications`);
      setMedicationsList(res.data.data); 
    } catch (err) {
      console.log(err);
    }
  };

  const addPrescription = async () => {
    const updatedMedications = {
      medications: [...medications],
      patient_id: patientData._id, 
      patient_name: patientData.name,
      payment_status: false
    };

    try {
      await axios.post(`${BASE_URL}/prescriptions`, updatedMedications);
    }catch (err) {
      console.log(err)
      toast.error("حدث خطأ أثناء إضافة الأدوية.", {
        position: "top-right",
        autoClose: 2000
      });
    }
  }

  const addTestsOrder = async () => {
    const updatedTests = {
      tests: [...tests],
      clinicId: "67320b96b4f8d3da7eb9db6c",
      patient_id: patientData._id, 
      patient_name: patientData.name
    };

    try {
      await axios.post(`${BASE_URL}/test-orders`, updatedTests);
    }catch (err) {
      console.log(err)
      toast.error("حدث خطأ أثناء إضافة الفحوصات.", {
        position: "top-right",
        autoClose: 2000
      });
    }
  }

  const handleFetchTicket = async (e, number) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/tickets/", { number: ticketNumber, clinic: userInfo.clinicId });
      if (response.data.status === "success") {
        setPatientData(response.data.data.ticket.patient);
      } else {
        setError("لم يتم العثور على بيانات للتذكرة المطلوبة.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء استرجاع بيانات التذكرة.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    if (selectedMedication && medicationNotes) {
      const medication = medicationsList.find((med) => med._id === selectedMedication);
      if (medication) {
        setMedications([...medications, { _id: medication._id, name: medication.name, notes: medicationNotes }]);
        setSelectedMedication("");
        setMedicationNotes(""); 
      }
    } else {
      toast.error("يجب اختيار دواء وإدخال ملاحظات.");
    }
  };

  const handleAddTest = () => {
    if (testTypeInput) {
      setTests([...tests, { type: testTypeInput, test: testList.filter((test) => test.name === testTypeInput)[0]._id, notes: preparationInstructionsInput }]);
      setTestTypeInput(""); 
      setPreparationInstructionsInput(""); 
    }
  };

  const handleGetTickets = async () => {
    if (!userInfo || !userInfo.clinicId) {
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/tickets?status=waiting&clinic=${userInfo.clinicId}`);
      setTickets(res.data.tickets.length);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNextPatient = async () => {
    if (!userInfo?.clinicId) {
      toast.error("Clinic ID is missing");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/tickets/next?clinic=${userInfo.clinicId}`);
      setPatientData(res.data.patientData);
      setTicket(res.data.data);
    } catch (err) {
      toast.error("لا يوجد مرضى آخرين", {
        position: "top-right",
        autoClose: 2000
      });
      console.log(err);
      setPatientData(null);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [patientData]);

  useEffect(() => {
    if (userInfo) {
      handleGetTickets();
      fetchMedications(); 
      fetchTestList();
    }
  }, [userInfo, patientData]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(tests.length > 0) {
        addTestsOrder();
      }
      if(medications.length > 0) {
        addPrescription();
      }
      await axios.put(`${BASE_URL}/tickets/${ticket._id}`, { status: "completed" });
      await axios.put(`${BASE_URL}/patients/${patientData._id}`, { status: "completed" });
      toast.success("تمت العملية بنجاح", {
        position: "top-right",
        autoClose: 2000
      });
      handleNextPatient();
    } catch (error) {
      console.log(error);
    }
  };

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
              <p><span className="font-semibold">رقم التذكرة:</span> {ticket.ticketCode} #</p>
              <p><span className="font-semibold">العمر:</span> {patientData.age} سنوات</p>
              <p><span className="font-semibold">رقم الهوية:</span> {patientData.national_id}</p>
              <p><span className="font-semibold">الجنس:</span> {patientData.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
              <p><span className="font-semibold">رقم الهاتف:</span> {patientData.phone}</p>
              <p><span className="font-semibold">العنوان:</span> {patientData.address}</p>
              <p><span className="font-semibold">الشكوى:</span> {patientData.medicalCondition}</p>
            </div>
          </div>

          <div className="border p-4 rounded-lg shadow-md w-full bg-white">
            <h2 className="text-2xl font-bold mb-4">إضافة العلاج والفحوصات</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">العلاج</label>
                <div className="flex gap-2">
                  <select
                    value={selectedMedication}
                    onChange={(e) => setSelectedMedication(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">اختر دواء</option>
                    {medicationsList.map((med) => (
                      <option key={med._id} value={med._id}>{med.name}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="أدخل ملاحظات عن الدواء"
                    value={medicationNotes}
                    onChange={(e) => setMedicationNotes(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleAddMedication}
                    className="px-4 py-2 bg-gradient-to-l from-blue-500 to-green-500 text-white rounded hover:shadow-xl duration-200"
                  >
                    إضافة
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  {medications.map((med, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded">
                      <strong>{med.name}</strong><br />
                      <span>ملاحظات: {med.notes}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block font-semibold mb-2">نوع الفحص</label>
                <div className="flex gap-2">
                  <select
                    value={testTypeInput}
                    onChange={(e) => setTestTypeInput(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">اختر نوع الفحص</option>
                    {
                      testList.map((test) => (
                        <option key={test._id} value={test.name}>{test.name}</option>
                      ))
                    }
                  </select>
                  <input
                    type="text"
                    value={preparationInstructionsInput}
                    onChange={(e) => setPreparationInstructionsInput(e.target.value)}
                    placeholder="أدخل تعليمات التحضير"
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleAddTest}
                    className="px-4 py-2 bg-gradient-to-l from-blue-500 to-green-500 text-white rounded hover:shadow-xl duration-200"
                  >
                    إضافة
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  {tests.map((test, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded">
                      <strong>نوع الفحص:</strong> {test.type} <br />
                      <strong>التعليمات:</strong> {test.notes}
                    </li>
                  ))}
                </ul>
              </div>
              {ticket.pdfFilesPath && ticket.pdfFilesPath.length > 0 &&
                <p className='ml-auto'>نتائج الفحوصات السابقة</p>
              }
              {ticket.pdfFilesPath && ticket.pdfFilesPath.length > 0 &&
                ticket.pdfFilesPath.map((filePath, index) => {
                const normalizedPath = filePath.replace(/^.*(?=uploads)/, "/").replace(/\\/g, "/");
                return (
                  <div key={index}>
                    <a
                      href={`${BASE_URL}${normalizedPath}`}
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
                className="w-full py-2 bg-gradient-to-l from-blue-500 to-green-500 text-white font-semibold rounded duration-300 hover:shadow-xl"
              >
                الكشف التالي
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Queue;
