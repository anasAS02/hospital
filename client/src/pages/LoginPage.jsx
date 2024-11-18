import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStatus } from "../StatusContext";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../api/baseUrl";

const LoginPage = () => {
  const { isLoading, setIsLoading, setIsLoggedIn, setUserData } = useStatus();

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Password too short").required("Required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleLogin = async (values) => {
    const userData = {
      email: values.email,
      password: values.password,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login/`, userData);
      toast.success("تم تسجيل الدخول بنجاح", {
        position: "top-right",
        autoClose: 2000,
      });
      formik.resetForm();
      Cookies.set("token", response.data.token);
      Cookies.set("role", response.data.user.role);
      setIsLoggedIn(true);
      setUserData(response.data.user);
      window.location.pathname = "/";
    } catch (error) {
      console.log(error);
      toast.error("هناك مشكلة في البيانات", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-white mb-8">تسجيل الدخول</h2>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
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

            <div>
              <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
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
                placeholder="برجاء إدخال كلمة المرور"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>

            <button
              disabled={formik.isSubmitting || isLoading}
              type="submit"
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-md text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Logging in..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginPage;
