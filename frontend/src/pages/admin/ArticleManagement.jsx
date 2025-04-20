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
      title: "Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do",
      category: "Cat",
      status: "Published"
    },
    {
      id: 2,
      title: "The Fascinating World of Cats: Why We Love Our Furry Friends",
      category: "Cat",
      status: "Published"
    },
    {
      id: 3,
      title: "Finding Motivation: How to Stay Inspired Through Life's Challenges",
      category: "General",
      status: "Published"
    },
    {
      id: 4,
      title: "The Science of the Cat's Purr: How It Benefits Cats and Humans Alike",
      category: "Cat",
      status: "Published"
    },
    {
      id: 5,
      title: "Top 10 Health Tips to Keep Your Cat Happy and Healthy",
      category: "Cat",
      status: "Published"
    },
    {
      id: 6,
      title: "Unlocking Creativity: Simple Habits to Spark Inspiration Daily",
      category: "Inspiration",
      status: "Published"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Article management</h1>
        <Link
          to="/admin/create-article"
          className="inline-flex items-center px-4 py-2 bg-[#26231E] text-white rounded-full hover:bg-gray-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create article
        </Link>
      </div>

      <div className="space-y-4 mb-6">
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg"
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

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white"
          >
            <option value="">Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white"
          >
            <option value="">Category</option>
            <option value="cat">Cat</option>
            <option value="general">General</option>
            <option value="inspiration">Inspiration</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{article.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{article.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    article.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ArticleManagement; 