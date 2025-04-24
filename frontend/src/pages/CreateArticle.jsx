import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultThumbnail from '../assets/Img_box_light.png';
import { IoChevronDownOutline } from "react-icons/io5";
import { useAuth } from '../context/AuthContext';

function CreateArticle() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    introduction: '',
    content: '',
    category: '',
    thumbnailImage: null,
    thumbnailPreview: null,
    authorName: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        authorName: user.name || user.username
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnailImage: file,
        thumbnailPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSaveAsDraft = () => {
    // TODO: Implement save as draft functionality
    console.log('Saving as draft:', formData);
    navigate('/article-management');
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing:', formData);
    navigate('/article-management');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] mt-10 sm:mt-30">
      {/* Header */}
      <div className="border-b border-gray-200 bg-[#F9F8F6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-medium text-[#26231E] text-center sm:text-left order-1">Create article</h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-2">
              <button
                onClick={handleSaveAsDraft}
                className="w-full sm:w-auto px-[40px] py-[12px] text-sm font-medium text-[#26231E] bg-white border border-gray-300 rounded-[999px] hover:bg-gray-50 sm:cursor-pointer sm:px-[40px]py-[12px]"
              >
                Save as draft
              </button>
              <button
                onClick={handlePublish}
                className="w-full sm:w-auto px-[40px] py-[12px] text-sm font-medium text-white bg-[#26231E] rounded-[999px] hover:bg-gray-800 sm:cursor-pointer"
              >
                Save and publish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Thumbnail Image */}
          <div>
            <label className="block text-base font-medium text-[#75716B] mb-3 sm:text-left">
              Thumbnail image
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-[#EFEEEB] rounded-xl shadow-sm w-full sm:w-[460px] h-[260px] border-2 border-dashed border-[#DAD6D1] cursor-pointer"
                onClick={() => document.getElementById('thumbnail-upload').click()}
              >
                <div className="relative h-full flex items-center justify-center">
                  <img
                    src={formData.thumbnailPreview || defaultThumbnail}
                    alt=""
                    className={`rounded-xl ${formData.thumbnailPreview ? 'w-full h-full object-cover' : 'w-[40px] h-[40px]'}`}
                  />
                </div>
              </div>
              <div className="flex items-center sm:items-end sm:h-[260px] ml-0 sm:ml-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="w-full sm:w-auto px-[40px] py-[12px] text-sm font-medium text-[#26231E] bg-white border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer text-center"
                >
                  Upload thumbnail image
                </label>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-base font-medium text-[#75716B] mb-3 text-left">
              Category
            </label>
            <div className="bg-[#F9F8F6] -ml-0 sm:-ml-4 relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="text-[#75716B] w-full sm:w-[480px] h-[48px] px-4 py-2.5 sm:ml-[-470px] text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 appearance-none bg-white"
              >
                <option value="">Select category</option>
                <option value="Cat">Cat</option>
                <option value="General">General</option>
                <option value="Inspiration">Inspiration</option>
              </select>
              <div className="absolute right-4 sm:right-[500px] top-1/2 transform -translate-y-1/2 pointer-events-none">
                <IoChevronDownOutline className="text-[#75716B] w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-base font-medium text-[#75716B] mb-3 text-left">
              Author name
            </label>
            <div className="bg-[#F9F8F6] -ml-0 sm:-ml-4">
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                className="text-[#75716B] w-full sm:w-[480px] h-[48px] px-4 py-2.5 sm:ml-[-470px] text-base border border-gray-300 rounded-lg bg-[#EFEEEB] cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-base font-medium text-[#75716B] mb-3 text-left">
              Title
            </label>
            <div className="bg-[#F9F8F6] -ml-0 sm:-ml-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Article title"
                className="bg-white w-full sm:w-[960px] h-[48px] px-4 py-2.5 sm:ml-[10px] text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          {/* Introduction */}
          <div>
            <label className="block text-base font-medium text-[#75716B] mb-3 text-left">
              Introduction (max 120 letters)
            </label>
            <div className="bg-[#F9F8F6] -ml-0 sm:-ml-4">
              <textarea
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                maxLength={120}
                rows={3}
                placeholder="Write a brief introduction"
                className="bg-white w-full sm:w-[960px] min-h-[143px] px-4 py-2.5 sm:ml-[10px] text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 resize-y"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-base font-medium text-[#75716B] mb-3 text-left">
              Content
            </label>
            <div className="bg-[#F9F8F6] -ml-0 sm:-ml-4">
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                placeholder="Write your article content"
                className="bg-white w-full sm:w-[960px] min-h-[572px] px-4 py-2.5 mb-30 sm:ml-[10px] text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 resize-y"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateArticle; 