import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STYLES } from '../constants/styles';
import { cn } from "@/lib/utils";
import { blogPosts } from '../data/blogPosts';
import BlogCard from './BlogCard';

const categories = ["Highlight", "Cat", "Inspiration", "General"];

const ArticleSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Highlight');
  const [searchTerm, setSearchTerm] = useState('');

  const handleArticleClick = (id) => {
    navigate(`/article/${id}`);
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Highlight' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

          {/* Blog Posts Grid */}
          <div className={cn(
            "blog-posts-grid",
            "grid grid-cols-1 md:grid-cols-2 gap-8",
            "mt-8"
          )}>
            {filteredPosts.map((post) => (
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
        </div>
      </div>
    </section>
  );
};

export default ArticleSection; 