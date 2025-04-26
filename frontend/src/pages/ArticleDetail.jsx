import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaUser, FaCalendar, FaFolder, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ดึงคอมเมนต์
  const fetchComments = async (postId) => {
    try {
      setCommentLoading(true);
      const response = await axios.get(`${API_URL}/api/comments/post/${postId}`);
      setComments(response.data.data || response.data || []);
    } catch {
      setComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles/detail/${slug}`);
        if (response.data.status === 'success') {
          console.log('Article Data:', response.data.data);
          setArticle(response.data.data);
          setLikeCount(response.data.data.like_count || 0);
          fetchComments(response.data.data.id);
        } else {
          setError('ไม่สามารถโหลดบทความได้');
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดบทความ');
        setLoading(false);
      }
    };

    const checkLikeStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await axios.get(
          `${API_URL}/api/likes/articles/${article?.id}/check`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setHasLiked(response.data.hasLiked);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    fetchArticle();
    if (article?.id) {
      checkLikeStatus();
    }
  }, [slug, API_URL, article?.id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const method = hasLiked ? 'DELETE' : 'POST';
      const response = await axios({
        method,
        url: `${API_URL}/api/likes/articles/${article.id}/like`,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201 || response.status === 200) {
        setHasLiked(!hasLiked);
        setLikeCount(prevCount => hasLiked ? prevCount - 1 : prevCount + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('เกิดข้อผิดพลาดในการกดไลค์');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      await axios.post(
        `${API_URL}/api/comments`,
        { post_id: article.id, content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment('');
      fetchComments(article.id);
    } catch {
      alert('เกิดข้อผิดพลาดในการส่งคอมเมนต์');
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('คัดลอกลิงก์เรียบร้อยแล้ว!');
      })
      .catch(() => {
        toast.error('ไม่สามารถคัดลอกลิงก์ได้');
      });
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article?.title || '');
    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link to="/" className="text-blue-500 hover:underline flex items-center">
          <IoMdArrowRoundBack className="mr-2" /> กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="max-w-[1300px] mx-auto">
      {/* Header with Profile */}
      <div className="px-8 py-4 border-b flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">hh.</Link>
        <div className="flex items-center gap-2">
          <img
            src={article.Author?.avatar_url || '/default-avatar.png'}
            alt={article.Author?.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-sm">{article.Author?.username}</span>
        </div>
      </div>

      <div className="px-8 py-8 text-left">
        {/* Featured Image */}
        {article.thumbnail_url && (
          <div className="mb-8">
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="w-[1300px] h-[587px] object-cover rounded-2xl mx-auto"
            />
          </div>
        )}

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Category and Date */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-[68px] h-[24px] px-[25px] flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  {article.category || 'ไม่ระบุหมวดหมู่'}
                </span>
                <time className="text-sm text-gray-500">
                  {format(new Date(article.created_at), 'd MMMM yyyy')}
                </time>
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-left">
              {article.title}
            </h1>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="text-gray-600 mb-8 text-lg leading-relaxed">
                {article.introduction}
              </div>
              <Markdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({...props}) => <h1 className="text-2xl font-bold mb-4 mt-8" {...props} />,
                  h2: ({...props}) => <h2 className="text-xl font-semibold mb-4 mt-6" {...props} />,
                  h3: ({...props}) => <h3 className="text-lg font-semibold mb-3 mt-5" {...props} />,
                  p: ({...props}) => <p className="text-gray-600 mb-4 leading-relaxed" {...props} />,
                  ul: ({...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                  ol: ({...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                  li: ({...props}) => <li className="text-gray-600" {...props} />,
                  blockquote: ({...props}) => (
                    <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4" {...props} />
                  ),
                  code: ({inline, ...props}) => (
                    inline ? 
                    <code className="bg-gray-100 rounded px-1 py-0.5" {...props} /> :
                    <code className="block bg-gray-100 rounded p-4 my-4 overflow-auto" {...props} />
                  )
                }}
              >
                {article.content}
              </Markdown>
            </div>

            {/* Like and Share Section */}
            <div className="flex justify-between items-center bg-[#EFEEEB] rounded-[16px] px-[24px] py-[16px] mb-8">
              <div className="bg-white px-[40px] py-[12px] rounded-[999px] flex items-center gap-2">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${hasLiked ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-800 cursor-pointer`}
                >
                  <InsertEmoticonIcon className={`text-2xl ${hasLiked ? 'text-blue-600' : ''}`} />
                  <span className="font-medium">{likeCount}</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button className="bg-white flex items-center gap-2 px-[40px] py-[12px] border rounded-[999px] hover:bg-gray-100 cursor-pointer"
                  onClick={handleCopyLink}
                >
                  <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
                  Copy link
                </button>
                <div className="flex gap-2">
                  <button onClick={() => handleShare('facebook')} className="w-[48px] h-[48px] flex items-center justify-center bg-[#1877F2] text-white rounded-full hover:bg-blue-600 cursor-pointer">
                    <FaFacebookF size={18} />
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="w-[48px] h-[48px] flex items-center justify-center bg-[#0A66C2] text-white rounded-full hover:bg-blue-700 cursor-pointer">
                    <FaLinkedinIn size={18} />
                  </button>
                  <button onClick={() => handleShare('twitter')} className="w-[48px] h-[48px] flex items-center justify-center bg-[#1DA1F2] text-white rounded-full hover:bg-blue-400 cursor-pointer">
                    <FaTwitter size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <div className="mt-12">
              <h3 className="text-[16px] font-semibold text-[#75716B] mb-4">Comments</h3>
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="bg-white text-[16px] w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                />
                <div className='text-right'>
                  <button
                    type="submit"
                    className="mt-2 px-[40px] py-[12px] text-right bg-black text-white rounded-full hover:bg-gray-800"
                  >
                    Send
                  </button>
                </div>
              </form>
              {commentLoading ? (
                <div>Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-gray-400">No comments yet.</div>
              ) : (
                comments.map((c, idx) => (
                  <div key={c.id || idx} className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                      <img src={c.avatar_url || '/default-avatar.png'} alt={c.username} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="font-semibold text-black">{c.username}</div>
                        <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })}</div>
                      </div>
                    </div>
                    <div className="ml-11 text-gray-700 text-[15px]">{c.content}</div>
                    <hr className="my-6" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Author Bio - Sticky Sidebar */}
          <div className="w-[320px]">
            <div className="sticky top-20 bg-[#EFEEEB] w-[257px] min-h-[200px] h-fit rounded-lg p-6">
              <div className="flex items-start gap-3">
                <img
                  src={article['Author.avatar_url'] || '/default-avatar.png'}
                  alt={article['Author.username']}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="text-xs text-gray-500">Author</div>
                  <div className="font-medium text-sm">{article['Author.username']}</div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#DAD6D1] my-4"></div>
              <div className="text-gray-600 text-sm leading-relaxed">
                {article['Author.bio']}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail; 