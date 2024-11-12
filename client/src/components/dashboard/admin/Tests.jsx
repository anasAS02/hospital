import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 
import { BASE_URL } from "../../../api/baseUrl";

const Tests = () => {
  const [testTypes, setTestTypes] = useState([]);
  const [testForm, setTestForm] = useState({
    name: "",
    price: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingTestId, setEditingTestId] = useState(null);

  const fetchTestTypes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/test-types`);
      const data = res.data.data;
      setTestTypes(data);
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
    setTestForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await axios.put(`${BASE_URL}/test-types/${editingTestId}`, testForm);
        setIsEditing(false);
        setEditingTestId(null);
        setTestForm({ name: "", price: "" });
        fetchTestTypes();
        toast.success("تم تحديث بيانات الفحص بنجاح", {
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
        await axios.post("${BASE_URL}/test-types", testForm);
        setTestForm({ name: "", price: "" });
        fetchTestTypes();
        toast.success("تم إضافة بيانات الفحص بنجاح", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (err) {
        toast.error(`فشل في إضافة بيانات الفحص: ${err.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  const handleEditClick = (testType) => {
    setTestForm({
      name: testType.name,
      price: testType.price,
    });
    setIsEditing(true);
    setEditingTestId(testType._id);
  };

  const handleRemoveTestType = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/test-types/${id}`);
      fetchTestTypes();
      toast.success("تم حذف بيانات الفحص بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error(`فشل في حذف بيانات الفحص: ${err.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchTestTypes();
  }, []);

  return (
    <div className="overflow-x-auto mt-8 w-full">
      <div className="mb-4">
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md bg-white">
          <h2 className="text-xl font-semibold">{isEditing ? "تعديل الفحص" : "إضافة فحص"}</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
              اسم الفحص
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={testForm.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">
              سعر الفحص
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={testForm.price}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:shadow-2xl transition duration-300 ease-in-out"
          >
            {isEditing ? "تحديث الفحص" : "إضافة فحص"}
          </button>
        </form>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">السعر</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">تعديل</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">حذف</th>
          </tr>
        </thead>
        <tbody>
          {testTypes && testTypes.length > 0 && testTypes.map((test) => (
            <tr key={test._id} className="border-t">
              <td className="px-4 py-2 text-center">{test.name}</td>
              <td className="px-4 py-2 text-center">{test.price}</td>
              <td className="px-4 py-2 text-center">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="cursor-pointer w-5 h-5 text-blue-500 hover:text-blue-400 duration-200"
                  onClick={() => handleEditClick(test)}
                />
              </td>
              <td className="px-4 py-2 text-center">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="cursor-pointer w-5 h-5 text-red-500 hover:text-red-400 duration-200"
                  onClick={() => handleRemoveTestType(test._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tests;
