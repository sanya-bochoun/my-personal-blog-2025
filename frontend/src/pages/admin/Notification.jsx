import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // Add 1 second delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Notification</h1>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-8 bg-white rounded-lg">
            <FiLoader className="w-6 h-6 text-gray-400 animate-spin mr-2" />
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg text-gray-500">
            No notifications found
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg p-4 flex items-start gap-4"
            >
              <img
                src={notification.user?.avatar || 'https://via.placeholder.com/40'}
                alt={notification.user?.name || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{notification.user?.name || 'User'}</span>
                      {notification.type === 'comment' ? ' commented on your article: ' : ' liked your article: '}
                      <span className="font-medium">{notification.article?.title || 'Article'}</span>
                    </p>
                    {notification.type === 'comment' && notification.content && (
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.content}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  {notification.link && (
                    <Link
                      to={notification.link}
                      className="text-sm font-medium text-gray-900 hover:underline"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notification; 