import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ArticleManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // ข้อมูลตัวอย่าง (จะแทนที่ด้วยข้อมูลจริงจาก API ภายหลัง)
  const articles = [
    {
      id: 1,
      title: "The Fascinating World of Cats: Why We Love Our Furry Friends",
      category: "Cat",
      status: "Draft"
    },
    {
      id: 2,
      title: "Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do",
      category: "Cat",
      status: "Published"
    },
    // ... other articles
  ];

  const categories = ["Cat", "General", "Inspiration"];
  const statuses = ["Draft", "Published"];

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-16 sm:pt-20 sm:mt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Article management</h1>
          <Link
            to="/create-article"
            className="w-full sm:w-auto bg-[#26231E] text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors text-center"
          >
            + Create article
          </Link>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white"
            >
              <option value="">Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white"
            >
              <option value="">Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header - Hidden on Mobile */}
          <div className="hidden sm:block px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 text-sm font-medium text-gray-500">Article title</div>
              <div className="col-span-3 text-sm font-medium text-gray-500">Category</div>
              <div className="col-span-3 text-sm font-medium text-gray-500">Status</div>
            </div>
          </div>

          {/* Articles */}
          {articles.map((article) => (
            <div
              key={article.id}
              className="px-4 py-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center">
                <div className="sm:col-span-6">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {article.title}
                  </h3>
                </div>
                <div className="flex justify-between items-center sm:col-span-3">
                  <span className="text-sm text-gray-600 sm:hidden">Category:</span>
                  <span className="text-sm text-gray-600">{article.category}</span>
                </div>
                <div className="flex justify-between items-center sm:col-span-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:hidden">Status:</span>
                    <span className={`text-sm ${
                      article.status === 'Published' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArticleManagement; 