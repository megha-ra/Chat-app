import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js';
import { Camera, User, Mail, CheckCircle } from 'lucide-react'; // Using lucide-react for the Camera icon

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Selected file:", file.name, file.size);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result; // Get base64 string without the data URL prefix
      await updateProfile({ profilePic: base64Image });
      setSelectedImg(base64Image); // Update the selected image in the store
    }; 
  }

  // Debug: Check what values we have
  console.log('Current values:', {
    selectedImg: selectedImg ? 'Has image' : 'No image',
    profilePic: authUser?.profilePic ? 'Has profilePic' : 'No profilePic',
    authUser: authUser ? 'User exists' : 'No user'
  });

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg||authUser.profilePic || '/user.png'}
                alt="Profile"
                className="size-40 rounded-full object-cover border-4"
                onError={(e) => {
                  console.log('Image failed to load, using fallback');
                  e.target.src = '/user.png';
                }}
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                rounded-full p-2 cursor-pointer 
                transition-all duration-200
                ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}
                `}
              >
                <Camera className="text-base-200 size-6" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}    
                />
              </label>
            </div>
            <p className='text-sm text-zinc-400'>
              {isUpdatingProfile ? 'Uploading...' : 'Click to change profile picture'}
            </p>
          </div>
          {/* user information section */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="size-4" />
                Full Name
              </div>
              <p className='px-4 py-4 bg-base-200 rounded-lg border'>{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="size-4" />
                Email Address
              </div>
              <p className='px-4 py-4 bg-base-200 rounded-lg border'>{authUser?.email}</p>
            </div>
            <div className="mt-4 bg-base-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-3">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                {authUser?.createdAt
                  ? new Date(authUser.createdAt).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Unknown'}
              </span>
              </div>
                <div className="flex items-center justify-between py-0.5">
                  <span>Account Status</span>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="size-4" />
                    <span>Active</span>
                  </div>
                </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
