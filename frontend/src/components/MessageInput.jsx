import {useState, useRef, useEffect} from 'react'
import {useChatStore} from '../store/useChatStore.js';
import {X, Image, Send, Smile} from 'lucide-react';
import { emojiCategories } from '../constants/emojiCategories.js';


const MessageInput = () => {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [recentEmojis, setRecentEmojis] = useState([]);
    const [activeEmojiCategory, setActiveEmojiCategory] = useState('recent');
    const fileInputRef = useRef(null);
    const textInputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const { sendMessage } = useChatStore();

    // Load recent emojis from local storage
    useEffect(() => {
      const emojis = JSON.parse(localStorage.getItem('recentEmojis')) || [];
      setRecentEmojis(emojis);
    }, []);

    //Close emoji picker when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false);
        }
      };
    
      if(showEmojiPicker) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [showEmojiPicker]);


    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if(!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
    
    const removeImage = () => {
      setImagePreview(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEmojiClick = (emoji) => {
      setText((prev) => prev + emoji);
      const updatedRecent = saveRecentEmoji(emoji);
      setRecentEmojis(updatedRecent);
      textInputRef.current.focus();
    };

    const handleSendMessage = async (e) => {
      e.preventDefault();
      if(!text.trim() && !imagePreview) return; //if no text or image, do nothing
      try{
        await sendMessage({
          text: text.trim(),
          image: imagePreview ? imagePreview : null
        });

        //Clear form
        setText('');
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = ""; //Reset file input
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    const categoryNames = {
    recent: 'Recent',
    smileys: 'Smileys',
    hearts: 'Hearts',
    gestures: 'Gestures',
    animals: 'Animals',
    food: 'Food',
    objects: 'Objects'
  };


  return (
    <div className="p-4 w-full relative">
      {/* Image preview */}
      {imagePreview && (
        <div className=".mb-3.flex.items-center.gap-2">
         <div className="relative">
           <img 
           src={imagePreview}
           alt="Preview" 
           className="w-16 h-16 object-cover rounded-lg border border-zinc-700" 
           />
           <button 
           onClick={removeImage} 
           className="absolute -top-1.5 -right-1.5
           w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
           type="button"
           >
            <X className="w-4 h-4" />
           </button>
           </div>
         </div>
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
       <div 
          ref={emojiPickerRef}
          className="absolute bottom-16 left-4 right-4 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-lg z-50 max-w-md"
        >
          {/* Category tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-700 overflow-x-auto">
            {Object.keys(categoryNames).map((category) => (
              <button
                key={category}
                onClick={() => setActiveEmojiCategory(category)}
                className={`px-3 py-2 text-sm whitespace-nowrap ${
                  activeEmojiCategory === category
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {categoryNames[category]}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="p-3 h-48 overflow-y-auto">
            <div className="grid grid-cols-8 gap-2">
              {(activeEmojiCategory === 'recent' 
                ? recentEmojis 
                : emojiCategories[activeEmojiCategory] || []
              ).map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-xl hover:bg-gray-100 dark:hover:bg-zinc-700 rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
            {activeEmojiCategory === 'recent' && recentEmojis.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                No recent emojis
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message input area */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-zinc-700 rounded-lg"
        />
        {/* File input (hidden) */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />

        {/* Image button */}
        <button
          type="button"
          className={`hidden sm:flex btn btn-circle ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
           onClick={() => fileInputRef.current?.click()}
        >
          <Image className="size-6" />
        </button>

        {/* Emoji button */}
         <button
          type="button"
          className={`btn btn-circle ${
            showEmojiPicker ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-300'
          }`}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className="size-6" />
        </button>

        {/* Send button */}
        <button
          type="submit"
          className="btn btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput
