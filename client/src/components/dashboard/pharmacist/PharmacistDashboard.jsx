import { faDollar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../constants/api';
import Medications from './Medications';

const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.PHARMACY);
      const data = res.data.data;
      setPrescriptions(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPrescriptions();
  }, [])

  return (
    <div className='w-full flex flex-col items-start gap-6 p-5'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>لوحة التحكم الصيدلية</h1>
      </div>
      <Medications />
      <h2 className='text-2xl font-bold mt-8'>جدول الوصفات</h2>
      <div className="overflow-x-auto mt-4 w-full">
          <table className="min-w-full table-auto border-collapse">
              <thead>
                  <tr>
                  <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
                  <th className="px-4 py-2 text-center bg-blue-500 text-white">الأدوية</th>
                  <th className="px-4 py-2 text-center bg-blue-500 text-white">الملاحظات</th>
                  <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">حالة الاستلام</th>
                  </tr> 
              </thead>
              <tbody>
                  {prescriptions.map((item) => (
                  <tr key={item._id} className="border-t">
                      <td className="px-4 py-2 text-center">{item.patient_name}</td>
                      <td className="px-4 py-2 text-center">
                          <div className='flex flex-col justify-center items-center gap-2'>
                          {
                              item.medications.map((item, i) => (
                                <p key={i}>
                                  {item.medication}
                                  -
                                  {item.available ? 'متوفر' : 'غير متوفر'}
                                </p>
                              ))    
                          }
                          </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className='flex flex-col justify-center items-center gap-2'>
                            {
                              item.medications.map((item, i) => (
                                <p key={i}>
                                  {item.notes}
                                </p>
                              ))    
                            }
                          </div>
                      </td>
                      <td className="px-4 py-2 text-center">{item.pickup_status}</td>
                  </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  )
}

export default PharmacistDashboard
