import React from 'react';
import { FaBell } from 'react-icons/fa';

const NotificationBell = () => {
  return (
    <div className="relative inline-block">
      <div className="cursor-pointer p-2 text-2xl text-gray-600 hover:text-gray-800 transition-colors duration-200">
        <FaBell />
        {/* Badge จำลอง - ค่อยเชื่อมกับระบบจริงทีหลัง */}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs min-w-[18px] text-center">
          2
        </span>
      </div>
    </div>
  );
};

export default NotificationBell; 