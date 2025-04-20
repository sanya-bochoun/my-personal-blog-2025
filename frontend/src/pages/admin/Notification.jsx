import React from 'react';
import { Link } from 'react-router-dom';

function Notification() {
  const notifications = [
    {
      id: 1,
      type: 'comment',
      user: {
        name: 'Jacob Lash',
        avatar: 'https://via.placeholder.com/40'
      },
      article: {
        title: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
        id: '1'
      },
      content: '"I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting."',
      timeAgo: '4 hours ago'
    },
    {
      id: 2,
      type: 'like',
      user: {
        name: 'Jacob Lash',
        avatar: 'https://via.placeholder.com/40'
      },
      article: {
        title: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
        id: '1'
      },
      timeAgo: '4 hours ago'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Notification</h1>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white rounded-lg p-4 flex items-start gap-4"
          >
            <img
              src={notification.user.avatar}
              alt={notification.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{notification.user.name}</span>
                    {notification.type === 'comment' ? ' Commented on your article: ' : ' liked your article: '}
                    <span className="font-medium">{notification.article.title}</span>
                  </p>
                  {notification.type === 'comment' && (
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.timeAgo}
                  </p>
                </div>
                <Link
                  to={`/admin/article/${notification.article.id}`}
                  className="text-sm font-medium text-gray-900 hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notification; 