import React, { useState } from 'react';

function ResetPassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    console.log('Resetting password:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Reset password</h1>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800"
        >
          Reset password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Current password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
            required
          />
        </div>

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

export default ResetPassword; 