import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultThumbnail from '../assets/default-thumbnail.jpg';

function CreateArticle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    introduction: '',
    content: '',
    category: 'Cat',
    thumbnailImage: null,
    thumbnailPreview: null
  });

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
    <div className="min-h-screen bg-[#F9F9F9] pt-16 pb-20 sm:pt-20 sm:pb-20 sm:mt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Stack buttons on mobile */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Create article</h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={handleSaveAsDraft}
              className="w-full sm:w-auto px-6 py-2.5 text-base sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              Save as draft
            </button>
            <button
              onClick={handlePublish}
              className="w-full sm:w-auto px-6 py-2.5 text-base sm:text-sm font-medium text-white bg-[#26231E] rounded-full hover:bg-gray-800 active:bg-gray-900 transition-colors"
            >
              Save and publish
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Thumbnail Image */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <label className="block text-base font-medium text-gray-700 mb-3">
              Thumbnail image
            </label>
            <div className="relative">
              <img
                src={formData.thumbnailPreview || defaultThumbnail}
                alt="Thumbnail preview"
                className="w-full h-52 sm:h-48 object-cover rounded-lg mb-4"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="block w-full sm:w-auto text-center px-6 py-2.5 text-base sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
              >
                Upload thumbnail image
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <label className="block text-base font-medium text-gray-700 mb-3">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 appearance-none bg-white"
            >
              <option value="Cat">Cat</option>
              <option value="General">General</option>
              <option value="Inspiration">Inspiration</option>
            </select>
          </div>

          {/* Title */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <label className="block text-base font-medium text-gray-700 mb-3">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter article title"
              className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Introduction */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <label className="block text-base font-medium text-gray-700 mb-3">
              Introduction (max 120 letters)
            </label>
            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleInputChange}
              maxLength={120}
              rows={3}
              placeholder="Write a brief introduction"
              className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Content */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <label className="block text-base font-medium text-gray-700 mb-3">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={10}
              placeholder="Write your article content"
              className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateArticle; 