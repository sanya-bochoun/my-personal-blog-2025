import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function CategoryManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([
    { id: 1, name: 'Cat' },
    { id: 2, name: 'General' },
    { id: 3, name: 'Inspiration' }
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id) => {
    // TODO: Implement edit functionality
    console.log('Edit category:', id);
  };

  const handleDelete = (id) => {
    // TODO: Implement delete functionality
    console.log('Delete category:', id);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Category management</h1>
        <button 
          onClick={() => navigate('/admin/create-category')}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
        >
          <span>+</span> Create category
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
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

      {/* Categories List */}
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-700">Category</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredCategories.map((category) => (
            <div key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-100">
              <span className="text-sm text-gray-900">{category.name}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEdit(category.id)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement; 