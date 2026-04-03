const BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    if (token && response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }

    return { error: true, statusCode: response.status, message: data.message || 'Something went wrong' };
  } catch (err) {
    return { error: true, statusCode: 500, message: err.message || 'Network error' };
  }
};

export default apiClient;
