import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "../api/baseUrl";
import Logo from "../assets/logo.png";
import { useState } from "react";

const ResetPasswordPage = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");

  const requestCodeSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const resetPasswordSchema = Yup.object().shape({
    code: Yup.string().length(4, "Code must be 4 digits").required("Required"),
    password: Yup.string()
      .min(6, "Password too short")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const handleRequestCode = async (values) => {
    try {
      await axios.post(`${BASE_URL}/users/request-reset-code`, {
        email: values.email,
      });
      toast.success("تم إرسال الكود بنجاح إلى البريد الإلكتروني", {
        position: "top-right",
        autoClose: 2000,
      });
      setEmail(values.email);
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error("فشل في إرسال الكود. تحقق من البريد الإلكتروني المدخل.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleResetPassword = async (values) => {
    try {
      await axios.post(`${BASE_URL}/users/reset-password`, {
        email,
        resetCode: values.code,
        newPassword: values.password,
      });
      toast.success("تم إعادة تعيين كلمة المرور بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
          window.location.pathname = "/";
      }, 3000)
    } catch (error) {
      console.error(error);
      toast.error("فشل في إعادة تعيين كلمة المرور. تأكد من البيانات المدخلة.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const formik = useFormik({
    initialValues: step === 1 ? { email: "" } : { code: "", password: "", confirmPassword: "" },
    validationSchema: step === 1 ? requestCodeSchema : resetPasswordSchema,
    onSubmit: step === 1 ? handleRequestCode : handleResetPassword,
  });

  return (
    <>
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-4">
        <img src={Logo} alt="Logo" className="w-[140px]" />
        <div className="bg-gradient-to-r from-blue-500 to-green-500 shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-white mb-8">
            {step === 1 ? "إعادة تعيين كلمة المرور" : "إدخال كود التحقق"}
          </h2>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    type="email"
                    name="email"
                    className={`mt-1 block w-full px-4 py-3 border ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="برجاء إدخال البريد الإلكتروني"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">كود التحقق</label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.code}
                    type="text"
                    name="code"
                    className={`mt-1 block w-full px-4 py-3 border ${
                      formik.touched.code && formik.errors.code
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="أدخل كود التحقق"
                  />
                  {formik.touched.code && formik.errors.code && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.code}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">كلمة المرور الجديدة</label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    type="password"
                    name="password"
                    className={`mt-1 block w-full px-4 py-3 border ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="أدخل كلمة المرور الجديدة"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    type="password"
                    name="confirmPassword"
                    className={`mt-1 block w-full px-4 py-3 border ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="أعد إدخال كلمة المرور"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {step === 1 ? "إرسال كود التحقق" : "إعادة تعيين كلمة المرور"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ResetPasswordPage;
