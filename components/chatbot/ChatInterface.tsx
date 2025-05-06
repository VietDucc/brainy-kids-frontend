"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { generateResponse } from "../../utils/geminiApi";
import ReactMarkdown from "react-markdown";

interface Message {
  text: string;
  sender: "user" | "bot";
  icon?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setMessages,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatBotResponse = (response: string) => {
    // Convert ** to markdown bold
    let formattedText = response.replace(/\*\*(.*?)\*\*/g, "**$1**");

    // Add line breaks for better readability
    formattedText = formattedText.replace(/\n/g, "  \n");

    return formattedText;
  };

  const getIcon = (intent?: string) => {
    switch (intent) {
      case "synonyms":
        return "🔤";
      case "examples":
        return "📝";
      case "translate":
        return "🌐";
      case "grammar":
        return "✍️";
      default:
        return "🤖";
    }
  };

  const buildConversationContext = () => {
    const recentMessages = messages.slice(-5);
    if (recentMessages.length === 0) return "";

    return recentMessages
      .map(
        (msg) =>
          `${msg.sender === "user" ? "Người dùng" : "Trợ lý"}: ${msg.text}`
      )
      .join("\n");
  };

  const sendMessageToBot = async (newMessage: string, intent?: string) => {
    const conversationContext = buildConversationContext();
    const contextPrompt = conversationContext
      ? `Previous chat:\n${conversationContext}\n\n`
      : "";

    let prompt = "";
    if (intent === "synonyms") {
      prompt = `${contextPrompt}As a friendly teacher talking to a child, give a simple response:
1. Give 3 common synonyms for "${newMessage}" with fun emoji
2. Give 2 antonyms with emoji
3. Use very simple example sentences a child would understand
4. Add short Vietnamese meaning

Keep it fun and brief! Format like:

Similar words:
• happy 😊 (vui vẻ) - The puppy is happy!
• [2 more words...]

Opposite words:
• sad 😢 (buồn) - I was sad when it rained
• [1 more word...]`;
    } else if (intent === "examples") {
      prompt = `${contextPrompt}As a friendly teacher talking to a child:
1. Write 2 very simple English sentences using "${newMessage}"
2. Use situations a child would understand (like family, school, toys, animals)
3. Add emoji and Vietnamese meaning

Format like:
1. 🎈 I like to play with my toys!
   → Em thích chơi với đồ chơi!
2. [next sentence...]`;
    } else if (intent === "translate") {
      const targetLang = newMessage.toLowerCase().startsWith("dịch sang")
        ? "en"
        : "vi";
      prompt = `${contextPrompt}As a friendly teacher talking to a child:
1. Translate this to simple ${targetLang === "en" ? "English" : "Vietnamese"}
2. Use words a child would understand
3. Add 1-2 emoji that match the meaning

Just give:
• The translation
• Short explanation of key words
• No complex grammar points`;
    } else if (intent === "grammar") {
      prompt = `${contextPrompt}As a friendly teacher talking to a child:
1. Find the main grammar point in: "${newMessage}"
2. Show the correct way in a simple sentence
3. Explain in very basic terms with emoji

Keep it super simple! Just show:
• What needs fixing
• The correct way
• A quick tip in Vietnamese`;
    } else {
      prompt = `${contextPrompt}You're a friendly English teacher talking to a young child. For "${newMessage}":
1. Answer in 2-3 short, simple English sentences
2. Use basic words a child knows
3. Add Vietnamese meaning
4. Include 1-2 fun emoji
5. If giving examples, use topics like: family, toys, animals, food, or school

Keep everything brief and fun! No complex explanations.`;
    }

    try {
      setIsLoading(true);
      const botResponseText = await generateResponse(prompt);
      const formattedResponse = formatBotResponse(botResponseText);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: formattedResponse,
          sender: "bot",
          icon: getIcon(intent),
        },
      ]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Oops! Let's try again! 😅\nÚi! Hãy thử lại nhé!",
          sender: "bot",
          icon: "😅",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const newMessage = inputValue.trim();
    setInputValue("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, sender: "user" },
    ]);

    if (
      newMessage.toLowerCase().startsWith("synonym") ||
      newMessage.toLowerCase().startsWith("từ đồng nghĩa")
    ) {
      await sendMessageToBot(
        newMessage.split(" ").slice(1).join(" "),
        "synonyms"
      );
    } else if (
      newMessage.toLowerCase().startsWith("example") ||
      newMessage.toLowerCase().startsWith("ví dụ")
    ) {
      await sendMessageToBot(
        newMessage.split(" ").slice(1).join(" "),
        "examples"
      );
    } else if (newMessage.toLowerCase().startsWith("dịch")) {
      await sendMessageToBot(newMessage, "translate");
    } else if (
      newMessage.toLowerCase().startsWith("check grammar") ||
      newMessage.toLowerCase().startsWith("kiểm tra ngữ pháp")
    ) {
      await sendMessageToBot(
        newMessage.split(" ").slice(2).join(" "),
        "grammar"
      );
    } else {
      await sendMessageToBot(newMessage);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-grow overflow-y-auto p-4 space-y-4 dark:bg-gray-900"
        ref={chatContainerRef}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } items-end space-x-2`}
          >
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-base">
                {msg.icon || "🤖"}
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.sender === "user" ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.text}
                </p>
              ) : (
                <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-strong:text-blue-600 dark:prose-strong:text-blue-400 prose-strong:font-semibold">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
            {/* {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  You
                </span>
              </div>
            )} */}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-end space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-base">
              🤔
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 rounded-bl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce opacity-75" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100 opacity-75" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200 opacity-75" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Hãy hỏi mình bất cứ điều gì về tiếng Anh nhé! 😊"
            className="flex-grow px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl px-5 py-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
