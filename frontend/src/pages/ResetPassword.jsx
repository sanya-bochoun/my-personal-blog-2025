import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

function ResetPassword() {
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState('');
  
  // ใช้รูปโลโก้ default เป็นค่าเริ่มต้น
  const defaultImage = '/src/assets/default-logo.png';

  // ใช้ useEffect เพื่อให้มั่นใจว่าเราอัพเดทข้อมูลเมื่อ user โหลดเสร็จ
  useEffect(() => {
    if (user) {
      setProfileImage(user.avatar_url || defaultImage);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // ลบข้อความแจ้งเตือนเมื่อผู้ใช้เริ่มแก้ไข
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.current_password) {
      newErrors.current_password = 'Please enter your current password';
    }
    
    if (!formData.new_password) {
      newErrors.new_password = 'Please enter a new password';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: formData.current_password,
          new_password: formData.new_password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }

      toast.success('เปลี่ยนรหัสผ่านสำเร็จ');
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error(err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-28">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#777777]">
            <img 
              src={profileImage || defaultImage} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl"><span className="text-gray-500">{user?.username || user?.full_name || 'ผู้ใช้'}</span> <span className="text-gray-500">|</span> <span className="font-medium">Reset Password</span></h1>
        </div>

        <div className="flex">
          {/* Left Menu */}
          <div className="w-60 pr-6">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/profile" 
                className="flex items-center py-3 px-4 text-gray-700"
              >
                <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </Link>
              
              <Link 
                to="/reset-password" 
                className="flex items-center py-3 px-4 text-gray-900 font-medium"
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
            <div className="bg-[#EFEEEB] rounded-lg shadow-sm p-8 max-w-2xl ml-auto mr-10">
              <div className="flex items-center justify-start gap-6 mb-6">
                <div className="w-24 h-24 overflow-hidden rounded-full bg-[#777777]">
                  <img 
                    src={profileImage || defaultImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-medium">Reset Password</h2>
              </div>
              
              <div className="border-t border-gray-200 my-4"></div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#777777] mb-1 text-left">Current Password</label>
                  <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className={`w-full p-2 bg-white border ${errors.current_password ? 'border-red-500' : 'border-[#E0E0E0]'} rounded-md`}
                    placeholder="Enter your current password"
                  />
                  {errors.current_password && (
                    <p className="mt-1 text-sm text-red-500">{errors.current_password.replace('กรุณากรอกรหัสผ่านปัจจุบัน', 'Please enter your current password')}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-[#777777] mb-1 text-left">New Password</label>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className={`w-full p-2 bg-white border ${errors.new_password ? 'border-red-500' : 'border-[#E0E0E0]'} rounded-md`}
                    placeholder="Enter your new password"
                  />
                  {errors.new_password && (
                    <p className="mt-1 text-sm text-red-500">{errors.new_password.replace('กรุณากรอกรหัสผ่านใหม่', 'Please enter a new password').replace('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร', 'Password must be at least 8 characters')}</p>
                  )}
                  <p className="mt-1 text-xs text-[#999999] text-left">Password must be at least 8 characters</p>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm text-[#777777] mb-1 text-left">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`w-full p-2 bg-white border ${errors.confirm_password ? 'border-red-500' : 'border-[#E0E0E0]'} rounded-md`}
                    placeholder="Confirm your new password"
                  />
                  {errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirm_password.replace('กรุณายืนยันรหัสผ่านใหม่', 'Please confirm your new password').replace('รหัสผ่านไม่ตรงกัน', 'Passwords do not match')}</p>
                  )}
                </div>
                
                <div className="flex justify-start mt-6">
                  <button
                    type="submit"
                    className="w-[120px] h-[48px] bg-[#26231E] text-white rounded-[999px] hover:bg-gray-800 disabled:opacity-50"
                    style={{ padding: '12px 40px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Save'}
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

export default ResetPassword; 