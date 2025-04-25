import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaUser, FaCalendar, FaFolder } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/detail/${slug}`);
        setArticle(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch article');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

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
          <IoMdArrowRoundBack className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-gray-600 hover:text-blue-500 mb-6"
      >
        <IoMdArrowRoundBack className="mr-2" /> Back to Articles
      </Link>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        
        {/* Meta information */}
        <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
          <div className="flex items-center">
            <FaCalendar className="mr-2" />
            {format(new Date(article.created_at), 'MMMM d, yyyy')}
          </div>
          <div className="flex items-center">
            <FaFolder className="mr-2" />
            {article.Category.name}
          </div>
          <div className="flex items-center">
            <FaUser className="mr-2" />
            {article.Author.username}
          </div>
        </div>

        {/* Featured Image */}
        {article.thumbnail_image && (
          <img
            src={article.thumbnail_image}
            alt={article.title}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-8"
          />
        )}

        {/* Introduction */}
        <div className="text-xl text-gray-600 mb-8 italic">
          {article.introduction}
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* Author Section */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-4">
          {article.Author.avatar_url ? (
            <img
              src={article.Author.avatar_url}
              alt={article.Author.username}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <FaUser className="text-gray-600 text-2xl" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              About {article.Author.username}
            </h3>
            <p className="text-gray-600">
              {article.Author.bio || 'No bio available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail; 