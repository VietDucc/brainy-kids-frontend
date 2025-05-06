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
      ? `Previous conversation:\n${conversationContext}\n\nBased on this context, `
      : "";

    let prompt = "";
    if (intent === "synonyms") {
      prompt = `${contextPrompt}You are a friendly English teacher. For the word "${newMessage}":
1. List 4-5 synonyms in English with emoji and example sentences
2. List 2-3 antonyms in English with emoji and example sentences
3. Provide a brief Vietnamese explanation for each word
Format your response like this:
**Synonyms** 🎯
1. [word] 😊 - [Vietnamese meaning]
   Example: [English sentence]
2. ...

**Antonyms** 🔄
1. [word] 😔 - [Vietnamese meaning]
   Example: [English sentence]
2. ...`;
    } else if (intent === "examples") {
      prompt = `${contextPrompt}You are a friendly English teacher. Please:
1. Write 2-3 example sentences in English using "${newMessage}"
2. Highlight the key words with **
3. Add relevant emoji
4. Provide Vietnamese translation for each sentence
Format like this:
1. [English sentence] 😊
   → [Vietnamese translation]
2. ...`;
    } else if (intent === "translate") {
      const targetLang = newMessage.toLowerCase().startsWith("dịch sang")
        ? "en"
        : "vi";
      // const textToTranslate = newMessage.substring(newMessage.indexOf(" ") + 1);
      prompt = `${contextPrompt}You are a friendly English teacher. Please:
1. Translate the text to ${targetLang === "en" ? "English" : "Vietnamese"}
2. Highlight key phrases with **
3. Add relevant emoji
4. Explain any important vocabulary or grammar points
5. If translating to English, provide pronunciation tips

Format like this:
**Translation** 🌐
[Translated text]

**Explanation** 📝
[Explanation in Vietnamese]

${
  targetLang === "en" ? "**Pronunciation Tips** 🗣️\n[Tips in Vietnamese]" : ""
}`;
    } else if (intent === "grammar") {
      prompt = `${contextPrompt}You are a friendly English teacher. For the text "${newMessage}", please:
1. Identify any grammar issues
2. Provide corrections in English
3. Explain the grammar rules in Vietnamese
4. Give additional example sentences

Format like this:
**Original Text** 📝
[Original text]

**Corrections** ✍️
[Corrected text]

**Explanation** 📚
[Vietnamese explanation]

**Examples** 💡
1. [English example]
   → [Vietnamese translation]
2. ...`;
    } else {
      prompt = `${contextPrompt}You are a friendly English teacher for children. For the question "${newMessage}":
1. Answer primarily in English, using simple and clear language
2. Add Vietnamese translations for key points
3. Use emoji to make it engaging
4. Highlight important words with **
5. If relevant, provide example sentences
6. Connect your answer with the previous conversation if applicable

Format your response with clear sections and emoji. Make it fun and educational!`;
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
          text: "Sorry, I encountered an error. Let's try again! 😅\nXin lỗi, đã có lỗi xảy ra. Hãy thử lại nhé!",
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
