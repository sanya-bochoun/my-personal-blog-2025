import React, { useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { HiOutlineClipboard, HiOutlineClipboardCheck } from 'react-icons/hi';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';

const SocialShareBanner = ({ likes = 0, url }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform) => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between h-auto lg:h-20 p-4 border-t border-b border-gray-200 bg-[#f0efeb] rounded-2xl">
      <button 
        onClick={handleLike}
        className="flex items-center justify-center gap-[6px] px-6 py-2 bg-white rounded-[999px] border border-[#brown/white] h-[48px] w-full lg:w-auto mb-3 lg:mb-0"
      >
        {isLiked ? <AiFillLike className="text-blue-500 text-xl" /> : <AiOutlineLike className="text-xl" />}
        <span className="text-gray-700">{likeCount}</span>
      </button>

      <div className="flex items-center gap-3">
        <button 
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-[6px] h-[48px] px-6 py-2 bg-white rounded-[999px] border border-[#brown/white] min-w-[135px] lg:w-[185px]"
        >
          <div className="flex items-center gap-1">
            {isCopied ? <HiOutlineClipboardCheck className="text-green-500 text-xl" /> : <HiOutlineClipboard className="text-xl" />}
            <span className="text-gray-700 whitespace-nowrap">Copy link</span>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => handleShare('facebook')}
            className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <FaFacebookF className="h-5 w-5" />
          </button>
          <button 
            onClick={() => handleShare('linkedin')}
            className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <FaLinkedinIn className="h-5 w-5" />
          </button>
          <button 
            onClick={() => handleShare('twitter')}
            className="flex items-center justify-center h-[48px] w-[48px] rounded-full bg-blue-400 text-white hover:bg-blue-500"
          >
            <FaTwitter className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialShareBanner; 