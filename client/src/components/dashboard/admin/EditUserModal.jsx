import { useState, useEffect } from "react";
import { Modal, Button, Label, TextInput, Select } from "flowbite-react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/reducers/usersSlice";
import { toast } from "react-toastify";

const EditUserModal = ({ user, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    password: "",
    role: user?.role,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "",
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser({ id: user._id, userData: formData })).unwrap();
      toast.success("تم تحديث بيانات المستخدم بنجاح", {
        position: "top-right",
        autoClose: 3000,
      });
      onClose();
    } catch (error) {
      toast.error(`فشل في التحديث: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md" popup={true}>
      <Modal.Header>تعديل بيانات المستخدم</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" value="الاسم" />
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email" value="البريد الإلكتروني" />
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" value="كلمة المرور" />
            <TextInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="role" value="الدور" />
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="receptionist">موظف استقبال</option>
              <option value="doctor">طبيب</option>
              <option value="admin">مدير</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button color="gray" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" color="success" className="bg-green-500">
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;
