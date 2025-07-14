import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Play, 
  Clock, 
  Award, 
  Users, 
  BookOpen, 
  Download, 
  Share2, 
  Star,
  ChevronRight,
  CheckCircle,
  Lock,
  AlertCircle,
  Target,
  Gauge,
  HardHat,
  Shield,
  Zap,
  Activity,
  Monitor,
  Settings,
  BarChart3,
  FileText,
  Video,
  Headphones,
  BookMarked,
  Laptop,
  Microscope,
  Wrench,
  ArrowRight,
  Timer,
  TrendingUp,
  Globe,
  Briefcase,
  GraduationCap,
  CreditCard,
  Heart,
  MessageCircle,
  ThumbsUp
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import VideoPlayerModern from "../components/VideoPlayerModern";

// Utility function to format price to Indonesian Rupiah
const formatToIDR = (price) => {
  if (!price) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const fetchCourseById = async (id) => {
  const { data } = await api.get(`/public/lectures/${id}`);
  return data;
};

const addToCart = async (lectureId) => {
  const { data } = await api.post("/carts/add", { lectureId });
  return data;
};

export default function TechnicalCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: lecture, isLoading } = useQuery({ 
    queryKey: ['course', id], 
    queryFn: () => fetchCourseById(id) 
  });

  const mutation = useMutation({ 
    mutationFn: addToCart, 
    onSuccess: () => {
      navigate("/cart");
    }
  });

  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    mutation.mutate(lecture.id);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-mono">Loading Course Data...</p>
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-mono">Course Not Found</h2>
          <p className="text-slate-600 mb-4">The requested course could not be found.</p>
          <Button onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const ndtMethodInfo = {
    'ultrasonic': { icon: Zap, code: 'UT', color: 'from-blue-500 to-blue-600' },
    'radiographic': { icon: Activity, code: 'RT', color: 'from-green-500 to-green-600' },
    'magnetic': { icon: Target, code: 'MT', color: 'from-purple-500 to-purple-600' },
    'penetrant': { icon: BookOpen, code: 'PT', color: 'from-red-500 to-red-600' },
    'eddy': { icon: Gauge, code: 'ET', color: 'from-yellow-500 to-yellow-600' },
    'visual': { icon: Monitor, code: 'VT', color: 'from-indigo-500 to-indigo-600' }
  };

  const getMethodInfo = (title) => {
    const name = title?.toLowerCase() || '';
    for (const [key, info] of Object.entries(ndtMethodInfo)) {
      if (name.includes(key)) return info;
    }
    return ndtMethodInfo.visual;
  };

  const methodInfo = getMethodInfo(lecture.title);
  const Icon = methodInfo.icon;

  // Mock lesson data
  const lessons = [
    { id: 1, title: "Introduction to NDT Principles", duration: "25 min", type: "video", completed: true },
    { id: 2, title: "Equipment Setup & Calibration", duration: "35 min", type: "video", completed: true },
    { id: 3, title: "Safety Protocols & Standards", duration: "20 min", type: "reading", completed: false },
    { id: 4, title: "Hands-on Practice Session", duration: "45 min", type: "practical", completed: false },
    { id: 5, title: "Data Interpretation Workshop", duration: "30 min", type: "interactive", completed: false },
    { id: 6, title: "Certification Assessment", duration: "60 min", type: "exam", completed: false }
  ];

  const prerequisites = [
    "Basic understanding of material science",
    "Workplace safety certification",
    "High school diploma or equivalent",
    "Physical capability for field work"
  ];

  const learningOutcomes = [
    "Master fundamental NDT testing principles",
    "Operate testing equipment safely and efficiently", 
    "Interpret test results accurately",
    "Follow industry standards and protocols",
    "Prepare for professional certification exam",
    "Apply knowledge in real-world scenarios"
  ];

  const certificationBenefits = [
    "ASNT Level I certification eligibility",
    "Industry-recognized credentials",
    "Enhanced career opportunities",
    "Salary advancement potential",
    "Professional network access",
    "Continuing education credits"
  ];

  const tabs = [
    { id: "overview", label: "Course Overview", icon: BookOpen },
    { id: "curriculum", label: "Curriculum", icon: BookMarked },
    { id: "instructor", label: "Instructor", icon: GraduationCap },
    { id: "reviews", label: "Reviews", icon: Star }
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return Video;
      case 'reading': return FileText;
      case 'practical': return Wrench;
      case 'interactive': return Laptop;
      case 'exam': return Shield;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-slate-300 mb-6 font-mono">
                <Button variant="link" onClick={() => navigate('/courses')} className="hover:text-orange-400">
                  Courses
                </Button>
                <ChevronRight className="h-4 w-4" />
                <Button variant="link" onClick={() => navigate(`/categories/${lecture.categoryId}`)} className="hover:text-orange-400">
                  {lecture.Category?.name}
                </Button>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">{lecture.title}</span>
              </nav>

              {/* Method Badge */}
              <div className="flex items-center space-x-3 mb-6">
                <div className={`bg-gradient-to-r ${methodInfo.color} px-4 py-2 rounded-xl flex items-center space-x-2`}>
                  <Icon className="h-5 w-5 text-white" />
                  <span className="font-bold text-white font-mono">{methodInfo.code}</span>
                </div>
                <span className="bg-slate-800 text-orange-400 px-3 py-1 rounded-lg font-mono text-sm">
                  Professional Level
                </span>
                <span className="bg-green-900/50 text-green-400 px-3 py-1 rounded-lg font-mono text-sm">
                  Certification Ready
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-mono leading-tight">
                {lecture.title}
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {lecture.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <Clock className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <div className="font-bold text-white font-mono">24 Hours</div>
                  <div className="text-slate-400 text-sm">Duration</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <Users className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <div className="font-bold text-white font-mono">1,247</div>
                  <div className="text-slate-400 text-sm">Students</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <BarChart3 className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <div className="font-bold text-white font-mono">4.8/5</div>
                  <div className="text-slate-400 text-sm">Rating</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <Award className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <div className="font-bold text-white font-mono">96%</div>
                  <div className="text-slate-400 text-sm">Pass Rate</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleAddToCart} disabled={mutation.isLoading}>
                  <CreditCard className="h-6 w-6 mr-3" />
                  <span>{mutation.isLoading ? "Adding to cart..." : `Enroll Now - ${formatToIDR(lecture.price)}`}</span>
                </Button>
                
                <Button size="lg" variant="outline" onClick={handleWishlist}>
                  <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Save'}</span>
                </Button>
                
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5 mr-2" />
                  <span>Share</span>
                </Button>
              </div>
            </div>

            {/* Video Preview */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-2xl overflow-hidden">
                <VideoPlayerModern 
                  src={lecture.videoUrl}
                  title={lecture.title}
                  className="w-full aspect-video"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-300 font-mono text-sm">Course Preview</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-mono">4.8</span>
                      <span className="text-slate-400 text-sm">(342 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Skill Level</span>
                      <span className="text-white font-mono">Intermediate</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Language</span>
                      <span className="text-white font-mono">English</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Certification</span>
                      <span className="text-orange-400 font-mono">Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Updates</span>
                      <span className="text-green-400 font-mono">Lifetime</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="overview" className="mt-8">
                <div className="space-y-12">
                  {/* Learning Outcomes */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 font-mono">What You'll Learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 font-mono">Prerequisites</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="space-y-3">
                        {prerequisites.map((prereq, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-slate-700">{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Certification */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 font-mono">Certification Benefits</h3>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {certificationBenefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Award className="h-5 w-5 text-orange-500 flex-shrink-0" />
                            <span className="text-slate-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="curriculum" className="mt-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-mono">Course Curriculum</h3>
                <Accordion type="single" collapsible className="w-full">
                  {lessons.map((lesson, index) => (
                    <AccordionItem key={lesson.id} value={`item-${index}`}>
                      <AccordionTrigger>
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            lesson.completed 
                              ? 'bg-green-100 text-green-600' 
                              : index === 0 
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-slate-100 text-slate-400'
                          }`}>
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : index === 0 ? (
                              <Play className="h-5 w-5" />
                            ) : (
                              <Lock className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 font-mono text-left">{lesson.title}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1 text-sm text-slate-500">
                                {(() => {
                                  const TypeIcon = getTypeIcon(lesson.type);
                                  return <TypeIcon className="h-4 w-4" />;
                                })()}
                                <span className="capitalize">{lesson.type}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-slate-500">
                                <Timer className="h-4 w-4" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="pl-14 text-slate-600">Detailed content for {lesson.title}. This can include a summary of the video, key reading points, or instructions for the practical session.</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              <TabsContent value="instructor" className="mt-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-mono">Meet Your Instructor</h3>
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-24 h-24 bg-slate-200 rounded-xl flex items-center justify-center">
                      <HardHat className="h-12 w-12 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2 font-mono">Dr. Michael Chen</h4>
                      <p className="text-orange-600 font-semibold mb-4">Senior NDT Specialist & ASNT Level III</p>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        With over 15 years of experience in non-destructive testing across aerospace, 
                        oil & gas, and manufacturing industries. Certified ASNT Level III in multiple 
                        methods and active contributor to industry standards development.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="font-bold text-slate-900 font-mono">15+</div>
                          <div className="text-slate-500 text-sm">Years Experience</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-slate-900 font-mono">5,000+</div>
                          <div className="text-slate-500 text-sm">Students Trained</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-slate-900 font-mono">4.9</div>
                          <div className="text-slate-500 text-sm">Avg Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-slate-900 font-mono">12</div>
                          <div className="text-slate-500 text-sm">Courses</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Button>View Profile</Button>
                        <Button variant="outline">Message</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-mono">Student Reviews</h3>
                
                {/* Review Summary */}
                <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900 font-mono">4.8</div>
                      <div className="flex items-center justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div className="text-slate-500 text-sm mt-1">342 reviews</div>
                    </div>
                    
                    <div className="flex-1 ml-12 space-y-2">
                      {[5,4,3,2,1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                          <span className="w-3 text-sm text-slate-600 font-mono">{rating}</span>
                          <Star className="h-4 w-4 text-yellow-400" />
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${rating === 5 ? 78 : rating === 4 ? 18 : rating === 3 ? 3 : rating === 2 ? 1 : 0}%` }}
                            ></div>
                          </div>
                          <span className="w-8 text-sm text-slate-600 font-mono">
                            {rating === 5 ? '78%' : rating === 4 ? '18%' : rating === 3 ? '3%' : rating === 2 ? '1%' : '0%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      role: "Quality Control Engineer",
                      rating: 5,
                      date: "2 weeks ago",
                      comment: "Excellent course! The hands-on approach really helped me understand the practical applications. Dr. Chen's expertise shows through every lesson."
                    },
                    {
                      name: "Mike Rodriguez", 
                      role: "NDT Technician",
                      rating: 5,
                      date: "1 month ago",
                      comment: "Best NDT training I've taken. Clear explanations, real-world examples, and great preparation for certification exam."
                    },
                    {
                      name: "Emily Chen",
                      role: "Aerospace Inspector",
                      rating: 4,
                      date: "2 months ago", 
                      comment: "Very comprehensive course. Would have liked more advanced topics but perfect for getting started in the field."
                    }
                  ].map((review, index) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="font-bold text-slate-600 font-mono">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 font-mono">{review.name}</h4>
                            <p className="text-slate-500 text-sm">{review.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-slate-500 text-sm mt-1 font-mono">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                      
                      <div className="flex items-center space-x-4 mt-4">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Helpful
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Quick Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 font-mono">Course Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">Duration</span>
                    </div>
                    <span className="font-mono font-semibold">24 hours</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">Lessons</span>
                    </div>
                    <span className="font-mono font-semibold">6 modules</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">Resources</span>
                    </div>
                    <span className="font-mono font-semibold">15 files</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">Language</span>
                    </div>
                    <span className="font-mono font-semibold">English</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">Certificate</span>
                    </div>
                    <span className="font-mono font-semibold text-green-600">Included</span>
                  </div>
                </div>
              </div>

              {/* Related Courses */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 font-mono">Related Courses</h4>
                <div className="space-y-4">
                  {[
                    { title: "Advanced UT Techniques", price: "Rp 2.990.000", rating: 4.7 },
                    { title: "RT Safety & Radiation", price: "Rp 2.490.000", rating: 4.9 },
                    { title: "MT Equipment Calibration", price: "Rp 1.990.000", rating: 4.6 }
                  ].map((course, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-900 text-sm font-mono">{course.title}</h5>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-slate-500 font-mono">{course.rating}</span>
                          </div>
                          <span className="font-bold text-orange-600 text-sm font-mono">{course.price}</span>
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
    </div>
  );
}
