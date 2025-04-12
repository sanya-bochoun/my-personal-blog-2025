import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// กำหนด API URL
const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const { user, isLoading, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // ใช้รูปโลโก้ default เป็นค่าเริ่มต้น
  const defaultImage = '/src/assets/default-logo.png';

  // ใช้ useEffect เพื่อให้มั่นใจว่าเราอัพเดทข้อมูลเมื่อ user โหลดเสร็จ
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('ขนาดไฟล์ต้องไม่เกิน 2MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('รองรับเฉพาะไฟล์ภาพ (JPEG, PNG, GIF)');
        return;
      }

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('avatar', file);

        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('ไม่พบ Token กรุณาเข้าสู่ระบบใหม่');
        }

        const response = await fetch(`${API_URL}/api/users/avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          updateUser(data.data.user);
          setRefreshKey(prev => prev + 1);
          toast.success('อัพโหลดรูปภาพสำเร็จ');
        } else {
          throw new Error(data.message || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
        }
      } catch (err) {
        console.error('Error details:', err);
        toast.error(err.message || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่
    if (formData.full_name === user.full_name && formData.username === user.username) {
      toast.info("ไม่มีการเปลี่ยนแปลงข้อมูล");
      return;
    }

    // ตรวจสอบว่าข้อมูลไม่ว่างเปล่า
    if (!formData.full_name.trim() || !formData.username.trim()) {
      toast.error("กรุณากรอกชื่อและชื่อผู้ใช้ให้ครบถ้วน");
      return;
    }

    // ตรวจสอบความยาวของชื่อ
    if (formData.full_name.trim().length < 2) {
      toast.error("ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร");
      return;
    }

    // ตรวจสอบความยาวของ username
    if (formData.username.trim().length < 3) {
      toast.error("ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร");
      return;
    }

    // ตรวจสอบรูปแบบของ username (ไม่ควรมีช่องว่าง)
    if (formData.username.includes(' ')) {
      toast.error("ชื่อผู้ใช้ไม่ควรมีช่องว่าง");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('กรุณาเข้าสู่ระบบใหม่');
      }

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          username: formData.username.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      if (data.status === 'success') {
        updateUser(data.data.user);
        toast.success("บันทึกข้อมูลสำเร็จ");
      } else {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err);
      toast.error(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-28" key={refreshKey}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <label className="cursor-pointer">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#777777] hover:opacity-80 transition-opacity">
              <img 
                src={user?.avatar_url || defaultImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>
            <input 
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isSubmitting}
            />
          </label>
          <h1 className="text-xl"><span className="text-gray-500">{user?.username || user?.full_name || 'ผู้ใช้'}</span> <span className="text-gray-500">|</span> <span className="font-medium">Profile</span></h1>
        </div>

        <div className="flex">
          {/* Left Menu */}
          <div className="w-60 pr-6">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/profile" 
                className="flex items-center py-3 px-4 text-gray-900 font-medium"
              >
                <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </Link>
              
              <Link 
                to="/reset-password" 
                className="flex items-center py-3 px-4 text-gray-700"
              >
                <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Reset password
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 pl-10">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl ml-auto mr-10">
              <div className="flex items-center justify-start gap-6 mb-6">
                <div className="w-24 h-24 overflow-hidden rounded-full bg-[#777777]">
                  <img 
                    src={user?.avatar_url || defaultImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
                <label className="cursor-pointer w-[255px] h-[48px] flex items-center justify-center bg-white border border-[#75716B] rounded-[999px] text-sm text-[#555555] hover:bg-gray-50"
                     style={{ padding: '12px 40px' }}>
                  <span>Upload profile picture</span>
                  <input 
                    type="file"
                    name="avatar"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
              
              <div className="border-t border-gray-200 my-4"></div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#777777] mb-1">Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full p-2 bg-white border border-[#E0E0E0] rounded-md"
                    placeholder="กรุณากรอกชื่อของคุณ"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-[#777777] mb-1 text-left">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 bg-white border border-[#E0E0E0] rounded-md"
                    placeholder="กรุณากรอกชื่อผู้ใช้ของคุณ"
                  />
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm text-[#777777] mb-1 text-left">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#F0F0F0] border border-[#E0E0E0] rounded-md text-[#999999]"
                    readOnly
                    placeholder="อีเมลของคุณ"
                  />
                </div>
                
                <div className="flex justify-start mt-6">
                  <button
                    type="submit"
                    className="w-[120px] h-[48px] bg-[#26231E] text-white rounded-[999px] hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ padding: '12px 40px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังบันทึก...
                      </div>
                    ) : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 