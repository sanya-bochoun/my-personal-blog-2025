import React, { useState } from 'react';

function AdminProfile() {
  const defaultAvatar = 'https://via.placeholder.com/150';
  const [formData, setFormData] = useState({
    name: 'Thompson P.',
    username: 'thompson',
    email: 'thompson.p@gmail.com',
    bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.\n\nWhen I\'m not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.',
    profilePicture: null,
    profilePicturePreview: null
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
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update
    console.log('Updating profile:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Profile</h1>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800"
        >
          Save
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={formData.profilePicturePreview || defaultAvatar}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer"
            >
              Upload profile picture
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio (max 120 letters)
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={6}
            maxLength={120}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400 resize-none"
          />
        </div>
      </form>
    </div>
  );
}

export default AdminProfile; 