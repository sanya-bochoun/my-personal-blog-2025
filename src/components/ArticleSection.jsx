import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STYLES } from '../constants/styles';
import { cn } from "../lib/utils";
import BlogCard from './BlogCard';
import { fetchPosts } from '../services/api';
import { formatDate } from '../utils/date';

const categories = ["Highlight", "Cat", "Inspiration", "General"];

const LOADING_DELAY = 1000; // 1 second delay

const ArticleSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Highlight');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleArticleClick = (id) => {
    navigate(`/article/${id}`);
  };

  const loadPosts = async (page) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add delay before fetching
      await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
      
      const data = await fetchPosts({
        page,
        category: selectedCategory === 'Highlight' ? '' : selectedCategory,
        keyword: searchTerm
      });
      
      // Format dates before setting posts
      const formattedPosts = data.posts.map(post => ({
        ...post,
        date: formatDate(post.date)
      }));
      
      if (page === 1) {
        // Reset posts if it's first page
        setPosts(formattedPosts);
      } else {
        // Append new posts to existing ones
        setPosts(prevPosts => [...prevPosts, ...formattedPosts]);
      }

      // Check if we have more posts to load
      setHasMore(data.currentPage < data.totalPages);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error loading posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial posts or when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadPosts(1);
  }, [selectedCategory, searchTerm]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadPosts(nextPage);
  };

  return (
    <section className={cn("article-section", STYLES.layout.wrapper, "w-full bg-[#F8F7F6]")}>
      <div className={cn("article-container", `${STYLES.layout.container.mobile} ${STYLES.layout.container.desktop}`)}>
        <div className="article-content w-full px-4 md:px-6 lg:px-8">
          <h1 className={cn("article-title", STYLES.components.article.title)}>Latest articles</h1>
          
          {/* Mobile View */}
          <div className={cn("search-mobile", STYLES.components.article.search.mobile.wrapper)}>
            {/* Search Input */}
            <div className={cn("search-mobile-input-container", STYLES.components.article.search.mobile.input.container)}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("search-mobile-input", STYLES.components.article.search.mobile.input.field)}
              />
              <div className={cn("search-mobile-icon", STYLES.components.article.search.mobile.input.icon)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            {/* Category Dropdown */}
            <div className={cn("category-mobile-container", STYLES.components.article.search.mobile.category.container)}>
              <p className={cn("category-mobile-label", STYLES.components.article.search.mobile.category.label)}>Category</p>
              <div className={cn("category-mobile-select-wrapper", STYLES.components.article.search.mobile.category.select.wrapper)}>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={cn("category-mobile-select", STYLES.components.article.search.mobile.category.select.field)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className={cn("category-mobile-select-icon", STYLES.components.article.search.mobile.category.select.icon)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop View */}
          <nav className={cn("search-desktop", STYLES.components.article.search.desktop.wrapper)}>
            <div className={cn("search-desktop-container", STYLES.components.article.search.desktop.container)}>
              <div className="category-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "category-button",
                      selectedCategory === category
                        ? STYLES.components.article.search.desktop.button.active
                        : STYLES.components.article.search.desktop.button.inactive
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className={cn("search-desktop-input-container", STYLES.components.article.search.desktop.input.container)}>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn("search-desktop-input", STYLES.components.article.search.desktop.input.field)}
                />
                <div className={cn("search-desktop-icon", STYLES.components.article.search.desktop.input.icon)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </nav>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center my-4">
              {error}
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className={cn(
            "blog-posts-grid",
            "grid grid-cols-1 md:grid-cols-2 gap-8",
            "mt-8"
          )}>
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                date={post.date}
                onClick={handleArticleClick}
              />
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading posts...</span>
            </div>
          )}

          {/* View More Button */}
          {hasMore && !isLoading && (
            <div className="text-center mt-8 mb-12">
              <button
                onClick={handleLoadMore}
                className={cn(
                  "px-6 py-2.5 rounded-full",
                  "border border-[#DAD6D1] hover:border-gray-400",
                  "text-sm font-medium text-gray-600 hover:text-gray-800",
                  "transition-all duration-200 ease-in-out",
                  "flex items-center justify-center mx-auto gap-2",
                  "hover:shadow-sm"
                )}
              >
                View more
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                >
                  <path 
                    d="M19 9L12 16L5 9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticleSection; 