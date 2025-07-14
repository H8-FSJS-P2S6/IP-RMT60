import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { 
  fetchLectureById, 
  selectCurrentLecture, 
  selectLecturesLoading,
  selectLecturesError 
} from "../store/slices/lecturesSlice";
import { selectUser, selectIsAuthenticated } from "../store/slices/authSlice";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Shield, 
  Award,
  CheckCircle,
  ArrowLeft,
  Target,
  Download,
  Share2,
  Heart,
  MessageCircle,
  TrendingUp,
  Calendar,
  User,
  DollarSign
} from "lucide-react";

export default function ModernCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const lecture = useAppSelector(selectCurrentLecture);
  const loading = useAppSelector(selectLecturesLoading);
  const error = useAppSelector(selectLecturesError);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchLectureById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Check if user is enrolled in this course
    // This would typically come from the API
    setIsEnrolled(false);
  }, [user, lecture]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    // Handle enrollment logic
    navigate(`/courses/${id}/learn`);
  };

  const handleStartLearning = () => {
    navigate(`/courses/${id}/learn`);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "reviews", label: "Reviews" },
    { id: "instructor", label: "Instructor" }
  ];

  const features = [
    {
      icon: Clock,
      title: "Self-paced Learning",
      description: "Learn at your own speed"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Industry-recognized certificate"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Access to professional instructors"
    },
    {
      icon: Download,
      title: "Offline Access",
      description: "Download materials for offline study"
    }
  ];

  const stats = [
    { label: "Students Enrolled", value: "2,847", icon: Users },
    { label: "Course Rating", value: "4.9", icon: Star },
    { label: "Completion Rate", value: "94%", icon: TrendingUp },
    { label: "Last Updated", value: "Nov 2024", icon: Calendar }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate("/courses")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <button 
            onClick={() => navigate("/courses")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-blue-200 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-white">{lecture.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {lecture.Category?.name || "NDT Course"}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.9 (847 reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold mb-4">{lecture.title}</h1>
                <p className="text-xl text-blue-100 mb-6">{lecture.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>12 hours total</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>24 lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>2,847 students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Beginner Level</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                {isEnrolled ? (
                  <button
                    onClick={handleStartLearning}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    <span>Continue Learning</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    <span>Enroll Now</span>
                  </button>
                )}
                
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>Add to Wishlist</span>
                </button>
                
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Course Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <div className="aspect-video bg-gray-100 rounded-xl mb-6 relative overflow-hidden">
                  {lecture.imageUrl ? (
                    <img 
                      src={lecture.imageUrl} 
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                      <Target className="h-16 w-16 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button className="bg-white/90 hover:bg-white text-blue-600 w-16 h-16 rounded-full flex items-center justify-center transition-colors">
                      <Play className="h-6 w-6 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {lecture.price === 0 ? 'Free' : `$${lecture.price}`}
                  </div>
                  {lecture.price > 0 && (
                    <div className="text-gray-500 line-through">
                      ${Math.round(lecture.price * 1.3)}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Icon className="h-4 w-4" />
                          <span>{stat.label}</span>
                        </div>
                        <span className="font-medium text-gray-900">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Mobile and TV access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8 py-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Course</h3>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                          {lecture.description || "This comprehensive NDT course covers fundamental principles and advanced techniques used in non-destructive testing. Students will learn theoretical concepts and practical applications essential for professional certification."}
                        </p>
                        <p className="text-gray-600 leading-relaxed mt-4">
                          Our expert-led curriculum combines industry best practices with hands-on learning experiences. You'll master the skills needed to excel in your NDT career and prepare for certification exams.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Fundamental NDT principles and theory",
                          "Industry-standard testing procedures",
                          "Equipment operation and calibration",
                          "Defect identification and evaluation",
                          "Safety protocols and regulations",
                          "Quality assurance practices",
                          "Certification preparation strategies",
                          "Real-world case studies"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Basic understanding of materials science</li>
                        <li>High school diploma or equivalent</li>
                        <li>Access to computer with internet connection</li>
                        <li>Willingness to learn and practice</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Course Curriculum</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Introduction to NDT",
                          lessons: 5,
                          duration: "2 hours",
                          description: "Overview of non-destructive testing methods and applications"
                        },
                        {
                          title: "Visual Testing (VT)",
                          lessons: 4,
                          duration: "1.5 hours",
                          description: "Principles and techniques of visual inspection"
                        },
                        {
                          title: "Ultrasonic Testing (UT)",
                          lessons: 6,
                          duration: "3 hours",
                          description: "Advanced ultrasonic testing methods and equipment"
                        },
                        {
                          title: "Radiographic Testing (RT)",
                          lessons: 5,
                          duration: "2.5 hours",
                          description: "X-ray and gamma ray testing techniques"
                        },
                        {
                          title: "Practical Applications",
                          lessons: 4,
                          duration: "3 hours",
                          description: "Hands-on exercises and real-world scenarios"
                        }
                      ].map((module, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{module.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{module.lessons} lessons</span>
                              <span>{module.duration}</span>
                            </div>
                          </div>
                          <p className="text-gray-600">{module.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">Student Reviews</h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.9</span>
                        <span className="text-gray-500">(847 reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        {
                          name: "Sarah Johnson",
                          role: "NDT Technician",
                          rating: 5,
                          date: "2 weeks ago",
                          comment: "Excellent course! The instructor explains complex concepts clearly and the practical examples are very helpful."
                        },
                        {
                          name: "Mike Chen",
                          role: "Quality Engineer",
                          rating: 5,
                          date: "1 month ago",
                          comment: "This course helped me prepare for my Level II certification. Highly recommended for anyone in the NDT field."
                        },
                        {
                          name: "Jennifer Davis",
                          role: "Materials Engineer",
                          rating: 4,
                          date: "2 months ago",
                          comment: "Great content and well-organized curriculum. The video quality could be improved but overall very satisfied."
                        }
                      ].map((review, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">{review.name}</h5>
                                <p className="text-sm text-gray-500">{review.role}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < review.rating 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "instructor" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Instructor</h3>
                    <div className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start space-x-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">Dr. Robert Anderson</h4>
                          <p className="text-blue-600 font-medium mb-4">Senior NDT Consultant & ASNT Level III</p>
                          <div className="prose prose-gray max-w-none">
                            <p className="text-gray-600 leading-relaxed">
                              Dr. Anderson brings over 20 years of experience in non-destructive testing and materials engineering. 
                              He holds ASNT Level III certifications in multiple NDT methods and has worked with leading aerospace 
                              and manufacturing companies worldwide.
                            </p>
                            <p className="text-gray-600 leading-relaxed mt-4">
                              As a published researcher and industry consultant, Dr. Anderson combines theoretical knowledge 
                              with practical experience to deliver comprehensive training that prepares students for real-world challenges.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">20+</div>
                              <div className="text-sm text-gray-500">Years Experience</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">15K+</div>
                              <div className="text-sm text-gray-500">Students Taught</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">25</div>
                              <div className="text-sm text-gray-500">Courses Created</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">4.9</div>
                              <div className="text-sm text-gray-500">Average Rating</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Course Features */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Features</h3>
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related Courses */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Courses</h3>
              <div className="space-y-4">
                {[
                  { title: "Advanced Ultrasonic Testing", price: "$199", rating: "4.8" },
                  { title: "Radiographic Testing Fundamentals", price: "$149", rating: "4.9" },
                  { title: "Magnetic Particle Testing", price: "$129", rating: "4.7" }
                ].map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{course.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-semibold">{course.price}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
