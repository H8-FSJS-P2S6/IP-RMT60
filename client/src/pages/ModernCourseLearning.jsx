import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCourseContent } from "../utils/courseAccess";
import { useAuth } from "../hooks/useAuth";
import VideoPlayerModern from "../components/VideoPlayerModern";
import { 
  Play, 
  Pause,
  SkipBack,
  SkipForward,
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ArrowLeft,
  Menu,
  X,
  Download,
  MessageCircle,
  Star,
  Settings,
  Maximize,
  Volume2,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  Lock,
  AlertCircle
} from "lucide-react";

export default function ModernCourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch course content with access check
  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ['courseContent', id],
    queryFn: () => getCourseContent(id),
    enabled: isAuthenticated && !!id,
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg font-mono">Loading Course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lock className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2 font-mono">Access Denied</h2>
          <p className="text-slate-400 mb-6">
            {error.response?.data?.message || 'You need to purchase this course to access the content.'}
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate(`/courses/${id}`)}
              className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg text-white font-medium"
            >
              View Course Details
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg text-white font-medium"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const course = courseData?.lecture;

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2 font-mono">Course Not Found</h2>
          <p className="text-slate-400 mb-4">The requested course could not be found.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg text-white font-medium"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-slate-800 overflow-hidden flex-shrink-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white font-mono">Course Content</h3>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-white font-medium">Introduction</span>
              </div>
              <p className="text-slate-400 text-sm">Welcome to the course</p>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4 border-l-4 border-orange-600">
              <div className="flex items-center mb-2">
                <Play className="h-5 w-5 text-orange-400 mr-2" />
                <span className="text-white font-medium">Main Content</span>
              </div>
              <p className="text-slate-400 text-sm">{course.description}</p>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Circle className="h-5 w-5 text-slate-400 mr-2" />
                <span className="text-slate-400 font-medium">Assignment</span>
              </div>
              <p className="text-slate-400 text-sm">Complete the exercises</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-slate-400 hover:text-white mr-4"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => navigate(`/courses/${id}`)}
                className="text-slate-400 hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white font-mono">{course.name}</h1>
                <p className="text-slate-400 text-sm">Learning Mode</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </button>
              <button className="text-slate-400 hover:text-white">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 flex items-center justify-center bg-black">
          <div className="w-full max-w-6xl">
            <VideoPlayerModern 
              src={course.videoUrl}
              title={course.name}
              className="w-full aspect-video"
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="bg-slate-800 p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-slate-400 hover:text-white">
                <SkipBack className="h-5 w-5 mr-2" />
                Previous
              </button>
              <button className="flex items-center text-slate-400 hover:text-white">
                <SkipForward className="h-5 w-5 mr-2" />
                Next
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-slate-400">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">45:30</span>
              </div>
              <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-white font-medium">
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
