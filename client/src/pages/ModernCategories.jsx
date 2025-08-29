import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { 
  fetchCategories, 
  selectCategories, 
  selectCategoriesLoading,
  selectCategoriesError 
} from "../store/slices/categoriesSlice";
import { 
  Search, 
  Filter, 
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
  Star
} from "lucide-react";

export default function ModernCategories() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(selectCategoriesLoading);
  const error = useAppSelector(selectCategoriesError);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categories, searchTerm]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/courses?category=${categoryId}`);
  };

  const categoryIcons = {
    'ultrasonic': Target,
    'radiographic': Zap,
    'magnetic': Shield,
    'visual': BookOpen,
    'penetrant': Award,
    'default': BookOpen
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('ultrasonic')) return categoryIcons.ultrasonic;
    if (name.includes('radiographic') || name.includes('x-ray')) return categoryIcons.radiographic;
    if (name.includes('magnetic')) return categoryIcons.magnetic;
    if (name.includes('visual')) return categoryIcons.visual;
    if (name.includes('penetrant') || name.includes('dye')) return categoryIcons.penetrant;
    return categoryIcons.default;
  };

  const featuredCategories = [
    {
      id: 1,
      name: "Ultrasonic Testing",
      description: "Advanced ultrasonic inspection techniques and equipment operation",
      courses: 24,
      students: 1247,
      icon: Target,
      color: "blue",
      difficulty: "Intermediate"
    },
    {
      id: 2,
      name: "Radiographic Testing",
      description: "X-ray and gamma ray testing methods for industrial applications",
      courses: 18,
      students: 892,
      icon: Zap,
      color: "purple",
      difficulty: "Advanced"
    },
    {
      id: 3,
      name: "Magnetic Particle Testing",
      description: "Surface and near-surface defect detection using magnetic fields",
      courses: 15,
      students: 756,
      icon: Shield,
      color: "green",
      difficulty: "Beginner"
    },
    {
      id: 4,
      name: "Visual Testing",
      description: "Direct and remote visual inspection techniques",
      courses: 12,
      students: 623,
      icon: BookOpen,
      color: "orange",
      difficulty: "Beginner"
    }
  ];

  const stats = [
    {
      icon: BookOpen,
      label: "Total Courses",
      value: "120+",
      description: "Comprehensive NDT curriculum"
    },
    {
      icon: Users,
      label: "Active Students",
      value: "15,000+",
      description: "Learning professionals worldwide"
    },
    {
      icon: Award,
      label: "Certifications",
      value: "50+",
      description: "Industry-recognized credentials"
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: "95%",
      description: "Student completion rate"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              NDT Course Categories
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Explore comprehensive training programs across all major Non-Destructive Testing methods
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Search categories..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{stat.label}</h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
            <p className="text-gray-600">Choose your area of expertise and start learning</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            <button className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {/* Featured Categories */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Featured Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => {
              const Icon = category.icon;
              const colorClasses = {
                blue: "from-blue-500 to-blue-600",
                purple: "from-purple-500 to-purple-600",
                green: "from-green-500 to-green-600",
                orange: "from-orange-500 to-orange-600"
              };
              
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className={`bg-gradient-to-br ${colorClasses[category.color]} p-6 text-white relative`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-8 w-8" />
                      <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
                        {category.difficulty}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{category.name}</h4>
                    <div className="flex items-center space-x-4 text-sm opacity-90">
                      <span>{category.courses} courses</span>
                      <span>{category.students.toLocaleString()} students</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      <span>Explore courses</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Categories */}
        {filteredCategories.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              All Categories ({filteredCategories.length})
            </h3>
            
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => {
                  const Icon = getCategoryIcon(category.name);
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {Math.floor(Math.random() * 20) + 5} courses available
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {category.description || "Professional training and certification courses"}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{Math.floor(Math.random() * 1000) + 100}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>4.{Math.floor(Math.random() * 3) + 7}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCategories.map((category) => {
                  const Icon = getCategoryIcon(category.name);
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-colors">
                          <Icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {category.name}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            {category.description || "Professional training and certification courses"}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{Math.floor(Math.random() * 20) + 5} courses</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{Math.floor(Math.random() * 1000) + 100} students</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{Math.floor(Math.random() * 40) + 10} hours</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>4.{Math.floor(Math.random() * 3) + 7}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {filteredCategories.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
