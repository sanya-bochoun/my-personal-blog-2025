import React, { useState, useEffect } from 'react';
import { BsBell } from 'react-icons/bs';
import { AiOutlineLike, AiOutlineComment } from 'react-icons/ai';
import { FaRegNewspaper } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/notifications`);
      setActivities(response.data.data.activities);
    } catch (error) {
      toast.error('ไม่สามารถดึงข้อมูลกิจกรรมได้');
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      fetchActivities();
    }
  }, [showDropdown]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'post':
        return <FaRegNewspaper className="text-blue-500" />;
      case 'like':
      case 'comment_like':
        return <AiOutlineLike className="text-red-500" />;
      case 'comment':
        return <AiOutlineComment className="text-green-500" />;
      default:
        return <BsBell className="text-gray-500" />;
    }
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'post':
        return `${activity.user_name} ได้สร้างโพสต์ใหม่: ${activity.content}`;
      case 'like':
        return `${activity.user_name} ถูกใจโพสต์: ${activity.content}`;
      case 'comment':
        return `${activity.user_name} แสดงความคิดเห็น: ${activity.content}`;
      case 'comment_like':
        return `${activity.user_name} ถูกใจความคิดเห็น: ${activity.content}`;
      default:
        return 'กิจกรรมใหม่';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <BsBell className="text-xl" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[80vh] overflow-y-auto z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">กิจกรรมล่าสุด</h3>
            {loading ? (
              <div className="text-center py-4">กำลังโหลด...</div>
            ) : activities.length === 0 ? (
              <div className="text-center py-4 text-gray-500">ไม่มีกิจกรรมใหม่</div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">
                        {getActivityMessage(activity)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleString('th-TH')}
                      </p>
                    </div>
                    {activity.user_avatar && (
                      <img
                        src={activity.user_avatar}
                        alt={activity.user_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 