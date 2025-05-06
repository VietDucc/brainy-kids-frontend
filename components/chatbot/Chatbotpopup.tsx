"use client";
import React, { useState } from "react";
import ChatInterface from "./ChatInterface";
import { MessageCircle, X } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatbotPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="fixed bottom-20 right-4 bg-white rounded-2xl shadow-2xl w-[400px] h-[600px] flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                English Learning Assistant
              </h2>
            </div>
            <button
              onClick={toggleChatbot}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-grow overflow-hidden bg-gray-50">
            <ChatInterface messages={messages} setMessages={setMessages} />
          </div>
        </div>
      )}
      <button
        onClick={toggleChatbot}
        className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-3 shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatbotPopup;
