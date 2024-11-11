const PharmacyPage = () => {
    const pharmacy = [
            {
                "prescription_id": 101,
                "patient_name": "محمد علي",
                "medications": [
                    {
                        "name": "بانادول",
                        "quantity": 2,
                        "price": 45
                    },
                    {
                        "name": "فيتامين سي",
                        "quantity": 1,
                        "price": 70
                    }
                ],
                "pickup_status": "في انتظار الاستلام",
                "notes": "الدواء يمكن أخذه بعد الأكل فقط",
                "total": 115,
                "payment_status": false
            },
            {
                "prescription_id": 102,
                "patient_name": "سارة أحمد",
                "medications": [
                    {
                        "name": "أموكسيل",
                        "quantity": 3,
                        "price": 140
                    }
                ],
                "total": 140,
                "pickup_status": "تم الاستلام",
                "notes": "ينصح بأخذ الدواء ثلاث مرات يوميًا",
                "payment_status": true
            }
        ];

  return (
    <div className="overflow-x-auto mt-8 w-full">
        <table className="min-w-full table-auto border-collapse">
            <thead>
                <tr>
                <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">الأدوية</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">الملاحظات</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">إجمالي السعر</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white">الحالة</th>
                <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">سداد الفاتورة</th>
                </tr> 
            </thead>
            <tbody>
                {pharmacy.map((item) => (
                <tr key={item.prescription_id} className="border-t">
                    <td className="px-4 py-2 text-center">{item.patient_name}</td>
                    <td className="px-4 py-2 text-center">
                        <div className='flex flex-col justify-center items-center gap-2'>
                        {
                            item.medications.map((item, i) => (
                                    <p key={i}>
                                        {item.name} {item.quantity}x
                                    </p>
                            ))    
                        }
                        </div>
                    </td>
                    <td className="px-4 py-2 text-center">{item.notes}</td>
                    <td className="px-4 py-2 text-center">{item.total} ر.س</td>
                    <td className="px-4 py-2 text-center">{item.pickup_status}</td>
                    <td className="px-4 py-2 text-center">{item.payment_status ? 'تم التحصيل' : 'لم يتم التحصيل'}</td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default PharmacyPage