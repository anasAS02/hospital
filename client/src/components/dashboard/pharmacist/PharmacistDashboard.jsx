import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../../../constants/api';
import Medications from './Medications';
import { toast } from 'react-toastify';

const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicationsList, setMedicationsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_ENDPOINTS.PHARMACY);
      const data = res.data.data || [];
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setError('فشل في جلب الوصفات');
      toast.error('فشل في جلب الوصفات', {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const fetchMedicationsList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_ENDPOINTS.MEDICATIONS);
      const data = res.data.data || [];
      setMedicationsList(data);
    } catch (error) {
      console.error('Error fetching medications:', error);
      setError('فشل في جلب الأدوية');
      toast.error('فشل في جلب الأدوية', {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePickup = async (prescriptionId) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_ENDPOINTS.PHARMACY}/${prescriptionId}`, {payment_status: true});
      const data = res.data;
      fetchPrescriptions();
      toast.success(data.message, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setError('فشل في جلب الوصفات');
      toast.error('فشل في جلب الوصفات', {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPrescriptions();
    fetchMedicationsList();
  }, [])

  const checkAvailability = (medication) => {
      const findMedication = medicationsList.find((med) => med.name === medication);
      if(!findMedication){
        return 'غير متوفر';
      }
      return findMedication.available ? 'متوفر' : 'غير متوفر';
  }

  return (
    <div className='w-full flex flex-col items-start gap-6 p-5'>
      <div className='w-full flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>لوحة التحكم الصيدلية</h1>
      </div>
      <Medications />
      <h2 className='text-2xl font-bold mt-8'>جدول الوصفات</h2>
      {isLoading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}
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
                {prescriptions.length > 0 ? prescriptions.map((item) => (
                <tr key={item._id} className="border-t">
                    <td className="px-4 py-2 text-center">{item.patient_name}</td>
                    <td className="px-4 py-2 text-center">
                        <div className='flex flex-col justify-center items-center gap-2'>
                        {
                            item.medications?.map((item, i) => (
                              <p key={i}>
                                {item.medication}
                                -
                                {checkAvailability(item.medication)}
                              </p>
                            ))    
                        }
                        </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className='flex flex-col justify-center items-center gap-2'>
                          {
                            item.medications?.map((item, i) => (
                              <p key={i}>
                                {item.notes}
                              </p>
                            ))    
                          }
                        </div>
                    </td>
                    <td className="px-4 py-2 text-center">{!item.payment_status ? 
                      <button onClick={() => handlePickup(item._id)} className="bg-blue-500 text-white text-sm duration-200 hover:bg-blue-400 px-2 py-1 rounded-full">صرف الأدوية</button>
                    : item.pickup_status}</td>
                </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      لا توجد وصفات لعرضها
                    </td>
                  </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default PharmacistDashboard
