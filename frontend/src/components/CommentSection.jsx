import React, { useState } from 'react';
import AlertDialog from './ui/AlertDialog';
import { toast } from 'sonner';

// Hardcoded comments data
const INITIAL_COMMENTS = [
  {
    id: 1,
    author: "Jacob Lash",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jacob",
    date: "12 September 2024 at 18:30",
    content: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting."
  },
  {
    id: 2,
    author: "Ahri",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahri",
    date: "12 September 2024 at 18:30",
    content: "Such a great read! I've always wondered why my cat slow blinks at me—now I know it's her way of showing trust!"
  },
  {
    id: 3,
    author: "Mimi mama",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi",
    date: "12 September 2024 at 18:30",
    content: "This article perfectly captures why cats make such amazing pets. I had no idea their purring could help with healing. Fascinating stuff!"
  }
];

function CommentSection() {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const isLoggedIn = false; // TODO: Replace with actual auth state

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsAlertOpen(true);
      return;
    }
    
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      author: "Guest User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
      date: new Date().toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }),
      content: newComment.trim()
    };

    setComments([...comments, comment]);
    setNewComment('');
    
    toast.success('Comment posted!', {
      description: 'Your comment has been added successfully.',
    });
  };

  return (
    <div className="mt-8">
      {/* Comment Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-left">Comment</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full h-[102px] pt-3 pr-1 pb-1 pl-4 border border-[#DAD6D1] rounded-[8px] mb-4 resize-none focus:outline-none bg-white"
            style={{ 
              padding: '12px 4px 4px 16px'
            }}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#26231E] text-white px-10 py-3 rounded-full hover:bg-gray-800 w-[121px] h-[48px]"
              style={{ 
                padding: '12px 40px',
                borderRadius: '999px'
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6 divide-y divide-gray-200">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-4 pt-6 pb-6 first:pt-0">
            <div className="flex-shrink-0">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col text-left">
                <h4 className="font-medium text-gray-900">{comment.author}</h4>
                <span className="text-sm text-gray-500 mb-2">{comment.date}</span>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Dialog */}
      <AlertDialog 
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
    </div>
  );
}

export default CommentSection; 