import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { allUsers, deleteUser, updateUser } from "../../../store/reducers/usersSlice";
import { toast } from "react-toastify";

function Employees() {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);

  const [employeeData, setEmployeeData] = useState({
    _id: '',
    name: "",
    role: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser({ id: employeeData._id, userData: employeeData })).unwrap();
      toast.success("تم تحديث بيانات المستخدم بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
      setEmployeeData({
        _id: '',
        name: "",
        role: "",
        email: "",
        password: "",
      })
      setIsEditingMode(false);
      dispatch(allUsers());
    } catch (error) {
      toast.error(`فشل في التحديث: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    dispatch(allUsers());
  }, [dispatch]);

  const handleUpdate = (employee, e) => {
    e.preventDefault();
    setIsEditingMode(true);
    setEmployeeData({
      _id: employee._id,
      name: employee.name,
      role: employee.role,
      email: employee.email,
      password: null,
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
  }

  const handleRemove = async (id, e) => {
    e.preventDefault();
    try {
      await dispatch(deleteUser(id)).unwrap();;
      toast.success("تم حذف المستخدم بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
      dispatch(allUsers());
    }catch(err) {
      toast.error(`فشل في الحذف: ${err.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
      console.log(err)
    }
  }

  return (
    <div className="p-6 w-full mx-auto flex flex-col justify-center items-center gap-6">
      <form onSubmit={handleSubmit} className={`space-y-6 w-full ${!isEditingMode && 'hidden'}`}>
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
            <option value="receptionist">ريسيبشن</option>
            <option value="doctor">طبيب</option>
            <option value="admin">مسؤول</option>
          </select>
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
              <th className="px-4 py-2 text-center bg-blue-500 text-white">الخصائص</th>
              <th className="px-4 py-2 text-center bg-blue-500 text-white">البريد الإلكتروني</th>
              <th className="px-4 py-2 text-center bg-blue-500 text-white">تعديل</th>
              <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">حذف</th>
            </tr> 
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2 text-center">{user.name}</td>
                <td className="px-4 py-2 text-center">{user.role}</td>
                <td className="px-4 py-2 text-center">{user.email}</td>
                <td className="px-4 py-2 text-center">
                <FontAwesomeIcon
                icon={faEdit}
                className="cursor-pointer text-lg text-blue-700 hover:text-blue-500 duration-300"
                onClick={(e) => handleUpdate(user, e)}
                />
                </td>
                <td className="px-4 py-2 text-center">
                <FontAwesomeIcon
                icon={faTrash}
                className="cursor-pointer text-lg text-red-700 hover:text-red-500 duration-300"
                onClick={(e) => handleRemove(user._id, e)}
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;
