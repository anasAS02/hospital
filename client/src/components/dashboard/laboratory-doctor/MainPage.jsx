import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../api/baseUrl";
import Cookies from 'js-cookie';

const MainPage = () => {
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
                setPatients(data.filter((patient) => patient.status === 'waiting'));
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
        <div className='w-full flex flex-col items-start gap-6'>
            <div className='w-full h-[140px] ml-4 p-4 rounded-lg rounded-tr-xl shadow-lg flex flex-col items-center justify-between font-bold text-xl bg-pink-500 text-white'>
                <h2>قائمة الإنتظار</h2>
                <p className='mr-auto'>{patients.length}</p>
            </div>
            <div className="overflow-x-auto mt-8 w-full">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 text-center bg-blue-500 text-white rounded-r-md">الاسم</th>
                        <th className="px-4 py-2 text-center bg-blue-500 text-white">العمر</th>
                        <th className="px-4 py-2 text-center bg-blue-500 text-white">الحالة</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map((patient) => (
                        <tr key={patient._id} className="border-t">
                            <td className="px-4 py-2 text-center">{patient.name}</td>
                            <td className="px-4 py-2 text-center">{patient.age}</td>
                            <td className="px-4 py-2 text-center">
                                <span className={`px-2 py-1 rounded-full text-sm bg-yellow-300 text-white`}>{patient.status}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MainPage;
