'use client'
import React, { useState, useRef } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { generateResponse } from '../../utils/geminiApi';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessageToBot = async (newMessage: string, intent?: string) => {
    let prompt = '';
    if (intent === 'synonyms') {
      prompt = `Tìm các từ đồng nghĩa và trái nghĩa của từ "${newMessage}" bằng tiếng Anh.`;
    } else if (intent === 'examples') {
      prompt = `Viết một ví dụ (một câu hoặc một đoạn văn ngắn) sử dụng từ hoặc liên quan đến chủ đề "${newMessage}" bằng tiếng Anh.`;
    } else if (intent === 'translate') {
      const targetLang = newMessage.toLowerCase().startsWith('dịch sang') ? 'en' : 'vi';
      const textToTranslate = newMessage.substring(newMessage.indexOf(' ') + 1);
      prompt = `Dịch đoạn văn sau sang ${targetLang}: "${textToTranslate}"`;
    } else if (intent === 'grammar') {
      prompt = `Kiểm tra lỗi ngữ pháp trong đoạn văn sau và đưa ra gợi ý sửa (nếu có) bằng tiếng Anh: "${newMessage}"`;
    } else {
      prompt = `Bạn là một trợ lý học tiếng Anh thân thiện. Hãy trả lời câu hỏi sau của người dùng bằng tiếng Anh: "${newMessage}"`;
    }

    try {
      const botResponseText = await generateResponse(prompt);
      setMessages((prevMessages) => [...prevMessages, { text: botResponseText, sender: 'bot' }]);
    } catch (error: any) {
      console.error('Lỗi khi gọi Gemini API:', error);
      setMessages((prevMessages) => [...prevMessages, { text: 'Đã có lỗi xảy ra khi xử lý yêu cầu.', sender: 'bot' }]);
    }
  };

  const handleSendMessage = async (newMessage: string) => {
    setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: 'user' }]);

    if (newMessage.toLowerCase().startsWith('synonym') || newMessage.toLowerCase().startsWith('từ đồng nghĩa')) {
      await sendMessageToBot(newMessage.split(' ').slice(1).join(' '), 'synonyms');
    } else if (newMessage.toLowerCase().startsWith('example') || newMessage.toLowerCase().startsWith('ví dụ')) {
      await sendMessageToBot(newMessage.split(' ').slice(1).join(' '), 'examples');
    } else if (newMessage.toLowerCase().startsWith('dịch')) {
      await sendMessageToBot(newMessage, 'translate');
    } else if (newMessage.toLowerCase().startsWith('check grammar') || newMessage.toLowerCase().startsWith('kiểm tra ngữ pháp')) {
      await sendMessageToBot(newMessage.split(' ').slice(2).join(' '), 'grammar');
    } else {
      await sendMessageToBot(newMessage);
    }

    setTimeout(() => {
      chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4">
      <div className="flex-grow overflow-y-auto mb-4" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;