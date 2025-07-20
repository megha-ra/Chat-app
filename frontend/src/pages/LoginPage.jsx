import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const {login, isLoggingIn} = useAuthStore();

  const validateForm = () => {
    if(!formData.email.trim()) return toast.error("Email is required");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("Invalid email format");
    if(!formData.password.trim()) return toast.error("Password is required");
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if(success) await login(formData);
  }; 

  return (
     <div className='min-h-screen grid lg:grid-cols-2 pt-4 md:pt-20'>
      {/* Left Side - Form */}
      <div className='flex flex-col justify-center items-center p-4 sm:p-12'>
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-3 group">
              <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                <MessageSquare className='w-5 h-5 text-primary' />
              </div>
              <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className='label pb-1'>
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className='label pb-1'>
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full h-12 text-lg"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className='size-4 animate-spin' />
                  Loading...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Don't have an account? */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <a href="/signup" className="link link-primary">
                Create account
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='hidden lg:flex items-center justify-center bg-base-200'>
        <div className="text-center max-w-md p-8">
          <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-base-content/60 mb-8">
            Sign in to continue your conversation and stay connected with your community.
          </p>
          
          {/* Feature Icons */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Continue Conversations</h3>
                <p className="text-sm text-base-content/60">Pick up where you left off with your contacts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="size-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Secure Access</h3>
                <p className="text-sm text-base-content/60">Your account is protected with advanced security</p>
              </div>
            </div>
          </div>
          
          <p className="text-base-content/60">
            We're glad to have you back. Let's get you signed in!
          </p>
        </div>
      </div>
     </div>
  )
}

export default LoginPage