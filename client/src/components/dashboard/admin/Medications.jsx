import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState(null);

  const fetchMedications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8007/medications");
      const data = res.data.data;
      setMedications(data);
    } catch (err) {
      toast.error("فشل في تحميل البيانات", {
        position: "top-right",
        autoClose: 2000,
      });
      console.log(err)
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedicationForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await axios.put(`http://127.0.0.1:8007/medications/${editingMedicationId}`, medicationForm);
        setIsEditing(false);
        setEditingMedicationId(null);
        setMedicationForm({ name: "", description: "", price: "" });
        fetchMedications();
        toast.success("تم تحديث بيانات العلاج بنجاح", {
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
        await axios.post("http://127.0.0.1:8007/medications", medicationForm);
        setMedicationForm({ name: "", description: "", price: "" });
        fetchMedications();
        toast.success("تم إضافة بيانات العلاج بنجاح", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (err) {
        toast.error(`فشل في إضافة بيانات العلاج: ${err.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  const handleEditClick = (medication) => {
    setMedicationForm({
      name: medication.name,
      description: medication.description,
      price: medication.price,
    });
    setIsEditing(true);
    setEditingMedicationId(medication._id);
  };

  const handleRemoveMedication = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8007/medications/${id}`);
      fetchMedications();
      toast.success("تم حذف بيانات العلاج بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error(`فشل في حذف بيانات العلاج: ${err.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return (
    <div className="overflow-x-auto mt-8 w-full">
      <div className="mb-4">
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md bg-white">
          <h2 className="text-xl font-semibold">{isEditing ? "تعديل العلاج" : "إضافة علاج"}</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
              اسم العلاج
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={medicationForm.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
              وصف العلاج
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={medicationForm.description}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">
              سعر العلاج
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={medicationForm.price}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:shadow-2xl transition duration-300 ease-in-out"
          >
            {isEditing ? "تحديث العلاج" : "إضافة علاج"}
          </button>
        </form>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">الوصف</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">السعر</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">تعديل</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">حذف</th>
          </tr>
        </thead>
        <tbody>
          {medications && medications.length > 0 && medications.map((medication) => (
            <tr key={medication._id} className="border-t">
              <td className="px-4 py-2 text-center">{medication.name}</td>
              <td className="px-4 py-2 text-center">{medication.description}</td>
              <td className="px-4 py-2 text-center">{medication.price}</td>
              <td className="px-4 py-2 text-center">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="cursor-pointer w-5 h-5 text-blue-500 hover:text-blue-400 duration-200"
                  onClick={() => handleEditClick(medication)}
                />
              </td>
              <td className="px-4 py-2 text-center">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="cursor-pointer w-5 h-5 text-red-500 hover:text-red-400 duration-200"
                  onClick={() => handleRemoveMedication(medication._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Medications;
