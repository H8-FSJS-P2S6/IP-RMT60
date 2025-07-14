import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Target, Shield, Award, Users, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";

const loginUser = async (credentials) => {
  const { data } = await api.post("/users/login", credentials);
  return data;
};

const googleLoginUser = async (token) => {
  const { data } = await api.post("/users/login/google", { token });
  return data;
};

export default function ModernLogin() {
  const navigate = useNavigate();
  const { login: authLogin, googleLogin: authGoogleLogin } = useAuth();
  const googleButtonRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({ 
    mutationFn: loginUser, 
    onSuccess: (data) => {
      authLogin(data.access_token, data.user);
      navigate(data.user.role === 'Admin' ? '/admin/dashboard' : '/', { replace: true });
    }
  });

  const googleMutation = useMutation({
    mutationFn: googleLoginUser,
    onSuccess: (data) => {
      authGoogleLogin(data.access_token, data.user);
      navigate(data.user.role === 'Admin' ? '/admin/dashboard' : '/', { replace: true });
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
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
          text: "signin_with",
          shape: "rectangular"
        });
      }
    }
  }, [handleCredentialResponse]);

  const features = [
    {
      icon: Shield,
      title: "Industry Certified",
      description: "Learn from certified NDT professionals"
    },
    {
      icon: Award,
      title: "Career Advancement",
      description: "Boost your professional credentials"
    },
    {
      icon: Users,
      title: "Expert Community",
      description: "Connect with industry professionals"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Login Form */}
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
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to continue your NDT learning journey
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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

            <Button type="submit" className="w-full" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Signing in..." : "Sign In"}
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

          {/* Google Sign In */}
          <div className="mt-6">
            <div 
              ref={googleButtonRef} 
              className="flex justify-center"
            />
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create one now
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

      {/* Right Column - Features & Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white px-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Join the NDT Professional Community
            </h3>
            <p className="text-blue-100 text-lg">
              Access industry-leading courses and advance your career in Non-Destructive Testing
            </p>
          </div>

          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-blue-600/30 p-3 rounded-xl">
                    <Icon className="h-6 w-6 text-blue-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{feature.title}</h4>
                    <p className="text-blue-100">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="font-semibold">Trusted by Professionals</span>
            </div>
            <p className="text-blue-100 text-sm">
              Over 10,000 technicians and engineers have advanced their careers through our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
