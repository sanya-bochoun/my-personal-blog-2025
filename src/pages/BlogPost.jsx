import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import SocialShareBanner from '@/components/SocialShareBanner';
import CommentSection from '@/components/CommentSection';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://blog-post-project-api.vercel.app/posts/${id}`);
        if (!response.ok) {
          throw new Error('บทความไม่พบ');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">ไม่พบบทความ</h2>
        <p className="text-gray-600">บทความที่คุณกำลังค้นหาอาจถูกลบไปแล้วหรือย้ายไปที่อื่น</p>
      </div>
    );
  }

  return (
    <article className="max-w-[1200px] mx-auto px-4 mt-20 md:mt-35">
      {/* Hero Image */}
      <div className="w-full h-[400px] mb-8 rounded-2xl overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="main-content">
          {/* Category and Date */}
          <div className="flex items-center gap-4 mb-4">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              "bg-green-100 text-green-800"
            )}>
              {post.category}
            </span>
            <time className="text-gray-600">
              {format(new Date(post.date), 'dd MMMM yyyy')}
            </time>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-6 text-gray-900 text-left">{post.title}</h1>

          {/* Description */}
          <p className="text-gray-600 text-lg mb-8 text-left">{post.description}</p>

          {/* Content */}
          <div className="markdown text-left">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                h2: (props) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                p: (props) => <p className="mb-4 text-gray-700" {...props} />,
                ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
                ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                blockquote: (props) => (
                  <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4" {...props} />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Author Info for Mobile */}
          <div className="block lg:hidden mt-8 mb-8">
            <aside className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                    alt={post.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-left">Author</h3>
                  <p className="text-lg font-medium text-gray-800 text-left">{post.author}</p>
                </div>
              </div>
              <div className="prose prose-sm text-left">
                <p className="text-gray-600">
                  I am a pet enthusiast and freelance writer who specializes in animal behavior and care. 
                  With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
                </p>
                <p className="mt-4 text-gray-600">
                  When I'm not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.
                </p>
              </div>
            </aside>
          </div>

          {/* Social Share Banner */}
          <div className="mt-8 mb-8">
            <SocialShareBanner 
              likes={post.likes || 321} 
              url={window.location.href} 
            />
          </div>

          {/* Comments */}
          <CommentSection />
        </div>

        {/* Author Sidebar for Desktop */}
        <aside className="hidden lg:block bg-gray-50 p-6 rounded-xl h-fit sticky top-24">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                alt={post.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 text-left">Author</h3>
              <p className="text-lg font-medium text-gray-800 text-left">{post.author}</p>
            </div>
          </div>
          <div className="prose prose-sm text-left">
            <p className="text-gray-600">
              I am a pet enthusiast and freelance writer who specializes in animal behavior and care. 
              With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
            </p>
            <p className="mt-4 text-gray-600">
              When I'm not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

export default BlogPost; 