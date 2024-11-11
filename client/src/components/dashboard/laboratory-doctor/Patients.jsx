import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatients } from "../../../store/reducers/patientSlice";

const Patients = () => {
    const dispatch = useDispatch();
    const patients = useSelector((state) => state.patient.patients).filter((patient) => patient.status === 'completed');

    useEffect(() => {
      dispatch(getPatients())
    }, [dispatch])

  return (
    <div className="overflow-x-auto mt-8 w-full">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">العمر</th>
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