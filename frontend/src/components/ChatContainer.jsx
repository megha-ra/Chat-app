import React, {useRef, useEffect, useState} from 'react'
import {useChatStore} from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { X } from 'lucide-react';


const ChatContainer = () => {
  const { 
    messages, 
    getMessages, 
    isMessagesLoading, 
    selectedUser,
    unsubscribeFromMessages,
    subscribeToMessages
   } = useChatStore();

   const {authUser} = useAuthStore();
   const messageEndRef = useRef(null);
   const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();

      return () => unsubscribeFromMessages();
    }
}, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
   // Function to handle image click
  const handleImageClick = (imageSrc) => {
    setPreviewImage(imageSrc);
  };

  // Function to close preview
  const closePreview = () => {
    setPreviewImage(null);
  };


  if(isMessagesLoading) {
    return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />

    </div>
  );
  }

  return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message._id} 
                className={`chat ${message.senderId === authUser._id? 'chat-end' : 'chat-start'}`}
                ref={messageEndRef}
                >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img 
                      src={ 
                        message.senderId === authUser._id?
                        authUser.profilePic || '/user.png'
                        : selectedUser.profilePic || '/user.png'}
                      alt='profile pic'
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className='text-xs opacity-50 ml-1'>
                    {new Date(message.createdAt).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {/* Check if image then display it otherwise display the message */}
                  { message.image && (
                    <img 
                      src={message.image}
                      alt='attachment'
                      className='sm:max-w-[200px] rounded-md mb-2 cursor-pointer'
                      onClick={() => handleImageClick(message.image)}
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Image Preview Modal */}
          {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close button using Lucide React */}
            <button 
              onClick={closePreview}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Preview image */}
            <img 
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            />
          </div>
        </div>
      )}
        <MessageInput />
        </div>
        
    );
};


export default ChatContainer;
