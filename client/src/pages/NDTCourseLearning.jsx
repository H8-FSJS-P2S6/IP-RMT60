import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Star, 
  Clock,
  Award,
  Target,
  Shield,
  FileText,
  Download,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  ChevronRight,
  Play,
  CheckCircle
} from 'lucide-react';
import VideoPlayerModern from '../components/VideoPlayerModern';
import NDTCourseCurriculum from '../components/NDTCourseCurriculum';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const NDTCourseLearning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

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
        
        // Set first lesson as default if purchased
        if (purchaseCheck.data.hasPurchased && purchaseCheck.data.data.length > 0) {
          setCurrentLesson(purchaseCheck.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, isAuthenticated, navigate]);

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handleVideoProgress = (currentTime, duration) => {
    // Track video progress
    if (currentLesson && duration > 0) {
      const progressPercent = (currentTime / duration) * 100;
      if (progressPercent > 90) {
        // Mark lesson as completed
        markLessonComplete(currentLesson.id);
      }
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      await api.put(`/lessons/${lessonId}/progress`, {
        completed: true,
        progress: 100
      });
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const saveNotes = async () => {
    try {
      await api.post(`/lessons/${currentLesson.id}/notes`, {
        content: notes,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading NDT Training Platform...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The NDT course you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back button and course info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-lg truncate max-w-md">
                    {course.title}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>NDT Training</span>
                    <span>•</span>
                    <span>{course.instructor || 'Professional Instructor'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              {hasPurchased && (
                <>
                  <button 
                    onClick={() => setShowNotes(!showNotes)}
                    className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <Bookmark className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </>
              )}
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {currentLesson ? (
                <VideoPlayerModern
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  description={currentLesson.description}
                  onProgress={handleVideoProgress}
                  onComplete={() => markLessonComplete(currentLesson.id)}
                  chapters={currentLesson.chapters || []}
                  className="aspect-video"
                />
              ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Select a Lesson to Start</h3>
                    <p className="text-gray-400">Choose from the curriculum to begin your NDT training</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            {currentLesson && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentLesson.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {currentLesson.description}
                    </p>
                  </div>
                  <div className="ml-4 bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-blue-800 text-sm font-medium">
                      Module {currentLesson.order || 1}
                    </span>
                  </div>
                </div>

                {/* Lesson Meta */}
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(currentLesson.duration / 60)} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Professional Level</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Industry Standard</span>
                  </div>
                </div>

                {/* Learning Objectives */}
                {currentLesson.objectives && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {currentLesson.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Notes Section */}
            {showNotes && hasPurchased && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">My Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes about this lesson..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={saveNotes}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Course Curriculum */}
          <div className="space-y-6">
            {/* Course Overview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Course Overview</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{course.rating || 4.8}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{course.students || '2.5k'}</div>
                  <div className="text-sm text-gray-500">Students</div>
                </div>
              </div>

              {hasPurchased && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Award className="h-5 w-5" />
                    <span className="font-medium">You're Enrolled!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Full access to all materials and certification
                  </p>
                </div>
              )}
            </div>

            {/* Curriculum */}
            <NDTCourseCurriculum
              lectureId={id}
              onLessonSelect={handleLessonSelect}
              selectedLessonId={currentLesson?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NDTCourseLearning;
