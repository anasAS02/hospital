import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../../api/baseUrl";

function UpdateData() {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [patients, setPatients] = useState([]);

  const [patientData, setPatientData] = useState({
    _id: "",
    name: "",
    age: "",
    national_id: "",
    phone: "",
    address: "",
    gender: "male", 
    medicalCondition: "",
    status: "waiting",
  });

  const fetchPatients = async () => {
    try{
      const res = await axios.get(`${BASE_URL}/patients`);
      setPatients(res.data.data);
    }catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/patients/${patientData._id}`, patientData);
      toast.success("تم تحديث المريض بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
      fetchPatients();
      setPatientData({
        _id: "",
        name: "",
        age: "",
        national_id: "",
        phone: "",
        address: "",
        gender: "male",
        medicalCondition: "",
        status: "waiting",
      });
    } catch (err) {
      console.log(err);
      toast.error(`فشل في تحديث المريض: ${err.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleUpdate = (patient, e) => {
    e.preventDefault();
    setIsEditingMode(true);
    setPatientData({
      _id: patient._id,
      name: patient.name,
      age: patient.age,
      national_id: patient.national_id,
      phone: patient.phone,
      address: patient.address,
      gender: patient.gender,
      medicalCondition: patient.medicalCondition,
      status: patient.status,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/patients/${id}`);
      toast.success("تم حذف المريض بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
      fetchPatients();
    } catch (error) {
      console.log(error)
      toast.error(`فشل في حذف المريض: ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="p-6 w-full mx-auto flex flex-col justify-center items-center gap-6">
      <form onSubmit={handleSubmit} className={`space-y-6 w-full ${!isEditingMode && "hidden"}`}>
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
            <option value="">اختر الجنس</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
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
          حفظ البيانات
        </button>
      </form>

      <div className="overflow-x-auto mt-8 w-full">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
              <th className="px-4 py-2 text-center bg-blue-500 text-white">العمر</th>
              <th className="px-4 py-2 text-center bg-blue-500 text-white">الهاتف</th>
              <th className="px-4 py-2 text-center bg-blue-500 text-white">العنوان</th>
              <th className="px-4 py-2 text-center bg-blue-500 text-white">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td className="px-4 py-2 border text-center">{patient.name}</td>
                <td className="px-4 py-2 border text-center">{patient.age}</td>
                <td className="px-4 py-2 border text-center">{patient.phone}</td>
                <td className="px-4 py-2 border text-center">{patient.address}</td>
                <td className="px-4 py-2 border text-center flex justify-center gap-2">
                  <button
                    onClick={(e) => handleUpdate(patient, e)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(patient._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpdateData;
