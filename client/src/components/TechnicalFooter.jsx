import { 
  HardHat, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  Shield,
  Award,
  Clock,
  Users,
  Target,
  Wrench,
  FileText,
  Download,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router";

export default function TechnicalFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Training Dashboard", href: "/" },
    { name: "Course Modules", href: "/courses" },
    { name: "NDT Methods", href: "/categories" },
    { name: "Certification Path", href: "/certifications" },
    { name: "Technical Support", href: "/support" },
  ];

  const ndtMethods = [
    { name: "Ultrasonic Testing (UT)", href: "/categories/ultrasonic", code: "UT" },
    { name: "Radiographic Testing (RT)", href: "/categories/radiographic", code: "RT" },
    { name: "Magnetic Particle (MT)", href: "/categories/magnetic", code: "MT" },
    { name: "Penetrant Testing (PT)", href: "/categories/penetrant", code: "PT" },
    { name: "Eddy Current (ET)", href: "/categories/eddy-current", code: "ET" },
  ];

  const resources = [
    { name: "Technical Documentation", href: "/docs", icon: FileText },
    { name: "Standards & Codes", href: "/standards", icon: Shield },
    { name: "Equipment Guides", href: "/equipment", icon: Wrench },
    { name: "Safety Protocols", href: "/safety", icon: HardHat },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ];

  const certificationFeatures = [
    {
      icon: Shield,
      title: "Industry Certified",
      description: "ASNT, ISO 9712 compliant training programs"
    },
    {
      icon: Award,
      title: "Expert Instructors",
      description: "Level III certified NDT professionals"
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Learn on your schedule, anywhere"
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with 50k+ NDT technicians"
    }
  ];

  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Features Section */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 font-mono">
              Professional NDT Training Platform
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Advanced technical education for Non-Destructive Testing professionals, 
              technicians, and quality control specialists worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certificationFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors">
                    <Icon className="h-8 w-8 text-orange-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 font-mono">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-600 p-3 rounded-xl">
                <HardHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-mono">NDT Pro</h3>
                <p className="text-orange-400 text-sm font-mono uppercase tracking-wider">
                  Technical Training
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              Leading provider of professional Non-Destructive Testing education and certification. 
              Empowering technicians and engineers with industry-standard knowledge and practical skills 
              for quality assurance and materials inspection.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300 font-mono">training@ndtpro.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300 font-mono">+1 (555) NDT-TECH</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">Industrial Training Center, USA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-600 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-mono">
              Platform Access
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center space-x-2 group font-mono text-sm"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NDT Methods */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-mono">
              Testing Methods
            </h4>
            <ul className="space-y-3">
              {ndtMethods.map((method) => (
                <li key={method.name}>
                  <Link
                    to={method.href}
                    className="group flex items-start space-x-2 text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    <span className="bg-slate-800 text-orange-400 px-2 py-1 rounded text-xs font-mono font-bold min-w-fit group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      {method.code}
                    </span>
                    <span className="text-sm font-mono leading-tight">
                      {method.name.replace(` (${method.code})`, '')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 font-mono">
              Technical Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <li key={resource.name}>
                    <Link
                      to={resource.href}
                      className="flex items-center space-x-3 text-gray-400 hover:text-orange-400 transition-colors group"
                    >
                      <Icon className="h-4 w-4 group-hover:text-orange-400 transition-colors" />
                      <span className="text-sm font-mono">{resource.name}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Industry Standards */}
            <div className="mt-8 p-4 bg-slate-800 rounded-xl border border-slate-700">
              <h5 className="text-white font-semibold mb-3 font-mono text-sm">
                Compliance Standards
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">ASNT SNT-TC-1A</span>
                  <span className="text-green-400 font-mono">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ISO 9712</span>
                  <span className="text-green-400 font-mono">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ASTM Standards</span>
                  <span className="text-green-400 font-mono">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm font-mono">
              © {currentYear} NDT Pro Technical Training. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors font-mono">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-orange-400 transition-colors font-mono">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-orange-400 transition-colors font-mono">
                Cookie Policy
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-mono">System Operational</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                v2.1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
