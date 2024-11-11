import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinicForm, setClinicForm] = useState({
    name: "",
    code: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingClinicId, setEditingClinicId] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("https://hospital-psi-two.vercel.app/users");
      const data = res.data.data;
      setDoctors(data.filter((user) => user.role === "doctor" || user.role === "laboratory-doctor"));
    } catch (err) {
      toast.error("فشل في تحميل الأطباء", {
        position: "top-right",
        autoClose: 2000,
      });
      console.log(err)
    }
  };

  const fetchClinics = async () => {
    try {
      const res = await axios.get("https://hospital-psi-two.vercel.app/clinics");
      const data = res.data.data;
      setClinics(data);
    } catch (err) {
      console.log(err)
      toast.error("فشل في تحميل العيادات", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClinicForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await axios.put(`https://hospital-psi-two.vercel.app/${editingClinicId}`, clinicForm);
        setIsEditing(false);
        setEditingClinicId(null);
        setClinicForm({ name: "", code: "", doctors: [] });
        fetchClinics();
        toast.success("تم تحديث العيادة بنجاح", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (err) {
        toast.error(`فشل في التحديث: ${err.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } else {
      try {
        await axios.post("https://hospital-psi-two.vercel.app/clinics/add-clinic", clinicForm);
        setClinicForm({ name: "", code: "", doctors: [] });
        fetchClinics();
        toast.success("تم إضافة العيادة بنجاح", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (err) {
        toast.error(`فشل في إضافة العيادة: ${err.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  const handleEditClick = (clinic) => {
    setClinicForm({
      name: clinic.name,
      code: clinic.code,
    });
    setIsEditing(true);
    setEditingClinicId(clinic._id);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleRemoveClinic = async (id) => {
    try {
      await axios.delete(`https://hospital-psi-two.vercel.app/clinics/${id}`);
      fetchClinics();
      toast.success("تم حذف العيادة بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error(`فشل في حذف العيادة: ${err.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchClinics();
    fetchDoctors();
    console.log(clinics)
  }, []);

  return (
    <div className="overflow-x-auto mt-8 w-full">
      <div className="mb-4">
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md bg-white">
          <h2 className="text-xl font-semibold">{isEditing ? "تعديل العيادة" : "إضافة عيادة"}</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
              اسم العيادة
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={clinicForm.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-600 mb-1">
              كود العيادة
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={clinicForm.code}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:shadow-2xl transition duration-300 ease-in-out"
          >
            {isEditing ? "تحديث العيادة" : "إضافة العيادة"}
          </button>
        </form>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">الكود</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">عدد الأطباء</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">تعديل</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">حذف</th>
          </tr>
        </thead>
        <tbody>
          {clinics && clinics.length > 0 && clinics.map((clinic) => (
            <tr key={clinic._id} className="border-t">
              <td className="px-4 py-2 text-center">{clinic.name}</td>
              <td className="px-4 py-2 text-center">{clinic.code}</td>
              <td className="px-4 py-2 text-center">{doctors.filter((doctor) => doctor.clinicId === clinic._id).length}</td>
              <td className="px-4 py-2 text-center">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="cursor-pointer w-5 h-5 text-blue-500 hover:text-blue-400 duration-200"
                  onClick={() => handleEditClick(clinic)}
                />
              </td>
              <td className="px-4 py-2 text-center">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="cursor-pointer w-5 h-5 text-red-500 hover:text-red-400 duration-200"
                  onClick={() => handleRemoveClinic(clinic._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clinics;
