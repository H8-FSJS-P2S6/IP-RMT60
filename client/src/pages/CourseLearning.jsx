import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, BookOpen, Users, Star, Clock } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import CourseCurriculum from '../components/CourseCurriculum';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price);
};

const CourseLearning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchCourseDetails = async () => {
      try {
        const { data } = await api.get(`/public/lectures/${id}`);
        setCourse(data);
        
        // Check if user has purchased this course
        const purchaseCheck = await api.get(`/lessons/lecture/${id}`);
        setHasPurchased(purchaseCheck.data.hasPurchased);
        
        // If user hasn't purchased, redirect to course detail
        if (!purchaseCheck.data.hasPurchased) {
          navigate(`/courses/${id}`);
          return;
        }
        
        // Set first lesson as default if no current lesson
        if (purchaseCheck.data.data.length > 0) {
          setCurrentLesson(purchaseCheck.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, isAuthenticated, navigate]);

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handleVideoProgress = async (currentTime, duration) => {
    if (!currentLesson || !hasPurchased) return;
    
    const isCompleted = currentTime >= duration * 0.9; // 90% watched = completed
    
    try {
      await api.put(`/lessons/${currentLesson.id}/progress`, {
        watchTime: 1, // Increment by 1 second
        isCompleted
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course || !hasPurchased) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to purchase this course to access the content.</p>
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Course Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/courses')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-600">by {course.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.experience_years}+ years exp</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {currentLesson ? (
                <>
                  <VideoPlayer
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    onProgress={handleVideoProgress}
                    className="aspect-video"
                  />
                  
                  {/* Lesson Details */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentLesson.title}
                    </h2>
                    
                    {currentLesson.description && (
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {currentLesson.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{Math.ceil(currentLesson.duration / 60)} minutes</span>
                      </div>
                      <span>•</span>
                      <span>Lesson {currentLesson.order}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a lesson to start learning
                    </h3>
                    <p className="text-gray-600">
                      Choose from the curriculum on the right to begin your journey.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Course</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Technique:</span>
                  <span className="text-gray-600 ml-2">{course.technique}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Price:</span>
                  <span className="text-gray-600 ml-2">{formatToIDR(course.price)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Experience:</span>
                  <span className="text-gray-600 ml-2">{course.experience_years} years</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Availability:</span>
                  <span className={`ml-2 ${
                    course.availability === 'Available' ? 'text-green-600' :
                    course.availability === 'Limited' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {course.availability}
                  </span>
                </div>
              </div>
              
              {course.certifications && course.certifications.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-900">Certifications:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {course.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Curriculum Sidebar */}
          <div className="lg:col-span-1">
            <CourseCurriculum
              lectureId={id}
              onLessonSelect={handleLessonSelect}
              selectedLessonId={currentLesson?.id}
              className="sticky top-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
