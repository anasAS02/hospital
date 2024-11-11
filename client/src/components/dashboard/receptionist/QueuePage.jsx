import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addPatient, getPatients } from "../../../store/reducers/patientSlice";
import axios from "axios";
import { toast } from "react-toastify";  
import { BASE_URL } from "../../../api/baseUrl";

function QueuePage() {
  const dispatch = useDispatch();
  const [clinics, setClinics] = useState([]);

  const fetchClinics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/clinics`);
      const data = res.data.data;
      setClinics(data);
    } catch (err) {
      console.log(err);
      toast.error(`فشل في تحميل العيادات: ${err.message}`, {
        position: "top-right",
        autoClose: 2000, 
      });
    }
  };

  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    national_id: "",
    phone: "",
    address: "",
    gender: "",
    medicalCondition: "",
    status: "waiting",
    clinicId: clinics[0]?._id,
  });

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addPatient(patientData));

    toast.success("تم حفظ الكشف بنجاح!", {
      position: "top-right",
      autoClose: 2000, 
    });

    setPatientData({
      name: "",
      age: "",
      national_id: "",
      phone: "",
      address: "",
      gender: "male",
      medicalCondition: "",
      status: "waiting",
      clinicId: clinics[0]?._id,
    });
  };

  useEffect(() => {
    dispatch(getPatients());
    fetchClinics();
  }, [dispatch]);

  return (
    <div className="p-6 w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
            الاسم الكامل
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="أدخل الاسم الكامل"
            value={patientData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-600 mb-1">
            العمر
          </label>
          <input
            id="age"
            name="age"
            type="number"
            placeholder="أدخل العمر"
            value={patientData.age}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="national_id"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            رقم الهوية
          </label>
          <input
            id="national_id"
            name="national_id"
            type="text"
            placeholder="أدخل رقم الهوية"
            value={patientData.national_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
            رقم الهاتف
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="أدخل رقم الهاتف"
            value={patientData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">
            العنوان
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="أدخل العنوان"
            value={patientData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">
            الجنس
          </label>
          <select
            id="gender"
            name="gender"
            value={patientData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">اختر النوع</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>
        <div>
          <label htmlFor="clinic" className="block text-sm font-medium text-gray-600 mb-1">
            العيادة
          </label>
          <select
            id="clinicId"
            name="clinicId"
            value={patientData.clinicId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">اختر العيادة</option>
            {clinics && clinics.length > 0 &&
              clinics.map((clinic) => (
                <option key={clinic._id} value={clinic._id}>
                  {clinic.name}
                </option>
              ))
            }
          </select>
        </div>
        <div>
          <label htmlFor="medicalCondition" className="block text-sm font-medium text-gray-600 mb-1">
            الحالة الطبية
          </label>
          <input
            id="medicalCondition"
            name="medicalCondition"
            type="text"
            placeholder="أدخل الحالة الطبية"
            value={patientData.medicalCondition}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:shadow-2xl transition duration-300 ease-in-out"
        >
          حفظ الكشف
        </button>
      </form>
    </div>
  );
}

export default QueuePage;
