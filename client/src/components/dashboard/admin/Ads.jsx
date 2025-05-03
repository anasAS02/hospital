import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../constants/api';
import { API_ENDPOINTS } from '../../../constants/api';
import { Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Loading from '../../Loading';

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [newAdText, setNewAdText] = useState('');
  const [newAdImage, setNewAdImage] = useState(null);
  const [editingAd, setEditingAd] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [status, setStatus] = useState('active');
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get('token');

  const axiosConfig = useMemo(() => ({
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }), [token]);

  const getAds = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_ENDPOINTS.ADS}/all`, axiosConfig);
      setAds(response.data.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'خطأ في جلب الإعلانات';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى اختيار ملف صورة صالح');
        return;
      }
      setNewAdImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleAddAd = async (e) => {
    e.preventDefault();
    if (!newAdText.trim()) {
      toast.error('يرجى إدخال نص الإعلان');
      return;
    }
    if (!newAdImage) {
      toast.error('يرجى اختيار صورة للإعلان');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('text', newAdText.trim());
    formData.append('image', newAdImage);
    formData.append('status', status);

    try {
      const response = await axios.post(API_ENDPOINTS.ADS, formData, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAds(prevAds => [...prevAds, response.data.data]);
      setNewAdText('');
      setNewAdImage(null);
      setPreviewImage(null);
      setStatus('active');
      toast.success('تم إضافة الإعلان بنجاح');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'خطأ في إضافة الإعلان';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAd = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/ads/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setAds(ads.filter((ad) => ad._id !== id));
      toast.success('تم حذف الإعلان بنجاح')
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error(`خطأ في حذف الإعلان ${error.response.data.message}`)
    }
  };

  const handleEditAd = (ad) => {
    setEditingAd(ad);
    setNewAdText(ad.text);
    setPreviewImage(`${BASE_URL}/${ad.image}`);
    setStatus(ad.status); 
    window.scrollTo({
      top: '0',
      behavior: 'smooth',
    });
  };

  const handleUpdateAd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', newAdText);
    formData.append('status', status);
    if (newAdImage) {
      formData.append('image', newAdImage);
    }

    try {
      const response = await axios.put(`${BASE_URL}/ads/${editingAd._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setAds(ads.map((ad) => (ad._id === editingAd._id ? response.data.data : ad)));
      setEditingAd(null);
      setNewAdText('');
      setNewAdImage(null);
      setPreviewImage(null);
      setStatus('active');
      toast.success('تم تحديث الإعلان بنجاح')
    } catch (error) {
      toast.error(`خطأ في تحديث الإعلان ${error.response.data.message}`)
      console.error('Error updating ad:', error);
    }
  };

  useEffect(() => {
    getAds();
  }, []);

  if(isLoading) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-right" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">إدارة الإعلانات</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingAd ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
          </h2>
          <form onSubmit={editingAd ? handleUpdateAd : handleAddAd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">النص:</label>
              <input
                type="text"
                value={newAdText}
                onChange={(e) => setNewAdText(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل نص الإعلان"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الصورة:</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/jpeg, image/png, image/gif"
                  required={!editingAd}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <div className="flex justify-center">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="h-32 w-auto object-contain" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    اسحب وأفلت الصورة هنا أو انقر للاختيار
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <label className="ml-1 text-sm font-medium text-gray-700">الحالة:</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={status === 'active'}
                  onChange={() => setStatus(status === 'active' ? 'archived' : 'active')}
                  className="w-6 h-6 cursor-pointer"
                />
                <span className="ml-2 text-gray-600">{status === 'active' ? 'نشط' : 'غير نشط'}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingAd ? (
                  <>
                    <Edit2 className="w-4 h-4 ml-2" />
                    تحديث الإعلان
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة الإعلان
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">الإعلانات الحالية</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {ads && ads.length > 0 && ads.map((ad) => (
              <div key={ad._id} className="border rounded-lg overflow-hidden">
                {ad.image && (
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={ad.image}
                      alt={ad.text}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-gray-800 mb-4">{ad.text}</p>
                  <div className="flex justify-between">
                    <span
                      className={`text-sm font-semibold ${
                        ad.status === 'active' ? 'text-green-500' : 'text-gray-500'
                      }`}
                    >
                      {ad.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleEditAd(ad)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ads;
