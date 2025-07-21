import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { 
  Menu, 
  X, 
  Search,
  ShoppingCart, 
  User, 
  LogOut, 
  Settings,
  Bell,
  BookOpen,
  Target,
  Shield,
  Home,
  Grid3X3,
  ChevronDown,
  Monitor,
  Smartphone,
  HardHat,
  Wrench
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TechnicalNavbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const navigationLinks = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Training Modules", href: "/courses", icon: BookOpen },
    { name: "NDT Methods", href: "/categories", icon: Grid3X3 },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-orange-600 p-2 rounded-lg group-hover:bg-orange-500 transition-colors">
                <HardHat className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-lg">NDT Pro</div>
                <div className="text-orange-400 text-xs font-mono uppercase tracking-wider">
                  Technical Training
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors font-medium group"
                >
                  <Icon className="h-4 w-4 group-hover:text-orange-400 transition-colors" />
                  <span className="font-mono text-sm">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search training..."
                    className="w-64 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 p-2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                </button>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.username?.charAt(0).toUpperCase() || "T"}
                      </span>
                    </div>
                    <div className="hidden xl:block text-left">
                      <div className="text-sm font-medium text-white font-mono">
                        {user?.username || "Technician"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {isAdmin ? "Administrator" : "NDT Specialist"}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-600 rounded-xl shadow-lg overflow-hidden z-50">
                      {/* Profile Header */}
                      <div className="px-4 py-3 bg-slate-900 border-b border-slate-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.username?.charAt(0).toUpperCase() || "T"}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white font-mono">
                              {user?.username || "Technician"}
                            </div>
                            <div className="text-sm text-gray-400">
                              {user?.email || "tech@company.com"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span className="font-mono text-sm">Profile Settings</span>
                        </Link>
                        
                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span className="font-mono text-sm">Admin Panel</span>
                          </Link>
                        )}

                        <div className="border-t border-slate-600 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="font-mono text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white font-mono text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-mono text-sm font-medium"
                >
                  Join Platform
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 py-4 space-y-3">
            {/* Search Bar Mobile */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search training modules..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Navigation Links */}
            <div className="space-y-2">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-mono">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Section */}
            {isAuthenticated ? (
              <div className="border-t border-slate-600 pt-4">
                <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "T"}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium font-mono">{user?.username}</div>
                    <div className="text-gray-400 text-sm">{user?.email}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-mono">Profile</span>
                  </Link>
                  
                  <Link
                    to="/cart"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-mono">Cart</span>
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span className="font-mono">Admin Panel</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-mono">Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-600 pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors font-mono text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-mono text-center font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Platform
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(profileDropdownOpen || searchOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setProfileDropdownOpen(false);
            setSearchOpen(false);
          }}
        ></div>
      )}
    </nav>
  );
}
