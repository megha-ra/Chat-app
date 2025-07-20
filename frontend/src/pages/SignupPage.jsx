import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, User, Mail, Lock, Eye, EyeOff, Loader2} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const {signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("Full Name is required");
    if(!formData.email.trim()) return toast.error("Email is required");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("Invalid email format");
    if(!formData.password.trim()) return toast.error("Password is required");
    if(formData.password.length < 8) return toast.error("Password must be at least 8 characters");

    return true;
  };

  const handleSubmit =(e) =>{
    e.preventDefault();
    const success = validateForm();
    if(success) signup(formData);
  };

  return (
   <div className='min-h-screen grid lg:grid-cols-2'>
    {/* Left Side */}
    <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
      <div className="w-full max-w-md space-y-6S">
       {/* Logo */}
       <div className="text-center mb-8 mt-3">
        <div className="flex flex-col items-center gap-3 group">
          <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
            <MessageSquare className='w-5 h-5 text-primary' />
          </div>
          <h1 className="text-3xl font-bold text-primary">Create Account</h1>
          <p className="text-base-content/60">Get started with your free account</p>
        </div>
       </div>

       {/* Signup Form */}
       <form onSubmit={handleSubmit} className="space-y-2">
        {/* Full Name */}
        <div>
          <label className='label pb-1'>
           <span className="label-text font-medium">Full Name</span>
          </label>
          <div className="relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="size-5 text-base-content/40" />
           </div>
          <input
           type="text"
           className="input input-bordered w-full pl-10"
           placeholder="Full Name"
           value={formData.fullName}
           onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          </div>
        </div>
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
              disabled={isSigningUp}
            >
              {isSigningUp ? (
              <>
               <Loader2 className='size-4 animate-spin' />
               Loading...
              </>
              ) : ( 
              "Create Account"
              )}
            </button>
            </form>

            {/* Already have an account? */}
       <div className="text-center">
        <p className="text-base-content/60">
          Already have an account?{" "}
          <a href="/login" className="link link-primary">
           Sign in
          </a>
        </p>
       </div>
      </div>
    </div>

    {/* Right Side */}
      <div className='hidden lg:flex items-center justify-center bg-base-200'>
        <div className="text-center max-w-md p-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Our Platform</h1>
          
          {/* Feature Icons */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Real-time Messaging</h3>
                <p className="text-sm text-base-content/60">Connect instantly with friends and family</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="size-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-sm text-base-content/60">Your data is protected with end-to-end encryption</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="size-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Easy to Use</h3>
                <p className="text-sm text-base-content/60">Simple interface designed for everyone</p>
              </div>
            </div>
          </div>
          <p className="text-base-content/60">
            Join us today and start your journey with a community that cares.
          </p>
        </div>
      </div>
   </div>
  );
};

export default SignupPage;
