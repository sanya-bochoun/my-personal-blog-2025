import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ArticleManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ดึงข้อมูล token จาก localStorage
    const token = localStorage.getItem('token');
    
    // ฟังก์ชันสำหรับดึงข้อมูลบทความ
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/articles`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Articles data from API:', response.data);
        
        if (response.data.success && response.data.data) {
          // ใช้ข้อมูลโดยตรงจาก API โดยไม่แก้ไขโครงสร้าง
          setArticles(response.data.data);
        } else {
          setError('Failed to fetch articles');
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Error fetching articles. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // ฟังก์ชันสำหรับดึงข้อมูลหมวดหมู่
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
        console.log('Categories data from API:', response.data);
        
        // รองรับหลายรูปแบบของ API response
        if (response.data.data) {
          setCategories(response.data.data);
        } else if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    };
    
    fetchArticles();
    fetchCategories();
  }, []);

  // ฟังก์ชันสำหรับลบบทความ
  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบบทความนี้ใช่หรือไม่?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setArticles(articles.filter(article => article.id !== id));
          alert('ลบบทความสำเร็จ');
        }
      } catch (err) {
        console.error('Error deleting article:', err);
        alert('เกิดข้อผิดพลาดในการลบบทความ');
      }
    }
  };

  // กรองบทความตามเงื่อนไขการค้นหา
  const filteredArticles = articles.filter(article => {
    const matchesSearchQuery = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || article.status === selectedStatus;
    
    // กรองตามหมวดหมู่โดยใช้ category_name
    const matchesCategory = !selectedCategory || article.category_name === selectedCategory;
    
    return matchesSearchQuery && matchesStatus && matchesCategory;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white"
            >
              <option value="">Category</option>
              {categories.map(category => (
                <option key={category.id || category.name} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header - Hidden on Mobile */}
          <div className="hidden sm:block px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 text-sm font-medium text-gray-500">ARTICLE TITLE</div>
              <div className="col-span-3 text-sm font-medium text-gray-500">CATEGORY</div>
              <div className="col-span-3 text-sm font-medium text-gray-500">STATUS</div>
            </div>
          </div>

          {/* Articles */}
          {filteredArticles.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">ไม่พบบทความ</div>
          ) : (
            filteredArticles.map((article) => (
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
                    <span className="text-sm text-gray-600">
                      {article.category_name || "ไม่ระบุหมวดหมู่"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:hidden">Status:</span>
                      <span className={`text-sm ${
                        article.status === 'published' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/edit-article/${article.id}`} className="p-1 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(article.id)} 
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleManagement; 