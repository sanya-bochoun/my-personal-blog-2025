const API_BASE_URL = import.meta.env.PROD
  ? 'https://my-personal-blog-2025-v2-c5jm456sb-sanya-bochouns-projects.vercel.app/api'
  : 'http://localhost:5000/api';

export const config = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default config; 