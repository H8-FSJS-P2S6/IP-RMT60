import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Clock, 
  Users, 
  Award,
  ChevronDown,
  Target,
  Shield,
  Zap,
  Activity,
  BookOpen,
  Gauge,
  Monitor,
  Settings2,
  BarChart3,
  HardHat,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Globe,
  Briefcase
} from "lucide-react";
import api from "../utils/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";

const fetchCourses = async (filters) => {
  const { data } = await api.get("/public/lectures", { params: filters });
  return data;
};

const fetchCategories = async () => {
  const { data } = await api.get("/public/categories");
  return data;
};

export default function TechnicalCourses() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    categoryId: "",
    sort: "newest",
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({ 
    queryKey: ['courses', filters], 
    queryFn: () => fetchCourses(filters) 
  });
  const { data: categories, isLoading: categoriesLoading } = useQuery({ 
    queryKey: ['categories'], 
    queryFn: fetchCategories 
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilters({ ...filters, search: term, page: 1 });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value, page: 1 });
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const ndtMethods = {
    'ultrasonic': { 
      name: 'Ultrasonic Testing',
      icon: Zap, 
      code: 'UT',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    'radiographic': { 
      name: 'Radiographic Testing',
      icon: Activity, 
      code: 'RT',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    'magnetic': { 
      name: 'Magnetic Particle Testing',
      icon: Target, 
      code: 'MT',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    'penetrant': { 
      name: 'Penetrant Testing',
      icon: BookOpen, 
      code: 'PT',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    'eddy': { 
      name: 'Eddy Current Testing',
      icon: Gauge, 
      code: 'ET',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    'visual': { 
      name: 'Visual Testing',
      icon: Monitor, 
      code: 'VT',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    }
  };

  const getMethodInfo = (title) => {
    const name = title?.toLowerCase() || '';
    for (const [key, info] of Object.entries(ndtMethods)) {
      if (name.includes(key)) return info;
    }
    return ndtMethods.visual;
  };

  if (coursesLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-mono">Loading Professional Courses...</p>
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
                Professional NDT Training
              </h1>
            </div>
            
            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
              Advance your career with industry-leading Non-Destructive Testing courses. 
              Master the techniques used by professionals in aerospace, manufacturing, 
              energy, and infrastructure industries worldwide.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search courses, methods, or instructors..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 font-mono">{coursesData?.lectures.length || 0}</div>
                <div className="text-slate-300 font-mono text-sm">Active Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 font-mono">2.5k+</div>
                <div className="text-slate-300 font-mono text-sm">Certified Techs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 font-mono">98%</div>
                <div className="text-slate-300 font-mono text-sm">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 font-mono">4.8/5</div>
                <div className="text-slate-300 font-mono text-sm">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-mono">Professional Courses</h2>
            <p className="text-slate-600">Master NDT techniques with industry experts</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Filter Toggle */}
            <Button variant="outline" onClick={() => setFilters({ ...filters, showFilters: !filters.showFilters })}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${filters.showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {/* Sort */}
            <Select onValueChange={(value) => handleFilterChange('sort', value)} defaultValue={filters.sort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
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

        {/* Filters Panel */}
        {filters.showFilters && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* NDT Method Filter */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 font-mono">NDT Method</h3>
                <div className="space-y-2">
                  <Button variant={!filters.method ? "secondary" : "ghost"} onClick={() => handleFilterChange('method', '')}>All Methods</Button>
                  {Object.entries(ndtMethods).map(([key, method]) => (
                    <Button 
                      key={key} 
                      variant={filters.method === key ? "secondary" : "ghost"} 
                      onClick={() => handleFilterChange('method', key)}
                      className="w-full justify-start"
                    >
                      <method.icon className="h-4 w-4 mr-2" />
                      {method.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 font-mono">Category</h3>
                <div className="space-y-2">
                  <Button variant={!filters.categoryId ? "secondary" : "ghost"} onClick={() => handleFilterChange('categoryId', '')}>All Categories</Button>
                  {categories?.map((category) => (
                    <Button 
                      key={category.id} 
                      variant={filters.categoryId === category.id ? "secondary" : "ghost"} 
                      onClick={() => handleFilterChange('categoryId', category.id)}
                      className="w-full justify-start"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 font-mono">Skill Level</h3>
                <div className="space-y-2">
                  {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox id={level} />
                      <label
                        htmlFor={level}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Grid/List */}
        {!coursesData || coursesData.lectures.length === 0 ? (
          <div className="text-center py-16">
            <Target className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2 font-mono">No courses found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button onClick={() => setFilters({ page: 1, search: "", categoryId: "", sort: "newest" })}>
              Show All Courses
            </Button>
          </div>
        ) : (
          <>
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
              {coursesData.lectures.map((course) => {
                const methodInfo = getMethodInfo(course.title);
                const Icon = methodInfo.icon;
                
                if (viewMode === "list") {
                  return (
                    <Card key={course.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => handleCourseClick(course.id)}>
                      <div className="flex">
                        <div className={`w-2 bg-gradient-to-b ${methodInfo.color}`}></div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className={`bg-gradient-to-r ${methodInfo.color} w-16 h-16 rounded-xl flex items-center justify-center`}>
                                <Icon className="h-8 w-8 text-white" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-xl font-bold text-slate-900 font-mono">{course.title}</h3>
                                  <span className="bg-slate-900 text-orange-400 px-2 py-1 rounded-lg font-mono text-xs font-bold">
                                    {methodInfo.code}
                                  </span>
                                </div>
                                
                                <p className="text-slate-600 mb-4 line-clamp-2">
                                  {course.description}
                                </p>
                                
                                <div className="flex items-center space-x-6 text-sm text-slate-500">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-mono">24 hours</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-4 w-4" />
                                    <span className="font-mono">1.2k students</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="font-mono">4.8</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Award className="h-4 w-4" />
                                    <span className="font-mono">Certificate</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-slate-900 font-mono">${course.price}</div>
                              <Button className="mt-2">
                                Enroll Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                }

                return (
                  <Card key={course.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer" onClick={() => handleCourseClick(course.id)}>
                    <CardHeader className={`h-2 bg-gradient-to-r ${methodInfo.color}`}></CardHeader>
                    <CardContent className="p-0">
                      <div className="relative h-48 bg-slate-100">
                        {course.imgUrl ? (
                          <img 
                            src={course.imgUrl} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${methodInfo.color} flex items-center justify-center`}>
                            <Icon className="h-16 w-16 text-white" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-slate-900 text-orange-400 px-2 py-1 rounded-lg font-mono text-sm font-bold">
                          {methodInfo.code}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 font-mono group-hover:text-orange-600 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                          {course.description}
                        </p>

                        {/* Course Stats */}
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                          <div className="flex items-center space-x-1 font-mono">
                            <Clock className="h-4 w-4" />
                            <span>24h</span>
                          </div>
                          <div className="flex items-center space-x-1 font-mono">
                            <Users className="h-4 w-4" />
                            <span>1.2k</span>
                          </div>
                          <div className="flex items-center space-x-1 font-mono">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>4.8</span>
                          </div>
                          <div className="flex items-center space-x-1 font-mono">
                            <Award className="h-4 w-4" />
                            <span>Cert</span>
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-slate-900 font-mono">
                            ${course.price}
                          </div>
                          <Button>
                            Enroll Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {coursesData && coursesData.totalPages && coursesData.totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleFilterChange('page', coursesData.currentPage - 1)} 
                  disabled={coursesData.currentPage === 1}
                >
                  Previous
                </Button>
                
                {[...Array(coursesData.totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <Button 
                      key={page} 
                      variant={coursesData.currentPage === page ? "primary" : "outline"} 
                      onClick={() => handleFilterChange('page', page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline" 
                  onClick={() => handleFilterChange('page', coursesData.currentPage + 1)} 
                  disabled={coursesData.currentPage === coursesData.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}