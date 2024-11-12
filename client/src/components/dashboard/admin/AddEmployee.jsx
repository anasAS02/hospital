import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUSer } from "../../../store/reducers/usersSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../../api/baseUrl";

function AddEmployee() {
  const dispatch = useDispatch();

  const [clinics, setClinics] = useState([]);

  const fetchClinics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/clinics`);
      const data = res.data.data;
      setClinics(data);
    } catch (error) {
      console.log(error)
    }
  }

  const [employeeData, setEmployeeData] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
    clinicId: ""
  });

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filterClinic = clinics.filter((clinic) => clinic._id === employeeData.clinicId);

    if(employeeData.role === "laboratory-doctor" && filterClinic[0].name !== "الأشعة و التحاليل") {
      toast.error("طبيب المعمل غير مصرح له بهذا التخصص", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    
    if(employeeData.role === "doctor" && filterClinic[0].name === "الأشعة و التحاليل") {
      toast.error("هذا المستخدم المعمل غير مصرح له بهذا التخصص", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      await dispatch(addUSer(employeeData)).unwrap();
      toast.success("تم إضافة المستخدم بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
      setEmployeeData({
        name: "",
        role: "",
        email: "",
        password: "",
        clinicId: ""
      });
    } catch (error) {
      console.log(error)
      toast.error(`فشل في الإضافة: ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [])

  return (
    <div className="p-6 w-full mx-auto flex flex-col justify-center items-center gap-6">
      <form onSubmit={handleSubmit} className={`space-y-6 w-full`}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
            الاسم الكامل
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="أدخل الاسم الكامل"
            value={employeeData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-600 mb-1">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="أدخل البريد الإلكتروني"
            value={employeeData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
            كلمة المرور
          </label>
          <input
            id="password"
            name="password"
            type="text"
            placeholder="أدخل كلمة المرور"
            value={employeeData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">
            الخصائص
          </label>
          <select
            id="role"
            name="role"
            value={employeeData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">اختر الخصائص</option>
            <option value="receptionist">ريسيبشن</option>
            <option value="doctor">طبيب</option>
            <option value="laboratory-doctor">طبيب معمل</option>
            <option value="pharmacist">صيدلي</option>
            <option value="admin">مسؤول</option>
          </select>
        </div>
        {
          (employeeData.role === "doctor" || employeeData.role === "laboratory-doctor") && (
            <div>
              <label htmlFor="clinicId" className="block text-sm font-medium text-gray-600 mb-1">
                التخصصات
              </label>
              <select
                id="clinicId"
                name="clinicId"
                value={employeeData.clinicId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">اختر التخصص</option>
                {
                  clinics.map((clinic) => (
                    <option key={clinic._id} value={clinic._id}>{clinic.name}</option>
                  ))
                }
              </select>
            </div>
          )
        }
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:shadow-2xl transition duration-300 ease-in-out"
        >
          حفظ البيانات
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
