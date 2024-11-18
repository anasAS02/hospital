import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../api/baseUrl";
import { format } from 'date-fns'; 
import { toast } from "react-toastify";

const XrayAndTestsPage = () => {
  const [testOrders, setTestOrders] = useState([]);
  
  const fetchTestOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/test-orders`);
      const data = res.data.data;
      setTestOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTestOrders();
  }, []);

  const handleChangeStatus = async (testOrderId) => {
    try {
      await axios.patch(`${BASE_URL}/test-orders/${testOrderId}/complete`);
      fetchTestOrders();
      toast.success("تم تحديث التسليم بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
    }catch (err) {
      console.log(err)
      toast.error("حدث مشكلة أثناء تحديث الحالة", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }

  return (
    <div className="overflow-x-auto mt-8 w-full">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">النوع</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">الموعد</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">ملاحظات</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">الإجمالي</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white">الحالة</th>
            <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">النتيجة</th>
          </tr>
        </thead>
        <tbody>
          {testOrders.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">لا توجد بيانات</td>
            </tr>
          ) : (
            testOrders.map((item) => (
              <tr key={item.test_id} className="border-t">
                <td className="px-4 py-2 text-center">{item.patient_name}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex flex-col items-start gap-2">
                    {item.tests.map((test) => (
                      <p className="text-xs" key={test.test_name}>
                        {test.test_name}
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  {item.createdAt
                    ? format(new Date(item.createdAt), 'yyyy-MM-dd')
                    : "N/A"}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex flex-col items-start gap-2">
                    {item.tests.map((test) => (
                      <p className="text-xs" key={test.test_name}>
                        {test.notes ? test.notes : "لا يوجد ملاحظات"}
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">{item.total_price} ر.س</td>
                <td className="px-4 py-2 text-center">
                  {
                    item.status === "Pending" ?
                    <button onClick={() => handleChangeStatus(item._id)} className='w-fit p-2 text-sm rounded-lg duration-200 bg-blue-500 text-white hover:bg-blue-400'>تسليم التحاليل و الأشعة</button>
                    :
                    <p className='text-xs'>تم التسليم</p>
                  }
                </td>
                <td className="px-4 py-2 text-center">
                  {item.pdfFilesPath && item.pdfFilesPath.length > 0 ? (
                    item.pdfFilesPath.map((filePath, index) => (
                      <div key={index}>
                        <a
                          href={`${BASE_URL}${filePath}`}
                          download
                          className="text-blue-500 underline"
                        >
                          تحميل نتيجة التحليل {index + 1}
                        </a>
                      </div>
                    ))
                  ) : (
                    <span>لا توجد ملفات</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default XrayAndTestsPage;
