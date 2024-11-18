import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../api/baseUrl";
import Cookies from 'js-cookie';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const token = Cookies.get('token');

  const getUserInfo = async () => {
      try {
          const res = await axios.get(BASE_URL + '/users/info', {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          const data = res.data.data;
          setUserInfo(data);
      } catch (err) {
          console.log(err);
      }
  };

  const fetchPatients = async () => {
      try {
          if (userInfo) {
              const res = await axios.get(`${BASE_URL}/patients?clinicId=${userInfo.clinicId}`);
              const data = res.data.data;
              setPatients(data.filter((patient) => patient.status === 'completed'));
          }
      } catch (err) {
          console.log(err);
      }
  };

  useEffect(() => {
      getUserInfo();
  }, []);

  useEffect(() => {
      if (userInfo) {
        fetchPatients();
      }
  }, [userInfo]); 

  return (
    <div className="overflow-x-auto mt-8 w-full">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">العمر</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">رقم الهوية</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">رقم الهاتف</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">تاريخ الكشف</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">الشكوى</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">الحالة</th>
              </tr> 
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id} className="border-t">
              <td className="px-4 py-2 text-center">{patient.name}</td>
              <td className="px-4 py-2 text-center">{patient.age}</td>
              <td className="px-4 py-2 text-center">{patient.national_id}</td>
              <td className="px-4 py-2 text-center">{patient.phone}</td>
              <td className="px-4 py-2 text-center">{new Date(patient.updatedAt).toISOString().split("T")[0]}</td>
              <td className="px-4 py-2 text-center">{patient.medicalCondition}</td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-sm bg-green-500 text-white`}
                >
                  Done
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div> 
  )
}

export default Patients