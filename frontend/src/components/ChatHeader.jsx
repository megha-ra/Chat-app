import { useState } from 'react';
import {X} from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import {useAuthStore} from '../store/useAuthStore';


const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false); // 🔄 modal toggle

  return (
    <div className="p-2 5 border-b border-base-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowProfile(true)} // 🔄 toggle profile modal
            >
                {/* Avatar */}
                <div className="avatar">
                    <div className="size-10 rounded-full relative">
                        <img src={selectedUser.profilePic || '/user.png'} alt={selectedUser.fullName} />
                    </div>
                </div>
                {/* User Info */}
                <div>
                    <h3 className='font-medium'>{selectedUser.fullName}</h3>
                    <p className='text-sm text-base-content/70'>
                        {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>
            {/* Close Chat */}
            <div className="flex items-center gap-3">
                <button className="btn btn-sm btn-outline" onClick={() => setSelectedUser(null)}>
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Profile Preview Modal */}
            {showProfile && (
                <div
                className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
                onClick={() => setShowProfile(false)}
                >
                <div
                    className="bg-base-100 text-base-content rounded-xl p-6 shadow-xl relative max-w-sm w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                    onClick={() => setShowProfile(false)}
                    className="absolute top-2 right-2 text-base-content hover:text-base-content/70 transition"
                    >
                    <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center">
                    <img
                        src={selectedUser.profilePic || '/user.png'}
                        alt="Profile"
                        className="size-28 rounded-full mb-4 object-cover border"
                    />
                    <h2 className="text-lg font-semibold">
                        {selectedUser.fullName}
                    </h2>
                    <p className="text-sm opacity-70 mt-1">
                        {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                    </p>
                    </div>
                </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ChatHeader;
