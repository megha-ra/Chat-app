import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";


import { Routes, Route, Navigate } from "react-router-dom";
import { use, useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { Loader } from "lucide-react"; // Using Mantine for the Loader component
import { Toaster } from "react-hot-toast"; // Using react-hot-toast for notifications

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  console.log("Online Users:", onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

   useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  console.log("Auth User:", authUser);

  if(isCheckingAuth && !authUser) return(
    <div className="flex justify-center items-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  );
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} /> 
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage />} /> 
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <Toaster />
    </div>
  
  );
}
export default App;
