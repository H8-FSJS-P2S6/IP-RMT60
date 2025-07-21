import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { selectUser, updateProfile } from "../store/slices/authSlice";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Target,
  Shield,
  Settings,
  Key,
  Bell,
  CreditCard,
  Download,
  FileText,
  Calendar,
  BarChart3,
  Zap,
  Activity,
  Gauge,
  Monitor,
  HardHat,
  GraduationCap,
  Briefcase,
  MapPin as LocationIcon,
  Phone as PhoneIcon,
  Mail as EmailIcon,
  Globe,
  CheckCircle,
  Star,
  ArrowRight,
  Plus,
  Trash2,
  ExternalLink
} from "lucide-react";

export default function TechnicalProfile() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    bio: "",
    company: "",
    position: "",
    experience: "",
    certifications: []
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        company: user.company || "",
        position: user.position || "",
        experience: user.experience || "",
        certifications: user.certifications || []
      });
    }
  }, [user]);

  const handleSave = () => {
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
      company: user?.company || "",
      position: user?.position || "",
      experience: user?.experience || "",
      certifications: user?.certifications || []
    });
    setIsEditing(false);
  };

  const ndtMethods = {
    'UT': { name: 'Ultrasonic Testing', icon: Zap, color: 'bg-blue-500' },
    'RT': { name: 'Radiographic Testing', icon: Activity, color: 'bg-green-500' },
    'MT': { name: 'Magnetic Particle Testing', icon: Target, color: 'bg-purple-500' },
    'PT': { name: 'Penetrant Testing', icon: BookOpen, color: 'bg-red-500' },
    'ET': { name: 'Eddy Current Testing', icon: Gauge, color: 'bg-yellow-500' },
    'VT': { name: 'Visual Testing', icon: Monitor, color: 'bg-indigo-500' }
  };

  const mockUserStats = {
    coursesCompleted: 12,
    totalHours: 156,
    certificationsEarned: 4,
    currentStreak: 15,
    skillLevel: "Advanced",
    overallProgress: 78
  };

  const mockCourseHistory = [
    {
      id: 1,
      title: "Advanced Ultrasonic Testing",
      completedDate: "2024-01-15",
      score: 94,
      certificate: true,
      method: "UT"
    },
    {
      id: 2,
      title: "Radiographic Safety Protocols",
      completedDate: "2024-01-02",
      score: 89,
      certificate: true,
      method: "RT"
    },
    {
      id: 3,
      title: "Magnetic Particle Fundamentals", 
      completedDate: "2023-12-20",
      score: 92,
      certificate: true,
      method: "MT"
    }
  ];

  const mockCertifications = [
    {
      id: 1,
      name: "ASNT Level II - Ultrasonic Testing",
      issuer: "ASNT",
      date: "2024-01-20",
      expiry: "2027-01-20",
      status: "Active",
      credentialId: "UT-L2-2024-001"
    },
    {
      id: 2,
      name: "ASNT Level I - Radiographic Testing",
      issuer: "ASNT", 
      date: "2023-11-15",
      expiry: "2026-11-15",
      status: "Active",
      credentialId: "RT-L1-2023-045"
    }
  ];

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-slate-700 rounded-2xl flex items-center justify-center">
                <User className="h-16 w-16 text-slate-300" />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-2 rounded-xl hover:bg-orange-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-3xl font-bold font-mono">{user?.name || "NDT Professional"}</h1>
                <div className="bg-orange-600 px-3 py-1 rounded-lg">
                  <span className="text-white font-mono text-sm font-semibold">{mockUserStats.skillLevel}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-mono">{formData.position || "NDT Technician"} at {formData.company || "Industrial Corp"}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <LocationIcon className="h-4 w-4" />
                  <span className="font-mono">{formData.location || "Location not set"}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <EmailIcon className="h-4 w-4" />
                  <span className="font-mono">{formData.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="font-mono">{formData.phone || "Phone not set"}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 font-mono">{mockUserStats.coursesCompleted}</div>
                  <div className="text-slate-300 text-sm font-mono">Courses</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 font-mono">{mockUserStats.totalHours}</div>
                  <div className="text-slate-300 text-sm font-mono">Hours</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 font-mono">{mockUserStats.certificationsEarned}</div>
                  <div className="text-slate-300 text-sm font-mono">Certificates</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 font-mono">{mockUserStats.currentStreak}</div>
                  <div className="text-slate-300 text-sm font-mono">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors font-mono flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 font-mono">Profile Information</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-mono"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-mono"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center space-x-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-mono"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 font-mono">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 font-mono">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 font-mono">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 font-mono">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 font-mono">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 font-mono">Position</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-mono">Professional Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                      placeholder="Tell us about your NDT experience and expertise..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="space-y-6">
              {/* Overall Progress */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 font-mono">Learning Progress</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600 font-mono">Overall Progress</span>
                      <span className="font-bold text-slate-900 font-mono">{mockUserStats.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"
                        style={{ width: `${mockUserStats.overallProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 font-mono">4.8</div>
                      <div className="text-slate-500 text-sm">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 font-mono">98%</div>
                      <div className="text-slate-500 text-sm">Completion</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NDT Method Progress */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 font-mono">NDT Method Expertise</h4>
                <div className="space-y-4">
                  {Object.entries(ndtMethods).slice(0, 4).map(([code, method]) => {
                    const Icon = method.icon;
                    const progress = Math.floor(Math.random() * 40) + 60; // Mock progress 60-100%
                    return (
                      <div key={code} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${method.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-900 font-mono text-sm font-semibold">{code}</span>
                            <span className="text-slate-600 font-mono text-sm">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`${method.color} h-2 rounded-full`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 font-mono">Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors text-left">
                    <Download className="h-5 w-5 text-slate-500" />
                    <span className="font-mono text-slate-700">Download Certificates</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors text-left">
                    <FileText className="h-5 w-5 text-slate-500" />
                    <span className="font-mono text-slate-700">View Transcript</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors text-left">
                    <Globe className="h-5 w-5 text-slate-500" />
                    <span className="font-mono text-slate-700">Public Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-8">
            {/* Course Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 font-mono">{mockUserStats.coursesCompleted}</div>
                <div className="text-slate-500 font-mono">Completed</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 font-mono">{mockUserStats.totalHours}</div>
                <div className="text-slate-500 font-mono">Hours Learned</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 font-mono">91%</div>
                <div className="text-slate-500 font-mono">Avg Score</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 font-mono">{mockUserStats.currentStreak}</div>
                <div className="text-slate-500 font-mono">Day Streak</div>
              </div>
            </div>

            {/* Course History */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 font-mono">Course History</h3>
              </div>
              
              <div className="divide-y divide-slate-200">
                {mockCourseHistory.map((course) => {
                  const methodInfo = ndtMethods[course.method];
                  const Icon = methodInfo?.icon || BookOpen;
                  
                  return (
                    <div key={course.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${methodInfo?.color || 'bg-slate-500'} rounded-xl flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-slate-900 font-mono">{course.title}</h4>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1 text-sm text-slate-500">
                                <Calendar className="h-4 w-4" />
                                <span className="font-mono">{new Date(course.completedDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-slate-500">
                                <BarChart3 className="h-4 w-4" />
                                <span className="font-mono">{course.score}% Score</span>
                              </div>
                              {course.certificate && (
                                <div className="flex items-center space-x-1 text-sm text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="font-mono">Certified</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {course.certificate && (
                            <button className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors font-mono text-sm">
                              <Download className="h-4 w-4" />
                              <span>Certificate</span>
                            </button>
                          )}
                          <button className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors font-mono text-sm">
                            <ArrowRight className="h-4 w-4" />
                            <span>Review</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "certifications" && (
          <div className="space-y-8">
            {/* Add Certification */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-mono mb-2">Professional Certifications</h3>
                  <p className="text-slate-600">Manage your NDT certifications and credentials</p>
                </div>
                <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-mono">
                  <Plus className="h-4 w-4" />
                  <span>Add Certification</span>
                </button>
              </div>
            </div>

            {/* Certifications List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCertifications.map((cert) => (
                <div key={cert.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-lg font-mono mb-2">{cert.name}</h4>
                        <p className="text-slate-300 font-mono text-sm">Issued by {cert.issuer}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-mono ${
                        cert.status === 'Active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-black'
                      }`}>
                        {cert.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-slate-500 font-mono">Issue Date</div>
                          <div className="font-semibold text-slate-900 font-mono">{new Date(cert.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 font-mono">Expires</div>
                          <div className="font-semibold text-slate-900 font-mono">{new Date(cert.expiry).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-slate-500 font-mono">Credential ID</div>
                        <div className="font-semibold text-slate-900 font-mono">{cert.credentialId}</div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-mono text-sm">
                          <ExternalLink className="h-4 w-4" />
                          <span>Verify</span>
                        </button>
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors font-mono text-sm">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                          <button className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* Account Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 font-mono">Account Settings</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-900 font-mono">Change Password</div>
                      <div className="text-slate-500 text-sm">Update your account password</div>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-mono">
                    Update
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-900 font-mono">Email Notifications</div>
                      <div className="text-slate-500 text-sm">Manage notification preferences</div>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-mono">
                    Configure
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-900 font-mono">Billing & Payment</div>
                      <div className="text-slate-500 text-sm">Manage payment methods and billing</div>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-mono">
                    Manage
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-900 font-mono">Privacy Settings</div>
                      <div className="text-slate-500 text-sm">Control your privacy and data sharing</div>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-mono">
                    Review
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
              <div className="p-6 border-b border-red-200 bg-red-50">
                <h3 className="text-xl font-bold text-red-900 font-mono">Danger Zone</h3>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-red-900 font-mono">Delete Account</div>
                    <div className="text-red-700 text-sm">Permanently delete your account and all data</div>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-mono">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
