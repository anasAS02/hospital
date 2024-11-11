import { useState } from "react";
import { Modal, Label, TextInput, Button } from "flowbite-react";
import { toast } from "react-toastify";
import { addPatient } from "../../store/reducers/patientSlice";
import { useDispatch } from "react-redux";
const AddPatientAppointment = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    national_id: "",
    gender: "",
    phone: "",
    address: "",
    medicalCondition: "",
    status: "waiting",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch the action and unwrap the result
      const result = await dispatch(addPatient(patientData)).unwrap();

      // Show success toast
      toast.success("تم إضافة المريض بنجاح");

      // Close modal and reset form fields
      handleClose();
      setPatientData({
        name: "",
        age: "",
        national_id: "",
        gender: "male",
        phone: "",
        address: "",
        medicalCondition: "",
        status: "waiting",
      });
    } catch (error) {
      // Show error toast with the error message from the rejected action
      toast.error(`خطأ: ${error.message || "حدث خطأ أثناء إضافة المريض"}`);
    }
  };
  return (
    <Modal show={show} onClose={handleClose} size="md">
      <Modal.Header>
        <h2 className="text-2xl font-bold text-center text-gray-700">
          إضافة مريض جديد
        </h2>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" value="الاسم الكامل" />
            <TextInput
              id="name"
              name="name"
              placeholder="أدخل الاسم الكامل"
              value={patientData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="age" value="العمر" />
            <TextInput
              id="age"
              name="age"
              type="number"
              placeholder="أدخل العمر"
              value={patientData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender" value="الجنس" />
            <select
              id="gender"
              name="gender"
              value={patientData.gender}
              onChange={handleChange}
              required
              className="form-select w-full border-gray-300 rounded-lg focus:ring-blue-500"
            >
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>

          <div>
            <Label htmlFor="phone" value="رقم الهاتف" />
            <TextInput
              id="phone"
              name="phone"
              placeholder="أدخل رقم الهاتف"
              value={patientData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="address" value="العنوان" />
            <TextInput
              id="address"
              name="address"
              placeholder="أدخل العنوان"
              value={patientData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="medicalCondition" value="الحالة الطبية" />
            <TextInput
              id="medicalCondition"
              name="medicalCondition"
              placeholder="أدخل الحالة الطبية"
              value={patientData.medicalCondition}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="status" value="الحالة" />
            <select
              id="status"
              name="status"
              value={patientData.status}
              onChange={handleChange}
              required
              className="form-select w-full border-gray-300 rounded-lg focus:ring-blue-500"
            >
              <option value="waiting">في الانتظار</option>
              <option value="in consultation">في الاستشارة</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg hover:from-green-500 hover:to-blue-600"
          >
            حفظ المريض
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPatientAppointment;
