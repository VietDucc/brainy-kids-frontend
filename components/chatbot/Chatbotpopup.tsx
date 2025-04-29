'use client'
import React, { useState } from 'react';
import ChatInterface from './ChatInterface';

const ChatbotPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="fixed bottom-4 right-4 bg-white rounded-md shadow-lg w-96 h-[60vh] flex flex-col overflow-hidden">
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chatbot Hỗ Trợ</h2>
            <button onClick={toggleChatbot} className="text-white hover:text-blue-200 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            <ChatInterface />
          </div>
        </div>
      )}
      <button
        onClick={toggleChatbot}
        className={`bg-blue-500 text-white rounded-full p-3 shadow-md hover:bg-blue-600 focus:outline-none ${
          isOpen ? 'hidden' : 'block'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatbotPopup;