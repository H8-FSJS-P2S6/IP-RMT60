import { useState, useEffect } from 'react';
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Clock, 
  Eye,
  BookOpen,
  BarChart3,
  Award,
  Users,
  Star,
  Target,
  FileText,
  Download,
  Bookmark,
  AlertTriangle
} from 'lucide-react';
import api from '../utils/api';

const NDTCourseCurriculum = ({ lectureId, onLessonSelect, selectedLessonId, className = "" }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [progress, setProgress] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set(['lessons']));
  const [courseInfo, setCourseInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lessons
        const { data: lessonData } = await api.get(`/lessons/lecture/${lectureId}`);
        setLessons(lessonData.data);
        setHasPurchased(lessonData.hasPurchased);

        // Fetch course info
        const { data: courseData } = await api.get(`/public/lectures/${lectureId}`);
        setCourseInfo(courseData);

        // Fetch progress if authenticated
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const { data: progressData } = await api.get(`/lessons/progress/${lectureId}`);
            setProgress(progressData.data);
          }
        } catch {
          console.log('No progress found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lectureId]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTotalDuration = () => {
    return lessons.reduce((total, lesson) => total + lesson.duration, 0);
  };

  const getCompletedLessons = () => {
    if (!progress) return 0;
    return progress.completedLessons ? progress.completedLessons.length : 0;
  };

  const isLessonCompleted = (lessonId) => {
    if (!progress) return false;
    return progress.completedLessons && progress.completedLessons.includes(lessonId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 ${className}`}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">NDT Course Curriculum</h3>
              <p className="text-slate-300 text-sm">Non-Destructive Testing Training</p>
            </div>
          </div>
          
          {hasPurchased && (
            <div className="bg-green-500 px-4 py-2 rounded-full flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span className="font-semibold text-sm">Enrolled</span>
            </div>
          )}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{lessons.length}</div>
            <div className="text-slate-300 text-sm">Modules</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{formatDuration(getTotalDuration())}</div>
            <div className="text-slate-300 text-sm">Duration</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {getCompletedLessons()}/{lessons.length}
            </div>
            <div className="text-slate-300 text-sm">Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {courseInfo?.difficulty || 'Professional'}
            </div>
            <div className="text-slate-300 text-sm">Level</div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        {progress && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between text-sm mb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="font-medium">Learning Progress</span>
              </div>
              <span className="font-bold">{Math.round(progress.progressPercentage)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${progress.progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-8">
        {/* Section Header */}
        <button
          onClick={() => toggleSection('lessons')}
          className="flex items-center justify-between w-full text-left mb-6 group hover:bg-gray-50 p-4 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">Training Modules</span>
              <p className="text-gray-500 text-sm">Structured NDT learning path</p>
            </div>
          </div>
          <div className={`transform transition-transform duration-200 ${
            expandedSections.has('lessons') ? 'rotate-180' : ''
          }`}>
            <div className="bg-gray-100 p-2 rounded-lg">
              ▼
            </div>
          </div>
        </button>

        {/* Lessons List */}
        {expandedSections.has('lessons') && (
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id);
              const isSelected = selectedLessonId === lesson.id;
              const canPlay = hasPurchased || lesson.isPreview;

              return (
                <div
                  key={lesson.id}
                  className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${!canPlay ? 'opacity-70' : ''}`}
                  onClick={() => canPlay && onLessonSelect(lesson)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 relative">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-100 text-green-600' 
                          : !canPlay 
                            ? 'bg-gray-100 text-gray-400'
                            : lesson.isPreview
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-7 w-7" />
                        ) : !canPlay ? (
                          <Lock className="h-7 w-7" />
                        ) : lesson.isPreview ? (
                          <Eye className="h-7 w-7" />
                        ) : (
                          <Play className="h-7 w-7" />
                        )}
                      </div>
                      
                      {/* Module Number */}
                      <div className="absolute -top-2 -right-2 bg-slate-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    {/* Lesson Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className={`font-bold text-lg truncate ${
                              isSelected ? 'text-blue-700' : 'text-gray-900'
                            }`}>
                              {lesson.title}
                            </h4>
                            
                            {/* Badges */}
                            <div className="flex items-center space-x-2">
                              {lesson.isPreview && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Preview
                                </span>
                              )}
                              
                              {lesson.difficulty && (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(lesson.difficulty)}`}>
                                  {lesson.difficulty}
                                </span>
                              )}

                              {isCompleted && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {lesson.description && (
                            <p className="text-gray-600 mb-3 leading-relaxed">
                              {lesson.description}
                            </p>
                          )}
                          
                          {/* Lesson Meta */}
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">{formatDuration(lesson.duration)}</span>
                            </div>
                            
                            {lesson.hasQuiz && (
                              <div className="flex items-center space-x-2 text-orange-600">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-medium">Quiz Included</span>
                              </div>
                            )}
                            
                            {lesson.hasResources && (
                              <div className="flex items-center space-x-2 text-purple-600">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium">Resources</span>
                              </div>
                            )}
                          </div>

                          {/* Lock Notice */}
                          {!canPlay && (
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                              <div className="flex items-center space-x-2 text-amber-800">
                                <Lock className="h-4 w-4" />
                                <span className="font-medium text-sm">Professional Access Required</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        {canPlay && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onLessonSelect(lesson);
                            }}
                            className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <Play className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enrollment CTA */}
        {!hasPurchased && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Unlock Professional NDT Training
              </h4>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Get full access to all training modules, quizzes, certification materials, and expert support.
              </p>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Expert Instructors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Industry Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Downloadable Resources</span>
                </div>
              </div>

              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Enroll Now - Start Learning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NDTCourseCurriculum;
