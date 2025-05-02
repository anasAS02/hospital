import { useStatus } from '../StatusContext';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../api/baseUrl';

const AddPatient = () => {
    const { setIsLoading } = useStatus();
    const [clinics, setClinics] = useState([]);
    const [pdfFiles, setPdfFiles] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingClinics, setIsFetchingClinics] = useState(false);

    const [patient, setPatient] = useState({
      name: "",
      age: "",
      national_id: "",
      phone: "",
      address: "",
      gender: "male",
      medicalCondition: "",
      clinicId: "",
      status: "waiting",
      hasInsurance: false
    });
  
    const fetchClinics = async () => {
      setIsFetchingClinics(true);
      try {
        const res = await axios.get(`${BASE_URL}/clinics`);
        setClinics(res.data.data);
      } catch (err) {
        console.log(err);
        toast.error("فشل في تحميل العيادات", {
          position: "top-right",
          autoClose: 2000,
        });
      } finally {
        setIsFetchingClinics(false);
        setIsLoading(false);
      }
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
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        Object.keys(patient).forEach(key => formData.append(key, patient[key]));
        
        if (pdfFiles) {
          const files = Array.from(pdfFiles);
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
        setPdfFiles(null);
        fetchClinics();
      }catch (err) {
        console.log(err)
        toast.error((err.response?.data?.message === 'يجب أن يكون رقم الهوية 10 أرقام') ? err.response.data.message : 'فشل في حجز الكشف', {
          position: "top-right",
          autoClose: 2000,
        });
      }finally {
        setIsSubmitting(false);
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[A-Za-zأ-ي\s]*$/.test(value)) {
                    handleChange(e);
                  }
              }}
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
                type="number"
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
                type="number"
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
                disabled={isSubmitting || isFetchingClinics}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                <label htmlFor="has-insurance" className="block text-sm font-medium text-gray-600 mb-1">لديه تأمين ؟</label>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="has-insurance"
                            name="hasInsurance"
                            value="true"
                            onChange={handleChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="has-insurance" className="mr-2 text-sm text-gray-600">نعم</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            checked
                            type="radio"
                            id="no-insurance"
                            name="hasInsurance"
                            value="false"
                            onChange={handleChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="no-insurance" className="mr-2 text-sm text-gray-600">لا</label>
                    </div>
                </div>
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
                disabled={isSubmitting}
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
            <button
            type="submit"
            disabled={isSubmitting || isFetchingClinics}
            className={`w-full bg-gradient-to-r from-blue-400 to-green-500 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300 ease-in-out relative ${isSubmitting || isFetchingClinics ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-500 hover:to-green-600 hover:shadow-2xl'}`}
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-0">تأكيد الحجز</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                </>
              ) : (
                'تأكيد الحجز'
              )}
            </button>
        </form>      
    </div>
  )
}

export default AddPatient
