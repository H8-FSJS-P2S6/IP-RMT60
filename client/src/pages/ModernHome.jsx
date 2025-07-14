import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  ArrowRight, 
  Play, 
  Users, 
  Award, 
  Target, 
  TrendingUp,
  BookOpen,
  Clock,
  Star,
  Shield,
  CheckCircle,
  Zap
} from "lucide-react";
import api from "../utils/api";

export default function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await api.get("/public/homepage-bundle");
        setHomeData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setError("Failed to load homepage data. Please try again later.");
        setHomeData({
          featuredLectures: [],
          latestLectures: [],
          popularCategories: [],
          statistics: {
            totalLectures: 0,
            totalCategories: 0,
            totalUsers: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <Target className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading NDT Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16"> {/* Account for fixed navbar */}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium">
                  <Shield className="h-4 w-4 mr-2" />
                  Professional NDT Certification
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Master <span className="text-blue-400">Non-Destructive</span> Testing Skills
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl">
                  Advance your career with industry-leading NDT courses. Learn from certified professionals 
                  and gain the expertise that top companies demand.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/courses" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors group"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/categories" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-colors backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5" />
                  <span>Watch Demo</span>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{homeData.statistics.totalLectures}+</div>
                  <div className="text-sm text-gray-400">Expert Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{homeData.statistics.totalUsers}+</div>
                  <div className="text-sm text-gray-400">Professionals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">98%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10 backdrop-blur-sm p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                    <Play className="h-10 w-10 text-white ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Watch Course Preview</h3>
                  <p className="text-gray-300">See what makes our NDT training exceptional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SNS NDT Training?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides everything you need to excel in Non-Destructive Testing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Industry Certified",
                description: "Courses aligned with international NDT standards and certifications"
              },
              {
                icon: Users,
                title: "Expert Instructors",
                description: "Learn from experienced professionals with decades of field experience"
              },
              {
                icon: Target,
                title: "Practical Focus",
                description: "Hands-on training with real-world scenarios and case studies"
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                description: "Boost your earning potential and advance your professional career"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
              <p className="text-xl text-gray-600">Popular NDT training programs chosen by professionals</p>
            </div>
            <Link 
              to="/courses" 
              className="hidden lg:flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
            >
              <span>View All Courses</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeData.featuredLectures.slice(0, 3).map((lecture) => (
              <div key={lecture.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={lecture.image || "https://via.placeholder.com/400x240?text=NDT+Course"}
                    alt={lecture.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {formatToIDR(lecture.price)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium">
                      {lecture.category?.name || "NDT Training"}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium text-gray-600 ml-1">4.9</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {lecture.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {lecture.technique || "Professional NDT training course"}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>8-12 hours</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>2.5k students</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/courses/${lecture.id}`} 
                    className="w-full bg-gray-100 hover:bg-blue-600 text-gray-900 hover:text-white py-3 rounded-xl font-semibold transition-colors text-center block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 lg:hidden">
            <Link 
              to="/courses" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
            >
              <span>View All Courses</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* NDT Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              NDT Testing Methods
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore comprehensive training in all major Non-Destructive Testing techniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeData.popularCategories.map((category, index) => {
              const icons = [Target, Shield, Zap, BookOpen, Award];
              const Icon = icons[index % icons.length];
              
              return (
                <div key={category.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.name}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {category.description || "Comprehensive training in this NDT method with practical applications and industry standards."}
                  </p>
                  
                  <Link 
                    to={`/categories/${category.id}`} 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
                  >
                    <span>Explore Courses</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Courses
            </h2>
            <p className="text-xl text-gray-600">
              Recently added courses to expand your NDT expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeData.latestLectures.slice(0, 3).map((lecture) => (
              <div key={lecture.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={lecture.image || "https://via.placeholder.com/400x240?text=Latest+NDT+Course"}
                    alt={lecture.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      New
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium">
                      {lecture.category?.name || "NDT Training"}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatToIDR(lecture.price)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {lecture.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {lecture.technique || "Latest NDT training methodology"}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      <span>Updated</span>
                    </div>
                    <Link 
                      to={`/courses/${lecture.id}`} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Advance Your NDT Career?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who have elevated their expertise with our comprehensive NDT training programs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <span>Start Learning Today</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/courses" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-colors"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              <span>Browse All Courses</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
