import React from 'react'
import { THEMES } from '../constants';
import { Send } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const PREVIEW_MESSAGES= [
  {id:1, content: "Hii, I am John Doe", isSent:false},
  {id:2, content:"Hello, how are you?", isSent:true},
];


const SettingsPage = () => {
  const {  theme, setTheme } = useThemeStore();
    const handleThemeChange = (t) => {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  };

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h2 className='text-lg font-semibold'>Choose a theme for your chat interface</h2>
        </div>
        {/* Theme Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${theme === t ? 'bg-base-200 ring-2 ring-primary' : 'hover:bg-base-200/60'}`}
            >
            {t}
            <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}
            >
              <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                <div className="rounded bg-primary"></div>
                <div className="rounded bg-secondary"></div>
                <div className="rounded bg-accent"></div>
                <div className="rounded bg-neutral"></div>
              </div>
            </div>
            </button>
          ))}
        </div>
           <div className="space-y-4">
          <h3 className="text-base font-medium">Preview</h3>
          <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
            {/* Chat Header */}
            <div className="bg-base-200 px-4 py-3 border-b border-base-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-content">JD</span>
                </div>
                <div>
                  <h4 className="font-medium text-sm">John Doe</h4>
                  <p className="text-xs text-base-content/70">Online</p>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="p-4 space-y-4 min-h-[200px] max-h-[300px] overflow-y-auto bg-base-100">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl ${
                      message.isSent
                        ? 'bg-primary text-primary-content'
                        : 'bg-base-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`
                        text-[10px] mt-1.5 
                        ${message.isSent ? 'text-primary-content/70' : 'text-base-content/70'}
                      `}>
                        12:35 PM
                    </p>

                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="p-4 bg-base-100 border-t border-base-300" data-theme={theme}>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 input input-bordered bg-base-200 border-base-300 rounded-full px-4 py-2 text-sm"
                />
                <button
                  className="btn btn-primary rounded-full px-4 py-2"
                >
                  <Send className="size-5" />
                </button> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
