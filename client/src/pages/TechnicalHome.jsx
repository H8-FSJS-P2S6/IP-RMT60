import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  HardHat,
  Wrench,
  Monitor,
  Gauge,
  Zap,
  Activity,
  BarChart3,
  Calendar,
  Download,
  ExternalLink
} from "lucide-react";
import api from "../utils/api";
import { Button } from "@/components/ui/Button";

const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price);
};

const fetchHomeData = async () => {
  const { data } = await api.get('/public/homepage-bundle');
  return data;
};

export default function TechnicalHome() {
  const { data: homeData, isLoading, error } = useQuery({ 
    queryKey: ['homeData'], 
    queryFn: fetchHomeData,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-mono">Initializing NDT Platform...</p>
        </div>
      </div>
    );
  }

  // Fallback data if API fails
  const fallbackData = {
    featuredLectures: [
      {
        id: 1,
        title: "Ultrasonic Testing Fundamentals",
        description: "Master the basics of ultrasonic non-destructive testing",
        instructor: "Dr. John Smith",
        duration: "8 hours",
        level: "Beginner",
        price: 299,
        image: "/api/placeholder/400/300"
      },
      {
        id: 2,
        title: "Radiographic Testing Advanced",
        description: "Advanced techniques in radiographic inspection",
        instructor: "Prof. Sarah Johnson", 
        duration: "12 hours",
        level: "Advanced",
        price: 449,
        image: "/api/placeholder/400/300"
      },
      {
        id: 3,
        title: "Magnetic Particle Testing",
        description: "Comprehensive guide to magnetic particle inspection",
        instructor: "Mike Chen",
        duration: "6 hours", 
        level: "Intermediate",
        price: 199,
        image: "/api/placeholder/400/300"
      }
    ],
    statistics: {
      totalLectures: 25,
      totalUsers: 1240,
      completionRate: 92,
      certifications: 890
    }
  };

  const displayData = homeData || fallbackData;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Technical Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Technical Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 48 }, (_, i) => (
              <div key={i} className="border-r border-slate-700"></div>
            ))}
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Status Indicator */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-mono text-sm">Training Systems Online</span>
                </div>
                <div className="text-slate-400 font-mono text-sm">v2.1.0</div>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    NDT Pro
                  </span>
                  <br />
                  <span className="font-mono text-3xl md:text-4xl">
                    Technical Training
                  </span>
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                  Advanced Non-Destructive Testing education platform for technicians, engineers, 
                  and quality control specialists. Master industry-standard testing methods with 
                  hands-on training and professional certification.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button size="lg" className="w-full sm:w-auto">
                    <HardHat className="mr-3 h-6 w-6" />
                    <span className="font-mono">Start Training</span>
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link to="/categories">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Target className="mr-3 h-6 w-6" />
                    <span className="font-mono">Browse Methods</span>
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 font-mono">
                    {displayData?.statistics?.totalLectures || fallbackData.statistics.totalLectures}+
                  </div>
                  <div className="text-slate-400 text-sm font-mono">Training Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 font-mono">
                    {displayData?.statistics?.totalUsers || fallbackData.statistics.totalUsers}+
                  </div>
                  <div className="text-slate-400 text-sm font-mono">Certified Techs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 font-mono">98%</div>
                  <div className="text-slate-400 text-sm font-mono">Pass Rate</div>
                </div>
              </div>
            </div>

            {/* Technical Dashboard Preview */}
            <div className="relative">
              {/* Main Dashboard */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Monitor className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold font-mono">Training Dashboard</div>
                      <div className="text-slate-400 text-sm font-mono">Live Session</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-mono">Online</span>
                  </div>
                </div>

                {/* Progress Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm font-mono">UT Progress</span>
                      <Gauge className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">87%</div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm font-mono">RT Level</span>
                      <Activity className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">Level II</div>
                    <div className="text-green-400 text-sm font-mono mt-1">Certified</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-3">
                  <div className="text-slate-300 font-semibold font-mono text-sm">Recent Activity</div>
                  {[
                    { method: "UT", activity: "Completed Module 3", time: "2h ago", status: "complete" },
                    { method: "RT", activity: "Safety Assessment", time: "1d ago", status: "complete" },
                    { method: "MT", activity: "In Progress", time: "Active", status: "active" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg border border-slate-600">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'complete' ? 'bg-green-500' : 
                        item.status === 'active' ? 'bg-orange-500' : 'bg-slate-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-mono">{item.method} - {item.activity}</div>
                        <div className="text-slate-400 text-xs font-mono">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-green-500 rounded-xl p-4 shadow-lg border border-green-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span className="text-white font-mono text-sm">Level II Cert</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-blue-500 rounded-xl p-4 shadow-lg border border-blue-400">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-white" />
                  <span className="text-white font-mono text-sm">95% Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              <span className="font-mono">Professional Training</span> Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Industry-leading technical education platform designed for NDT professionals 
              and quality control specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Industry Certified",
                description: "ASNT SNT-TC-1A and ISO 9712 compliant training programs with official certifications"
              },
              {
                icon: Wrench,
                title: "Hands-On Training",
                description: "Interactive simulations and real-world case studies from actual field operations"
              },
              {
                icon: Target,
                title: "Method Mastery",
                description: "Comprehensive coverage of all major NDT methods: UT, RT, MT, PT, and ET"
              },
              {
                icon: Award,
                title: "Expert Instructors",
                description: "Learn from Level III certified professionals with decades of industry experience"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:bg-slate-100 transition-colors group border border-slate-200">
                  <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                    <Icon className="h-8 w-8 text-orange-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 font-mono">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NDT Methods Grid */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="font-mono">NDT Testing</span> Methods
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Master the five primary non-destructive testing methods used across industries worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                code: "UT",
                name: "Ultrasonic Testing",
                icon: Zap,
                description: "High-frequency sound waves for internal flaw detection",
                applications: ["Weld inspection", "Thickness measurement", "Corrosion mapping"],
                color: "from-blue-500 to-blue-600"
              },
              {
                code: "RT",
                name: "Radiographic Testing",
                icon: Activity,
                description: "X-rays and gamma rays for internal structure analysis",
                applications: ["Pipeline inspection", "Casting evaluation", "Aerospace components"],
                color: "from-green-500 to-green-600"
              },
              {
                code: "MT",
                name: "Magnetic Particle",
                icon: Target,
                description: "Magnetic fields to detect surface and near-surface flaws",
                applications: ["Forged components", "Steel structures", "Automotive parts"],
                color: "from-purple-500 to-purple-600"
              },
              {
                code: "PT",
                name: "Penetrant Testing",
                icon: BookOpen,
                description: "Liquid penetrants for surface-breaking discontinuities",
                applications: ["Welds", "Forgings", "Non-magnetic materials"],
                color: "from-red-500 to-red-600"
              },
              {
                code: "ET",
                name: "Eddy Current",
                icon: Gauge,
                description: "Electromagnetic induction for conductive materials",
                applications: ["Tube inspection", "Heat exchanger", "Aircraft structures"],
                color: "from-yellow-500 to-yellow-600"
              },
              {
                code: "VT",
                name: "Visual Testing",
                icon: Monitor,
                description: "Direct visual examination and optical aids",
                applications: ["General inspection", "Weld quality", "Surface conditions"],
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-orange-500 transition-colors group">
                  {/* Method Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r ${method.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-600">
                      <span className="text-orange-400 font-mono font-bold text-sm">{method.code}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 font-mono">{method.name}</h3>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">{method.description}</p>

                  {/* Applications */}
                  <div className="space-y-2 mb-6">
                    <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">Applications</div>
                    <ul className="space-y-1">
                      {method.applications.map((app, appIndex) => (
                        <li key={appIndex} className="flex items-center space-x-2 text-sm text-slate-300">
                          <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    to={`/categories/${method.code.toLowerCase()}`}
                    className="w-full bg-slate-700 hover:bg-orange-600 text-slate-300 hover:text-white py-3 rounded-xl font-semibold transition-colors text-center block group-hover:scale-105 transform transition-transform font-mono text-sm"
                  >
                    Start {method.code} Training
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/categories" 
              className="inline-flex items-center text-orange-400 hover:text-orange-300 font-semibold group font-mono"
            >
              <span>Explore All Testing Methods</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Training Modules */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 font-mono">Featured Training</h2>
              <p className="text-slate-600 mt-2">Popular modules among NDT professionals</p>
            </div>
            <Link 
              to="/courses" 
              className="hidden lg:inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group font-mono"
            >
              <span>View All Modules</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayData?.featuredLectures?.length > 0 ? displayData.featuredLectures.map((lecture) => (
              <div key={lecture.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-slate-200 group">
                <div className="relative">
                  <img
                    src={lecture.image || "https://via.placeholder.com/400x240?text=NDT+Training"}
                    alt={lecture.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className="text-orange-400 font-mono text-sm font-bold">
                      {lecture.category?.name || "NDT"}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-slate-900 text-sm font-bold">4.9</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-mono">{lecture.name}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{lecture.technique}</p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1 font-mono">
                      <Clock className="h-4 w-4" />
                      <span>8h</span>
                    </div>
                    <div className="flex items-center space-x-1 font-mono">
                      <Users className="h-4 w-4" />
                      <span>1.2k</span>
                    </div>
                    <div className="flex items-center space-x-1 font-mono">
                      <Award className="h-4 w-4" />
                      <span>Certified</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-orange-600 font-mono">
                        {formatToIDR(lecture.price)}
                      </div>
                    <Link
                      to={`/courses/${lecture.id}`}
                      className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-mono text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              // Placeholder content when no featured lectures
              Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <div className="bg-slate-200 h-48 rounded-xl mb-4"></div>
                  <div className="bg-slate-200 h-6 rounded mb-2"></div>
                  <div className="bg-slate-100 h-4 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="bg-slate-200 h-8 w-20 rounded"></div>
                    <div className="bg-slate-200 h-8 w-24 rounded"></div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12 lg:hidden">
            <Link 
              to="/courses" 
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group font-mono"
            >
              <span>View All Training Modules</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Stats & CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="font-mono">Join the Professional</span>
                <br />
                <span className="text-orange-400">NDT Community</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Connect with thousands of certified technicians, engineers, and quality control 
                specialists. Advance your career with industry-recognized training and certification.
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-3xl font-bold text-orange-400 font-mono">50k+</div>
                  <div className="text-slate-400 font-mono">Active Technicians</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 font-mono">15k+</div>
                  <div className="text-slate-400 font-mono">Certifications Issued</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 font-mono">98%</div>
                  <div className="text-slate-400 font-mono">Industry Pass Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 font-mono">24/7</div>
                  <div className="text-slate-400 font-mono">Technical Support</div>
                </div>
              </div>

              <Link to="/register">
                <Button size="lg">
                  <HardHat className="mr-3 h-6 w-6" />
                  <span className="font-mono">Start Your Career</span>
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 font-mono">Certification Path</h3>
                <p className="text-slate-400 text-sm">Your journey to NDT expertise</p>
              </div>

              <div className="space-y-4">
                {[
                  { level: "Level I", title: "Basic Operator", status: "available", progress: 100 },
                  { level: "Level II", title: "Advanced Technician", status: "current", progress: 75 },
                  { level: "Level III", title: "Certified Professional", status: "locked", progress: 0 }
                ].map((cert, index) => (
                  <div key={index} className="bg-slate-900 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          cert.status === 'available' ? 'bg-green-500' :
                          cert.status === 'current' ? 'bg-orange-500' :
                          'bg-slate-600'
                        }`}>
                          <span className="text-white font-mono text-sm font-bold">{cert.level}</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold font-mono text-sm">{cert.title}</div>
                          <div className="text-slate-400 text-xs font-mono">{cert.level} Certification</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-mono ${
                        cert.status === 'available' ? 'bg-green-500/20 text-green-400' :
                        cert.status === 'current' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {cert.status === 'available' ? 'Completed' :
                         cert.status === 'current' ? 'In Progress' :
                         'Locked'}
                      </div>
                    </div>
                    
                    {cert.progress > 0 && (
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            cert.status === 'available' ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${cert.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
