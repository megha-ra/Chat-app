import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api'; // Adjust this to your backend URL

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () =>{
    try {
        const res = await axiosInstance.get('/auth/check-auth');
        set({authUser: res.data.user,});
        get().connectSocket(); // Connect to socket server after checking auth
    } catch (error) {
        console.log("Error in checkAuth:", error);
        set({ authUser: null });
    } finally{
        set({ isCheckingAuth: false});
    }
  },

  signup: async (data) =>{
    set({ isSigningUp: true }); // Set loading state
       try {
        const res = await axiosInstance.post('/auth/signup', data);
        set({ authUser: res.data });
        toast.success("Account created successfully");
        get().connectSocket(); // Connect to socket server after signup
    } catch (error) {
      // Better error handling with specific error messages
      console.error("Signup error:", error);
      let errorMessage = "Error creating account";
      
      if (error.response) {
        // Server responded with error status
        console.log('Error response:', error.response.data);
        console.log('Error status:', error.response.status);
        
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Invalid signup data. Please check your input.";
        } else if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // Network error
        console.log('Network error:', error.request);
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Other error
        console.log('Other error:', error.message);
        errorMessage = error.message || "An unexpected error occurred";
      }
      
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false }); // Reset loading state
    }
  },

//Whenever the user logs in, we need to connect to the socket server immediately
  login: async (data) => {
    set({ isLoggingIn: true }); // Set loading state
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket(); // Connect to socket server after login
    } catch (error) {
      // Better error handling with specific error messages
      console.error("Login error:", error);
      let errorMessage = "Error logging in";
      
      if (error.response) {
        // Server responded with error status
        console.log('Error response:', error.response.data);
        console.log('Error status:', error.response.status);
        
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Invalid login credentials. Please check your email and password.";
        } else if (error.response.status === 401) {
          errorMessage = "Unauthorized. Please check your credentials.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // Network error
        console.log('Network error:', error.request);
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Other error
        console.log('Other error:', error.message);
        errorMessage = error.message || "An unexpected error occurred";
      }
      
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false }); // Reset loading state
    }
  },
  

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket(); // Disconnect from socket server on logout
    } catch (error) {
      console.error("Logout error:", error);
      // Better error handling with specific error messages
      toast.error("Error logging out");
    }
  },

  updateProfile: async (data) => {
  set({ isUpdatingProfile: true }); // Set loading state
  try {
    const res = await axiosInstance.put('/auth/update-profile', data);
    set({ authUser: res.data });
    toast.success("Profile updated successfully");
  } catch (error) {  
    console.error("Update profile error:", error);
    let errorMessage = "Error updating profile";
    toast.error(errorMessage);
  } finally {
    set({ isUpdatingProfile: false });
  }
},

  connectSocket: () => {
    const {authUser} = get();
    if (!authUser || get().socket?.connected) {
      console.warn("Cannot connect to socket server without an authenticated user");
      return;
    }

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
    set({ socket: socket });
  },
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },

}));