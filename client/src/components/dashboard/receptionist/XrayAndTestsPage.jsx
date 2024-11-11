const XrayAndTestsPage = () => {
    const xray_and_tests = [
        {
            "test_id": 201,
            "patient_name": "يوسف حسن",
            "test_type": "أشعة سينية على الصدر",
            "appointment_date": "2024-11-10",
            "status": "قيد الانتظار",
            "preparation_instructions": "يرجى الصيام لمدة 6 ساعات قبل الفحص",
            "total": 550
        },
        {
            "test_id": 202,
            "patient_name": "نادية سامي",
            "test_type": "تحليل دم شامل",
            "appointment_date": "2024-11-09",
            "status": "تم الانتهاء",
            "preparation_instructions": "يفضل أن يتم التحليل في الصباح",
            "total": 400
        },
        {
            "test_id": 203,
            "patient_name": "عمر إبراهيم",
            "test_type": "تصوير بالرنين المغناطيسي",
            "appointment_date": "2024-11-12",
            "status": "مجدول",
            "preparation_instructions": "يرجى عدم ارتداء أي مجوهرات أثناء الفحص",
            "total": 1200
        }
    ]

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
                <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-l-md">الحالة</th>
                </tr> 
            </thead>
            <tbody>
                {xray_and_tests.map((item) => (
                <tr key={item.test_id} className="border-t">
                    <td className="px-4 py-2 text-center">{item.patient_name}</td>
                    <td className="px-4 py-2 text-center">{item.test_type}</td>
                    <td className="px-4 py-2 text-center">{item.appointment_date}</td>
                    <td className="px-4 py-2 text-center">{item.preparation_instructions}</td>
                    <td className="px-4 py-2 text-center">{item.total} ر.س</td>
                    <td className="px-4 py-2 text-center">{item.status}</td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default XrayAndTestsPage