import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSendClick = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md flex">
      <input
        type="text"
        className="flex-grow border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Nhập tin nhắn..."
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className="ml-2 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        onClick={handleSendClick}
      >
        Gửi
      </button>
    </div>
  );
};

export default InputArea;
