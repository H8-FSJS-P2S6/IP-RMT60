import api from './api';

// Check if user has access to a specific course
export const checkCourseAccess = async (courseId) => {
  try {
    const response = await api.get(`/lectures/content/${courseId}`);
    return {
      hasAccess: true,
      course: response.data.lecture,
      message: response.data.message
    };
  } catch (error) {
    if (error.response?.status === 403) {
      return {
        hasAccess: false,
        message: error.response.data.message || 'Anda belum membeli course ini'
      };
    }
    throw error;
  }
};

// Get user's purchased courses
export const getUserCourses = async () => {
  try {
    const response = await api.get('/lectures/my-courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching user courses:', error);
    throw error;
  }
};

// Get course content for paid users
export const getCourseContent = async (courseId) => {
  try {
    const response = await api.get(`/lectures/content/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course content:', error);
    throw error;
  }
};
