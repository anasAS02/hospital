import { faDollar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../api/baseUrl';

const PharmacyPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8007/prescriptions/');
      const data = res.data.data;
      setPrescriptions(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPrescriptions();
  }, [])

  const totalAmount = prescriptions.reduce((acc, item) => {
    if (item.payment_status) {
      return acc + item.total;
      }
      return acc;
  }, 0);

  const total = prescriptions.reduce((acc, item) => {
    if (item.total) {
      return acc + item.total;
      }
      return acc;
  }, 0);

  const handlePayment = async (prescription) => {
    const data = {
      ...prescription,
    }
    
    try {
      await axios.put(`${BASE_URL}/prescriptions/${data._id}/`, {payment_status: true});
      toast.success('تم دفع الفاتورة بنجاح', {
        position: "top-right",
        autoClose: 2000,
      });
      fetchPrescriptions();
    }catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما, يرجى المحاولة مرة أخرى', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/prescriptions/${id}/`);
      toast.success('تم دفع الفاتورة بنجاح', {
        position: "top-right",
        autoClose: 2000,
      });
      fetchPrescriptions();
    }catch (error) {
      console.log(error)
      toast.error('حدث خطأ ما, يرجى المحاولة مرة أخرى', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }


  return (
    <div className="overflow-x-auto mt-8 w-full">
        <div className='flex flex-col items-start gap-3 mb-3'>
          <span className='flex items-center gap-1'>
            <p className='font-bold'>مجمل الفواتير: {total} ر.س</p>
            <FontAwesomeIcon
            icon={faDollar}
            className='text-sm text-green-500'
            />
          </span>
          <span className='flex items-center gap-1'>
            <p className='font-bold'>مجمل  الفواتير المسددة: {totalAmount} ر.س</p>
            <FontAwesomeIcon
            icon={faDollar}
            className='text-sm text-green-500'
            />
          </span>
        </div>
        <table className="min-w-full table-auto border-collapse">
            <thead>
                <tr>
                <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">الأدوية</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">الملاحظات</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">إجمالي السعر</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">الحالة</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">سداد الفاتورة</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">تعديل حالة الدفع</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">حذف الروشتة</th>
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
                    <td className="px-4 py-2 text-center">{item.total} ر.س</td>
                    <td className="px-4 py-2 text-center">{item.payment_status ? 'تم التحصيل' : 'لم يتم التحصيل'}</td>
                    <td className="px-4 py-2 text-center">
                        {item.payment_status ? 
                        <p className='font-bold'>-</p>
                        :
                          <button className='bg-blue-500 duration-200 hover:bg-blue-400 text-white px-4 py-2 rounded-md' onClick={() => handlePayment(item)}>
                          دفع الفاتورة
                        </button>
                        }
                    </td>
                    <td className="px-4 py-2 text-center">
                        <FontAwesomeIcon
                        className='cursor-pointer text-red-500 duration-200 hover:text-red-400 w-5 h-5 rounded-md' 
                        icon={faTrash}
                        onClick={() => handleRemove(item._id)}
                        />
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default PharmacyPage