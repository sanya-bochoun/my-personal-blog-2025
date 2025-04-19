import React, { useState, useEffect, useRef } from 'react';
import bellIcon from '../assets/Bell_light-v2.png';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ปิด dropdown เมื่อคลิกนอกพื้นที่
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ข้อมูลการแจ้งเตือนจำลอง
  const notifications = [
    { id: 1, message: 'มีผู้ติดตามใหม่', time: '5 นาทีที่แล้ว' },
    { id: 2, message: 'โพสต์ของคุณได้รับไลค์', time: '10 นาทีที่แล้ว' },
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div 
        className="cursor-pointer p-2 text-2xl text-gray-600 hover:text-gray-800 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={bellIcon} alt="notifications" className="w-[48px] h-[48px]" />
        {/* Badge จำลอง - ค่อยเชื่อมกับระบบจริงทีหลัง */}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs min-w-[18px] text-center">
          2
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">การแจ้งเตือน</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <p className="text-sm text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-150">
              ดูการแจ้งเตือนทั้งหมด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 