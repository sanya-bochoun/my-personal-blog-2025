import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AdminResetUserPassword() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Mock user data - ในการใช้งานจริงควรดึงข้อมูลจาก API
  const user = {
    id: userId,
    name: 'Thompson P.',
    email: 'thompson.p@gmail.com'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // TODO: Implement password reset logic
    console.log('Resetting password for user:', userId, formData);
    navigate('/admin/user-management');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Reset user password</h1>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800"
        >
          Reset password
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">User Information</h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Email:</span> {user.email}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="New password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
            required
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm new password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
            required
          />
        </div>
      </form>
    </div>
  );
}

export default AdminResetUserPassword; 