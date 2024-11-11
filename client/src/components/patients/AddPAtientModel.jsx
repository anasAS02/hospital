// src/components/AddPatientModal.js
import { useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { useDispatch } from "react-redux";

const AddPatientModal = ({ show, handleClose }) => {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    contact: "",
  });

  const initialValues = {};
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setPatientData({ ...patientData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addPatient(patientData));
    handleClose();
  };

  return (
    <Modal
      show={show}
      onClose={handleClose}
      size="md"
      className="flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg mx-auto">
        <Modal.Header>
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            إضافة مريض جديد
          </h2>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                value="الاسم الكامل"
                className="block text-sm font-medium text-gray-600 mb-1"
              />
              <TextInput
                id="name"
                name="name"
                placeholder="أدخل الاسم الكامل"
                value={patientData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <Label
                htmlFor="age"
                value="العمر"
                className="block text-sm font-medium text-gray-600 mb-1"
              />
              <TextInput
                id="age"
                name="age"
                type="number"
                placeholder="أدخل العمر"
                value={patientData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <Label
                htmlFor="contact"
                value="رقم الهاتف"
                className="block text-sm font-medium text-gray-600 mb-1"
              />
              <TextInput
                id="contact"
                name="contact"
                placeholder="أدخل رقم الهاتف"
                value={patientData.contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:shadow-2xl transition duration-300 ease-in-out"
            >
              حفظ المريض
            </Button>
          </form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default AddPatientModal;
