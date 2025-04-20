import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultThumbnail from '../../assets/default-thumbnail.jpg';

function CreateArticle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    introduction: '',
    content: '',
    category: '',
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
    console.log('Saving as draft:', formData);
    navigate('/admin/article-management');
  };

  const handlePublish = () => {
    console.log('Publishing:', formData);
    navigate('/admin/article-management');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Create article</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSaveAsDraft}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
          >
            Save as draft
          </button>
          <button
            onClick={handlePublish}
            className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800"
          >
            Save and publish
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Thumbnail Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail image
          </label>
          <div className="relative">
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-3" style={{ height: '156px' }}>
              <img
                src={formData.thumbnailPreview || defaultThumbnail}
                alt="Thumbnail preview"
                className="w-full h-full object-contain"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="thumbnail-upload"
            />
            <label
              htmlFor="thumbnail-upload"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer"
            >
              Upload thumbnail image
            </label>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 text-gray-500 bg-white border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
          >
            <option value="">Select category</option>
            <option value="Cat">Cat</option>
            <option value="General">General</option>
            <option value="Inspiration">Inspiration</option>
          </select>
        </div>

        {/* Author name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author name
          </label>
          <input
            type="text"
            name="authorName"
            value="Thompson P."
            disabled
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Article title"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
          />
        </div>

        {/* Introduction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Introduction (max 120 letters)
          </label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleInputChange}
            maxLength={120}
            rows={3}
            placeholder="Introduction"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400 resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            placeholder="Content"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

export default CreateArticle; 