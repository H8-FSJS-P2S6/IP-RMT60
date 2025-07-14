import { useState, useEffect } from 'react';
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Clock, 
  Eye,
  BookOpen,
  BarChart3
} from 'lucide-react';
import api from '../utils/api';

const CourseCurriculum = ({ lectureId, onLessonSelect, selectedLessonId, className = "" }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [progress, setProgress] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set(['lessons']));

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await api.get(`/lessons/lecture/${lectureId}`);
        setLessons(data.data);
        setHasPurchased(data.hasPurchased);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await api.get(`/lessons/progress/${lectureId}`);
          setProgress(data.data);
        }
      } catch {
        // User might not be authenticated or no progress yet
        console.log('No progress found');
      }
    };

    fetchLessons();
    fetchProgress();
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
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="h-6 w-6" />
          <h3 className="text-xl font-bold">Course Content</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-lg">{lessons.length}</div>
            <div className="opacity-90">Lessons</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">{formatDuration(getTotalDuration())}</div>
            <div className="opacity-90">Total Duration</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">
              {getCompletedLessons()}/{lessons.length}
            </div>
            <div className="opacity-90">Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progress.progressPercentage)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Lessons List */}
      <div className="p-6">
        <button
          onClick={() => toggleSection('lessons')}
          className="flex items-center justify-between w-full text-left mb-4 hover:text-blue-600 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span className="font-semibold">Lessons</span>
          </div>
          <span className={`transform transition-transform ${expandedSections.has('lessons') ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.has('lessons') && (
          <div className="space-y-3">
            {lessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id);
              const isSelected = selectedLessonId === lesson.id;
              const canPlay = hasPurchased || lesson.isPreview;

              return (
                <div
                  key={lesson.id}
                  className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!canPlay ? 'opacity-60' : ''}`}
                  onClick={() => canPlay && onLessonSelect(lesson)}
                >
                  <div className="flex items-center space-x-3">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : !canPlay ? (
                        <Lock className="h-8 w-8 text-gray-400" />
                      ) : lesson.isPreview ? (
                        <Eye className="h-8 w-8 text-blue-500" />
                      ) : (
                        <Play className="h-8 w-8 text-gray-600" />
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-gray-500 font-medium">
                          {index + 1}.
                        </span>
                        <h4 className={`font-semibold truncate ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                          {lesson.title}
                        </h4>
                        {lesson.isPreview && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Preview
                          </span>
                        )}
                      </div>
                      
                      {lesson.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {lesson.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(lesson.duration)}</span>
                        </div>
                        
                        {!canPlay && (
                          <span className="text-amber-600 font-medium">
                            🔒 Purchase required
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Play Button */}
                    {canPlay && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLessonSelect(lesson);
                        }}
                        className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Purchase Notice */}
        {!hasPurchased && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2 text-amber-800">
              <Lock className="h-5 w-5" />
              <span className="font-medium">Purchase this course to unlock all lessons</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              You can preview some lessons for free. Purchase the full course to access all content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCurriculum;
