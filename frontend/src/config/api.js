const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://my-personal-blog-2025-v2-29qx17ikd-sanya-bochouns-projects.vercel.app/api'
  : 'http://localhost:5000/api';

export default API_BASE_URL; 