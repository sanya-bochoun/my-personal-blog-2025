import axios from 'axios';

const BASE_URL = 'https://blog-post-project-api.vercel.app';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchPosts = async ({ page = 1, limit = 6, category = '', keyword = '' }) => {
  try {
    const params = {
      page,
      limit,
      ...(category && { category }),
      ...(keyword && { keyword })
    };

    const response = await api.get('/posts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}; 