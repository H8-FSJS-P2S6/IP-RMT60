import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Grid3X3, 
  List, 
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Target,
  Zap,
  Shield,
  Award,
  ChevronRight,
  Star,
  HardHat,
  Activity,
  Gauge,
  Monitor,
  Settings,
  BarChart3,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import api from "../utils/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const fetchCategories = async () => {
  const { data } = await api.get("/public/categories");
  return data;
};

export default function TechnicalCategories() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { data: categories, isLoading, isError } = useQuery({ 
    queryKey: ['categories'], 
    queryFn: fetchCategories 
  });

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (categoryId) => {
    navigate(`/courses?category=${categoryId}`);
  };

  const ndtMethods = {
    'ultrasonic': { 
      icon: Zap, 
      code: 'UT',
      color: 'from-blue-500 to-blue-600',
      description: 'High-frequency sound waves for flaw detection',
      applications: ['Thickness measurement', 'Weld inspection', 'Corrosion detection'],
      certification: 'ASNT UT Level I-III',
      equipment: ['Transducers', 'Ultrasonic flaw detectors', 'Calibration blocks']
    },
    'radiographic': { 
      icon: Activity, 
      code: 'RT',
      color: 'from-green-500 to-green-600',
      description: 'X-rays and gamma rays for internal inspection',
      applications: ['Pipeline inspection', 'Casting evaluation', 'Weld quality'],
      certification: 'ASNT RT Level I-III',
      equipment: ['X-ray machines', 'Film processors', 'Radiation detectors']
    },
    'magnetic': { 
      icon: Target, 
      code: 'MT',
      color: 'from-purple-500 to-purple-600',
      description: 'Magnetic fields for surface flaw detection',
      applications: ['Steel components', 'Ferrous materials', 'Surface cracks'],
      certification: 'ASNT MT Level I-III',
      equipment: ['Magnetic yokes', 'Particle powder', 'UV lights']
    },
    'penetrant': { 
      icon: BookOpen, 
      code: 'PT',
      color: 'from-red-500 to-red-600',
      description: 'Liquid penetrants for surface discontinuities',
      applications: ['Non-magnetic materials', 'Weld inspection', 'Surface defects'],
      certification: 'ASNT PT Level I-III',
      equipment: ['Penetrant solutions', 'Developers', 'Cleaners']
    },
    'eddy': { 
      icon: Gauge, 
      code: 'ET',
      color: 'from-yellow-500 to-yellow-600',
      description: 'Electromagnetic induction testing',
      applications: ['Tube inspection', 'Conductivity measurement', 'Coating thickness'],
      certification: 'ASNT ET Level I-III',
      equipment: ['Eddy current instruments', 'Probes', 'Reference standards']
    },
    'visual': { 
      icon: Monitor, 
      code: 'VT',
      color: 'from-indigo-500 to-indigo-600',
      description: 'Direct visual examination',
      applications: ['General inspection', 'Surface conditions', 'Dimensional checks'],
      certification: 'ASNT VT Level I-III',
      equipment: ['Magnifiers', 'Borescopes', 'Measuring tools']
    }
  };

  const getMethodInfo = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    for (const [key, info] of Object.entries(ndtMethods)) {
      if (name.includes(key)) return info;
    }
    return ndtMethods.visual; // default
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-mono">Loading NDT Methods...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-mono">System Error</h2>
          <p className="text-slate-600 mb-4">Unable to load NDT methods data.</p>
          <Button onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Technical Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-orange-600 p-3 rounded-xl">
                <HardHat className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-mono">
                NDT Testing Methods
              </h1>
            </div>
            
            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
              Master the six primary Non-Destructive Testing methods used across manufacturing, 
              aerospace, energy, and infrastructure industries. Each method requires specialized 
              training and certification for professional practice.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search NDT methods, applications, or standards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                />
              </div>
            </div>

            {/* Quick Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 font-mono">6</div>
                <div className="text-slate-300 font-mono text-sm">Primary Methods</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 font-mono">50k+</div>
                <div className="text-slate-300 font-mono text-sm">Certified Techs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 font-mono">15</div>
                <div className="text-slate-300 font-mono text-sm">Industries Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 font-mono">98%</div>
                <div className="text-slate-300 font-mono text-sm">Employment Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-mono">Testing Methods Overview</h2>
            <p className="text-slate-600">Choose your specialization area and certification path</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 bg-white rounded-xl border border-slate-200 p-1">
              <Button variant={viewMode === "grid" ? "primary" : "ghost"} onClick={() => setViewMode("grid")}>
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "primary" : "ghost"} onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {!filteredCategories || filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <Target className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2 font-mono">No methods found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search criteria</p>
            <Button onClick={() => setSearchTerm('')}>
              Show All Methods
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-8"
          }>
            {filteredCategories.map((category) => {
              const methodInfo = getMethodInfo(category.name);
              const Icon = methodInfo.icon;
              
              if (viewMode === "list") {
                return (
                  <Card key={category.id} className="hover:shadow-xl transition-all duration-300">
                    <div className="flex">
                      <div className={`w-2 bg-gradient-to-b ${methodInfo.color}`}></div>
                      <div className="flex-1 p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className={`bg-gradient-to-r ${methodInfo.color} w-16 h-16 rounded-xl flex items-center justify-center`}>
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900 font-mono">{category.name}</h3>
                              <div className="flex items-center space-x-3 mt-2">
                                <span className="bg-slate-900 text-orange-400 px-3 py-1 rounded-lg font-mono text-sm font-bold">
                                  {methodInfo.code}
                                </span>
                                <span className="text-slate-500 text-sm font-mono">
                                  {methodInfo.certification}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button onClick={() => handleCategoryClick(category.id)}>
                            <span className="mr-2">Start Training</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-slate-600 mb-6 leading-relaxed">
                          {methodInfo.description}. {category.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Applications */}
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3 font-mono text-sm">Primary Applications</h4>
                            <ul className="space-y-2">
                              {methodInfo.applications.map((app, index) => (
                                <li key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span>{app}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Equipment */}
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3 font-mono text-sm">Required Equipment</h4>
                            <ul className="space-y-2">
                              {methodInfo.equipment.map((equip, index) => (
                                <li key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                                  <Settings className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                  <span>{equip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Stats */}
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3 font-mono text-sm">Training Stats</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Courses</span>
                                <span className="font-bold text-slate-900 font-mono">8</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Students</span>
                                <span className="font-bold text-slate-900 font-mono">1.2k</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Pass Rate</span>
                                <span className="font-bold text-green-600 font-mono">96%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }

              return (
                <Card key={category.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardHeader className={`h-2 bg-gradient-to-r ${methodInfo.color}`}></CardHeader>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`bg-gradient-to-r ${methodInfo.color} w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="bg-slate-900 text-orange-400 px-3 py-1 rounded-lg font-mono text-sm font-bold">
                        {methodInfo.code}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-mono">{category.name}</h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
                      {methodInfo.description}. {category.description}
                    </p>

                    {/* Applications */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 mb-3 font-mono text-sm">Key Applications</h4>
                      <div className="space-y-2">
                        {methodInfo.applications.slice(0, 3).map((app, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                            <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                            <span>{app}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                      <div className="flex items-center space-x-1 font-mono">
                        <BookOpen className="h-4 w-4" />
                        <span>8 modules</span>
                      </div>
                      <div className="flex items-center space-x-1 font-mono">
                        <Users className="h-4 w-4" />
                        <span>1.2k techs</span>
                      </div>
                      <div className="flex items-center space-x-1 font-mono">
                        <BarChart3 className="h-4 w-4" />
                        <span>96% pass</span>
                      </div>
                    </div>

                    {/* Certification Info */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-4 w-4 text-orange-600" />
                        <span className="font-semibold text-slate-900 text-sm font-mono">Certification Path</span>
                      </div>
                      <p className="text-xs text-slate-600 font-mono">{methodInfo.certification}</p>
                    </div>

                    <Button onClick={() => handleCategoryClick(category.id)} className="w-full">
                      Begin {methodInfo.code} Training
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-slate-900 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-mono">
            Start Your NDT Certification Journey
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of certified technicians advancing their careers with professional 
            NDT training. Each method offers structured learning paths from basic operator 
            to certified professional levels.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/courses')}>
              <HardHat className="mr-3 h-6 w-6" />
              <span>Browse All Training</span>
            </Button>
            
            <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
              <Users className="mr-3 h-6 w-6" />
              <span>Join Platform</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
