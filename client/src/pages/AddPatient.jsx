import { useStatus } from '../StatusContext';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../api/baseUrl';

const AddPatient = () => {
    const { setIsLoading } = useStatus();
    const [clinics, setClinics] = useState([]);
    const [pdfFiles, setPdfFiles] = useState(null);

    const [patient, setPatient] = useState({
      name: "",
      age: "",
      national_id: "",
      phone: "",
      address: "",
      gender: "male",
      medicalCondition: "",
      clinicId: "",
      status: "waiting"
    });
  
    const fetchClinics = async () => {
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
  
    const handleChange = (e) => {
      setPatient({ ...patient, [e.target.name]: e.target.value });
    };
  
    const handleFileChange = (e) => {
      setPdfFiles(e.target.files); 
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if(patient.clinicId === "") {
        toast.error('فشل في حجز الكشف, يرجى اختيار العيادة', {
            position: "top-right",
            autoClose: 2000,
          });
        return;
      }
      try {
        const files = Array.from(pdfFiles);
        const formData = new FormData();
        Object.keys(patient).forEach(key => formData.append(key, patient[key]));
        
        if (pdfFiles) {
          files.forEach((file) => {
            formData.append("pdfFiles", file);
          });
        }
  
        await axios.post(`${BASE_URL}/patients/`, formData);
        toast.success("تم حجز الكشف بنجاح", {
          position: "top-right",
          autoClose: 2000,
        });
  
        setPatient({
          name: "",
          age: "",
          national_id: "",
          phone: "",
          address: "",
          gender: "male",
          medicalCondition: "",
          clinicId: clinics?.[0]?._id || "",
        });
        fetchClinics();
      }catch (err) {
        console.log(err)
        toast.error((err.response.data.message === 'يجب أن يكون رقم الهوية 10 أرقام') ? err.response.data.message : 'فشل في حجز الكشف', {
          position: "top-right",
          autoClose: 2000,
        });
      }finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
        fetchClinics();
    }, []);
    

  return (
    <div className='w-full flex flex-col items-start gap-3'>
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
                value={patient.national_id}
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
                <option value="">اختر النوع: </option>
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
                <option value="">اختر العيادة: </option>
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
            <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">نوع الحجز</label>
            <select
                id="status"
                name="status"
                value={patient.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
                <option value="">اختر نوع الكشف: </option>
                <option value="waiting">كشف</option>
                <option value="in consultation">استشارة</option>
            </select>
            </div>
            <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-600 mb-1">ارفق ملف (PDF)</label>
                <input
                id="file"
                name="pdfFile"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
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
  )
}

export default AddPatient
