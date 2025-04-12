import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      setIsSubmitting(true);
      try {
        console.log('Uploading file:', file);
        
        // สร้าง FormData สำหรับการอัพโหลดไฟล์
        const formData = new FormData();
        formData.append('avatar', file);
        
        const token = localStorage.getItem('accessToken');
        console.log('Upload URL:', `${API_URL}/users/upload-avatar`);
        
        // ส่งไฟล์ไปยัง API
        const response = await axios.post(`${API_URL}/users/upload-avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Upload response:', response.data);
        
        // อัพเดตรูปในหน้า UI
        if (response.data.status === 'success') {
          const avatarUrl = response.data.data.user.avatar_url;
          const updatedUser = {
            ...user,
            avatar_url: avatarUrl
          };
          updateUser(updatedUser);
          toast.success('อัพโหลดรูปภาพสำเร็จ');
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // เตรียมข้อมูลที่จะส่ง
      const dataToUpdate = {
        full_name: formData.full_name,
        username: formData.username
      };

      console.log('API URL:', API_URL);
      console.log('Data to update:', dataToUpdate);
      
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token);

      // ส่งข้อมูลไปยัง API
      const response = await axios.put(`${API_URL}/users/profile`, dataToUpdate, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response.data);
      
      // อัปเดต user context ถ้าการส่งข้อมูลสำเร็จ
      if (response.data.status === 'success') {
        const updatedUser = {
          ...user,
          full_name: formData.full_name,
          username: formData.username
        };
        updateUser(updatedUser);
        toast.success("บันทึกข้อมูลสำเร็จ");
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-28">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#777777]">
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
                    className="w-[120px] h-[48px] bg-[#26231E] text-white rounded-[999px] hover:bg-gray-800 disabled:opacity-50"
                    style={{ padding: '12px 40px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'กำลัง...' : 'Save'}
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