import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCategory() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement category creation
    console.log('Creating category:', categoryName);
    navigate('/admin/category-management');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Create category</h1>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800"
        >
          Save
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateCategory; 