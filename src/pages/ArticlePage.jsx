import React from 'react';
import { useParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { cn } from "@/lib/utils";
import { STYLES } from '../constants/styles';

const ArticlePage = () => {
  const { id } = useParams();
  const article = blogPosts.find(post => post.id === parseInt(id));

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <article className={cn("article-page", STYLES.layout.wrapper)}>
      <div className={cn("article-container", `${STYLES.layout.container.mobile} ${STYLES.layout.container.desktop}`)}>
        <div className="article-content w-full px-4 md:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8">
            <div className="category-wrapper flex mb-4">
              <span className={cn(
                "category-tag",
                "bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600"
              )}>
                {article.category}
              </span>
            </div>
            <h1 className={cn(
              "article-title",
              "text-4xl font-bold mb-4"
            )}>
              {article.title}
            </h1>
            <div className="article-meta flex items-center text-sm text-gray-600">
              <span>{article.author}</span>
              <span className="mx-2">•</span>
              <span>{article.date}</span>
              <span className="mx-2">•</span>
              <span>{article.likes} likes</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="article-image-wrapper mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="article-content prose max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticlePage; 