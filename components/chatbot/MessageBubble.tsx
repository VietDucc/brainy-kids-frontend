import React from 'react';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'bot';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
  const isUser = sender === 'user';
  return (
    <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-lg p-3 text-white ${
          isUser ? 'bg-blue-500' : 'bg-gray-400'
        } max-w-xs break-words`}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;