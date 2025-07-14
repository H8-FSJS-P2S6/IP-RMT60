import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Award, 
  Target, 
  Shield, 
  BookOpen,
  CheckCircle, 
  Download, 
  Share2, 
  Heart,
  ChevronDown,
  ChevronRight,
  Globe,
  Monitor,
  Smartphone,
  MessageCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  ArrowRight,
  Lock,
  PlayCircle
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const NDTCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRes = await api.get(`/public/lectures/${id}`);
        setCourse(courseRes.data);

        if (isAuthenticated) {
          try {
            const lessonsRes = await api.get(`/lessons/lecture/${id}`);
            setHasPurchased(lessonsRes.data.hasPurchased);
          } catch {
            console.log('User not enrolled or lessons not available');
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/cart`, {
        lectureId: parseInt(id),
        quantity: 1
      });
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const mockCourseModules = [
    {
      title: "Introduction to NDT Fundamentals",
      duration: "2 hours",
      lessons: [
        { title: "What is Non-Destructive Testing?", duration: "15 min", preview: true },
        { title: "NDT Methods Overview", duration: "25 min", preview: false },
        { title: "Industry Applications", duration: "20 min", preview: false },
        { title: "Safety Protocols", duration: "30 min", preview: false }
      ]
    },
    {
      title: "Equipment and Preparation",
      duration: "3 hours",
      lessons: [
        { title: "Equipment Setup", duration: "45 min", preview: false },
        { title: "Material Preparation", duration: "35 min", preview: false },
        { title: "Calibration Procedures", duration: "40 min", preview: false },
        { title: "Quality Control", duration: "20 min", preview: false }
      ]
    },
    {
      title: "Testing Procedures",
      duration: "4 hours",
      lessons: [
        { title: "Standard Testing Methods", duration: "60 min", preview: false },
        { title: "Advanced Techniques", duration: "45 min", preview: false },
        { title: "Data Collection", duration: "35 min", preview: false },
        { title: "Result Interpretation", duration: "40 min", preview: false }
      ]
    },
    {
      title: "Certification Preparation",
      duration: "2 hours",
      lessons: [
        { title: "Exam Guidelines", duration: "30 min", preview: false },
        { title: "Practice Tests", duration: "45 min", preview: false },
        { title: "Final Assessment", duration: "45 min", preview: false }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Course Details...</p>
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
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/categories')}
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
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Course Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                  getDifficultyColor(course.level)
                }`}>
                  {course.level || 'Professional Level'}
                </span>
                <span className="text-blue-300">NDT Training</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold">{course.rating || 4.9}</span>
                  <span className="text-blue-200">({course.reviews || 2847} reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-300" />
                  <span>{course.students || '12,543'} students enrolled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-300" />
                  <span>{course.duration || '11'} hours of content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-300" />
                  <span>Certificate included</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="/api/placeholder/48/48"
                    alt="Instructor"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">Dr. Michael Johnson</h4>
                    <p className="text-blue-200 text-sm">
                      Senior NDT Engineer • 15+ years experience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Video Preview & Enrollment */}
            <div className="space-y-6">
              {/* Video Preview */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gray-900 relative">
                  <img
                    src={course.imgUrl || '/api/placeholder/640/360'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-full p-6 transition-all duration-300 group">
                      <Play className="h-16 w-16 text-white group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    Preview Available
                  </div>
                </div>

                {/* Enrollment Card */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        ${course.price}
                      </div>
                      <div className="text-gray-500 text-sm">
                        <span className="line-through">${(course.price * 1.5).toFixed(0)}</span>
                        <span className="text-green-600 font-medium ml-2">33% off</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-600 font-semibold text-sm">
                        🔥 Limited Time
                      </div>
                      <div className="text-gray-500 text-xs">
                        Offer ends in 2 days
                      </div>
                    </div>
                  </div>

                  {hasPurchased ? (
                    <button
                      onClick={() => navigate(`/course/${course.id}/learn`)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <PlayCircle className="h-6 w-6" />
                      <span>Continue Learning</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleEnroll}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                      <button className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                        Add to Wishlist
                      </button>
                    </div>
                  )}

                  {/* Quick Features */}
                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Lifetime access to course materials</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Industry-recognized certification</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>24/7 expert support</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="flex items-center justify-center space-x-4">
                <button className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span>Share Course</span>
                </button>
                <button className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>Save for Later</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg p-2">
              <div className="flex space-x-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BookOpen },
                  { id: 'curriculum', label: 'Curriculum', icon: Target },
                  { id: 'instructor', label: 'Instructor', icon: Users },
                  { id: 'reviews', label: 'Reviews', icon: Star }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Master fundamental NDT principles and methodologies",
                        "Understand various testing techniques and applications",
                        "Learn industry standards and safety protocols",
                        "Gain hands-on experience with professional equipment",
                        "Prepare for industry certification examinations",
                        "Develop critical defect detection and analysis skills"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Course Requirements</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Basic understanding of materials science (helpful but not required)</li>
                      <li>• High school diploma or equivalent</li>
                      <li>• Access to computer with stable internet connection</li>
                      <li>• Willingness to learn and practice new concepts</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Course Description</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        This comprehensive NDT training course provides in-depth coverage of non-destructive testing 
                        methods used across various industries. You'll learn from industry experts with decades of 
                        real-world experience and gain the practical skills needed to excel in quality assurance 
                        and materials testing roles.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        The course combines theoretical knowledge with practical applications, ensuring you understand 
                        not just the "how" but also the "why" behind each testing method. By the end of this course, 
                        you'll be prepared to take industry certification exams and contribute effectively to NDT 
                        operations in your organization.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                    <div className="text-gray-600">
                      {mockCourseModules.length} modules • 11 hours total
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockCourseModules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleModule(moduleIndex)}
                          className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`transform transition-transform ${
                                expandedModules[moduleIndex] ? 'rotate-90' : 'rotate-0'
                              }`}>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  Module {moduleIndex + 1}: {module.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                  <span>{module.lessons.length} lessons</span>
                                  <span>•</span>
                                  <span>{module.duration}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>

                        {expandedModules[moduleIndex] && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-0">
                                <div className="flex items-center space-x-3">
                                  {lesson.preview ? (
                                    <PlayCircle className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <Lock className="h-5 w-5 text-gray-400" />
                                  )}
                                  <span className="text-gray-700">{lesson.title}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                  {lesson.preview && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                      Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'instructor' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900">Meet Your Instructor</h2>
                  
                  <div className="flex items-start space-x-6">
                    <img
                      src="/api/placeholder/120/120"
                      alt="Dr. Michael Johnson"
                      className="w-30 h-30 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Michael Johnson</h3>
                      <p className="text-blue-600 font-medium mb-4">Senior NDT Engineer & Certified Instructor</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">15+</div>
                          <div className="text-sm text-gray-600">Years Experience</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">50k+</div>
                          <div className="text-sm text-gray-600">Students Taught</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">4.9</div>
                          <div className="text-sm text-gray-600">Instructor Rating</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">12</div>
                          <div className="text-sm text-gray-600">Courses</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        Dr. Johnson is a leading expert in non-destructive testing with over 15 years of industry 
                        experience. He holds advanced certifications in multiple NDT methods and has worked with 
                        major aerospace, automotive, and energy companies. His passion for teaching has helped 
                        thousands of professionals advance their careers in quality assurance and materials testing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="font-semibold">{course.rating || 4.9}</span>
                      <span className="text-gray-500">({course.reviews || 2847} reviews)</span>
                    </div>
                  </div>

                  {/* Review Distribution */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map(rating => (
                        <div key={rating} className="flex items-center space-x-3">
                          <span className="text-sm font-medium w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-yellow-400 h-3 rounded-full"
                              style={{ width: `${rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 4 : rating === 2 ? 2 : 1}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-12">
                            {rating === 5 ? '78%' : rating === 4 ? '15%' : rating === 3 ? '4%' : rating === 2 ? '2%' : '1%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {[
                      {
                        name: "Sarah Chen",
                        rating: 5,
                        date: "2 weeks ago",
                        title: "Excellent comprehensive course",
                        content: "This course exceeded my expectations. The content is well-structured and the instructor explains complex concepts clearly. I feel confident about taking my certification exam now."
                      },
                      {
                        name: "Mark Rodriguez",
                        rating: 5,
                        date: "1 month ago",
                        title: "Perfect for career advancement",
                        content: "As someone with 5 years in manufacturing, this course filled important knowledge gaps. The practical examples and real-world applications made all the difference."
                      },
                      {
                        name: "Lisa Thompson",
                        rating: 4,
                        date: "6 weeks ago",
                        title: "Very informative and detailed",
                        content: "Great course overall. The only minor issue was that some videos could have been shorter, but the content quality is top-notch."
                      }
                    ].map((review, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={`/api/placeholder/40/40`}
                              alt={review.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{review.name}</h4>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Course Info & Features */}
          <div className="space-y-6">
            {/* Course Features */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">This course includes:</h3>
              <div className="space-y-3">
                {[
                  { icon: Clock, text: "11 hours of video content" },
                  { icon: Download, text: "Downloadable resources" },
                  { icon: Globe, text: "Access on all devices" },
                  { icon: Award, text: "Certificate of completion" },
                  { icon: MessageCircle, text: "Q&A support" },
                  { icon: TrendingUp, text: "Lifetime access" }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related Courses */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Related Courses</h3>
              <div className="space-y-4">
                {[
                  { title: "Advanced Ultrasonic Testing", price: 199, rating: 4.8 },
                  { title: "Radiographic Interpretation", price: 249, rating: 4.9 },
                  { title: "Magnetic Particle Testing", price: 179, rating: 4.7 }
                ].map((course, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                    <img
                      src={`/api/placeholder/60/60`}
                      alt={course.title}
                      className="w-15 h-15 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{course.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-xs text-gray-500">{course.rating}</span>
                        </div>
                        <span className="text-sm font-bold text-blue-600">${course.price}</span>
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
};

export default NDTCourseDetail;
