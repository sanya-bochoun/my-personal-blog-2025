import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiKey, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function UserManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Thompson P.',
      username: 'thompson',
      email: 'thompson.p@gmail.com',
      status: 'active',
      lastLogin: '2024-03-15 14:30'
    },
    {
      id: 2,
      name: 'Jacob Lash',
      username: 'jacob',
      email: 'jacob.l@gmail.com',
      status: 'locked',
      lastLogin: '2024-03-10 09:15'
    }
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResetPassword = (userId) => {
    navigate(`/admin/reset-user-password/${userId}`);
  };

  const handleUnlockAccount = (userId) => {
    // TODO: Implement account unlock functionality
    console.log('Unlock account for user:', userId);
  };

  const handleDeleteUser = (userId) => {
    // TODO: Implement user deletion with confirmation
    console.log('Delete user:', userId);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">User management</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg overflow-hidden shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Reset Password"
                    >
                      <FiKey className="w-4 h-4" />
                    </button>
                    {user.status === 'locked' && (
                      <button
                        onClick={() => handleUnlockAccount(user.id)}
                        className="text-gray-500 hover:text-gray-700"
                        title="Unlock Account"
                      >
                        <FiLock className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-gray-500 hover:text-red-600"
                      title="Delete User"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement; 