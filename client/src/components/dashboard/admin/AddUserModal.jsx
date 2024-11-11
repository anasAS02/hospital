import { useState } from "react";
import { Modal, Button, Label, TextInput, Select } from "flowbite-react";
import { useDispatch } from "react-redux";
import { addUSer } from "../../store/reducers/usersSlice";
import { toast } from "react-toastify";

const AddUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "receptionist",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addUSer(formData)).unwrap();
      toast.success("تم إضافة المستخدم بنجاح", {
        position: "top-right",
        autoClose: 3000,
      });
      onClose();
    } catch (error) {
      toast.error(`فشل في الإضافة: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="lg"
      popup={true}
      className="flex-col"
    >
      <Modal.Header className="flex justify-between items-center border-b p-2">
        <h2 className="text-xl font-semibold  ">إضافة مستخدم جديد</h2>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              value="الاسم"
              className="text-right text-gray-700"
            />
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              value="البريد الإلكتروني"
              className="text-right text-gray-700"
            />
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              value="كلمة المرور"
              className="text-right text-gray-700"
            />
            <TextInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="role"
              value="الدور"
              className="text-right text-gray-700"
            />
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full"
            >
              <option value="receptionist">موظف استقبال</option>
              <option value="doctor">طبيب</option>
              <option value="admin">مدير</option>
            </Select>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              color="gray"
              onClick={onClose}
              className="px-4 py-2 rounded-md"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              color="success"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              إضافة
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;
