import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Clock, 
  Users, 
  TrendingUp,
  Award,
  ChevronRight,
  Target,
  Shield,
  Zap,
  BookOpen,
  Play,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { formatToIDR } from "../utils/formatter";
import api from '../utils/api';

const NDTCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, lecturesRes] = await Promise.all([
          api.get('/public/categories'),
          api.get('/public/lectures')
        ]);
        
        setCategories(categoriesRes.data);
        setLectures(lecturesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecture.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || lecture.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedLectures = [...filteredLectures].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default: // popular
        return (b.students || 0) - (a.students || 0);
    }
  });

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('ultrasonic') || name.includes('ut')) return Target;
    if (name.includes('radiographic') || name.includes('rt')) return Shield;
    if (name.includes('magnetic') || name.includes('mt')) return Zap;
    if (name.includes('penetrant') || name.includes('pt')) return BookOpen;
    return Target;
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading NDT Courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional NDT Training
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Master Non-Destructive Testing with industry-leading courses designed by certified professionals. 
              Get certified and advance your career in quality assurance and materials testing.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search NDT courses, techniques, or standards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-500 text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">{lectures.length}+</div>
                <div className="text-blue-100">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">50k+</div>
                <div className="text-blue-100">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">95%</div>
                <div className="text-blue-100">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">24/7</div>
                <div className="text-blue-100">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">NDT Methods & Techniques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left group ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-xl ${
                      isSelected ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isSelected ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {lectures.filter(l => l.categoryId === category.id).length} courses
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 text-sm font-medium">
                      Explore Method
                    </span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      isSelected ? 'text-blue-600 transform rotate-90' : 'text-gray-400'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{sortedLectures.length}</span> courses
            {selectedCategory && (
              <span> in <span className="font-semibold">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span></span>
            )}
          </p>
        </div>

        {/* Courses Grid/List */}
        {sortedLectures.length === 0 ? (
          <div className="text-center py-16">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }>
            {sortedLectures.map((lecture) => {
              const category = categories.find(c => c.id === lecture.categoryId);
              
              if (viewMode === 'list') {
                return (
                  <div key={lecture.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="flex">
                      <div className="relative w-80 h-48">
                        <img
                          src={lecture.imgUrl || '/api/placeholder/320/192'}
                          alt={lecture.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            getDifficultyColor(lecture.level)
                          }`}>
                            {lecture.level || 'Professional'}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="h-16 w-16 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                              {lecture.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {lecture.description}
                            </p>
                            
                            {category && (
                              <div className="flex items-center space-x-2 mb-4">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                                  {category.name}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                                {formatToIDR(lecture.price)}
                              </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span>{lecture.rating || 4.8}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{lecture.students || '1.2k'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{lecture.duration || '8'} hours</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => navigate(`/course/${lecture.id}`)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <span>Enroll Now</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={lecture.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative">
                    <img
                      src={lecture.imgUrl || '/api/placeholder/400/240'}
                      alt={lecture.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        getDifficultyColor(lecture.level)
                      }`}>
                        {lecture.level || 'Professional'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="font-medium">{lecture.rating || 4.8}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {lecture.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {lecture.description}
                      </p>
                    </div>
                    
                    {category && (
                      <div className="mb-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                          {category.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{lecture.students || '1.2k'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{lecture.duration || '8'}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4" />
                        <span>Certified</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatToIDR(lecture.price)}
                      </div>
                      <button
                        onClick={() => navigate(`/course/${lecture.id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NDTCategories;
