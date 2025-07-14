import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Target, Zap, BookOpen, Users, CheckCircle, Building2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";

const registerUser = async (userData) => {
  const { data } = await api.post("/users/register", userData);
  return data;
};

const googleLoginUser = async (token) => {
  const { data } = await api.post("/users/login/google", { token });
  return data;
};

export default function ModernRegister() {
  const navigate = useNavigate();
  const { googleLogin: authGoogleLogin } = useAuth();
  const googleButtonRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const mutation = useMutation({ 
    mutationFn: registerUser, 
    onSuccess: () => {
      navigate("/login");
    }
  });

  const googleMutation = useMutation({
    mutationFn: googleLoginUser,
    onSuccess: (data) => {
      authGoogleLogin(data.access_token, data.user);
      navigate(data.user.role === 'Admin' ? '/admin/dashboard' : '/', { replace: true });
    }
  });

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    const { confirmPassword: _confirmPassword, ...submitData } = formData;
    mutation.mutate(submitData);
  };

  const handleCredentialResponse = useCallback((response) => {
    googleMutation.mutate(response.credential);
  }, [googleMutation]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signup_with",
          shape: "rectangular"
        });
      }
    }
  }, [handleCredentialResponse]);

  const benefits = [
    {
      icon: Zap,
      title: "Instant Access",
      description: "Start learning immediately after registration"
    },
    {
      icon: BookOpen,
      title: "Premium Content",
      description: "Access to industry-standard NDT courses"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Learn from certified professionals"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 group mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl group-hover:from-blue-700 group-hover:to-blue-800 transition-colors">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">SNS NDT</div>
                <div className="text-sm text-gray-500">Professional Training</div>
              </div>
            </Link>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600">
              Join thousands of NDT professionals advancing their careers
            </p>
          </div>

          {/* Error Alert */}
          {mutation.isError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <div className="text-red-600 text-sm">{mutation.error.message}</div>
              </div>
            </div>
          )}

          {/* Password Mismatch Alert */}
          {!passwordMatch && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <div className="text-red-600 text-sm">Passwords do not match</div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${!passwordMatch ? "border-red-500" : ""}`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isLoading || !passwordMatch}>
              {mutation.isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">or continue with</span>
              </div>
            </div>
          </div>

          {/* Google Sign Up */}
          <div className="mt-6">
            <div 
              ref={googleButtonRef} 
              className="flex justify-center"
            />
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Benefits & Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white px-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <Building2 className="h-16 w-16 text-emerald-300 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">
              Start Your Professional Journey
            </h3>
            <p className="text-emerald-100 text-lg">
              Join the leading platform for NDT professionals and unlock your career potential
            </p>
          </div>

          <div className="space-y-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-emerald-600/30 p-3 rounded-xl">
                    <Icon className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-emerald-100">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 space-y-4">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="font-semibold">Industry Recognition</span>
              </div>
              <p className="text-emerald-100 text-sm">
                Our certifications are recognized by leading NDT organizations worldwide.
              </p>
            </div>

            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="font-semibold">Free Trial</span>
              </div>
              <p className="text-emerald-100 text-sm">
                Start with our free courses and upgrade when you're ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
