"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, BookOpen, Heart, Map, Sparkles, X } from "lucide-react";
import { generateResponse } from "../../utils/geminiApi";
import ReactMarkdown from "react-markdown";

interface Message {
  text: string;
  sender: "user" | "bot";
  icon?: string;
  type?: "welcome" | "normal";
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
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [currentMode, setCurrentMode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Xin chào bé! 👋 Mình là trợ lý học tiếng Anh của bé đây!\n\nBé có thể:\n• Hỏi nghĩa của từ tiếng Anh\n• Nhờ mình kể câu chuyện vui\n• Tâm sự với mình\n• Hỏi cách học tiếng Anh hiệu quả\n• Và nhiều thứ khác nữa!\n\nHãy chọn một trong những nút bên dưới hoặc gõ câu hỏi nhé! 😊",
          sender: "bot",
          icon: "🌟",
          type: "welcome",
        },
      ]);
    }
  }, [messages.length, setMessages]);

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
      case "story":
        return "📚";
      case "translate":
        return "🌐";
      case "grammar":
        return "✍️";
      case "advice":
        return "💡";
      case "chat":
        return "💬";
      case "roadmap":
        return "🗺️";
      default:
        return "🤖";
    }
  };

  const getModeInfo = (mode: string) => {
    switch (mode) {
      case "synonyms":
        return {
          name: "Từ đồng nghĩa",
          placeholder: "Nhập từ cần tìm đồng nghĩa...",
          icon: "🔤",
        };
      case "examples":
        return {
          name: "Tạo ví dụ",
          placeholder: "Nhập từ cần tạo ví dụ...",
          icon: "📝",
        };
      case "story":
        return {
          name: "Kể chuyện",
          placeholder: "Chủ đề câu chuyện...",
          icon: "📚",
        };
      case "translate":
        return {
          name: "Dịch thuật",
          placeholder: "Nhập câu/từ cần dịch...",
          icon: "🌐",
        };
      case "grammar":
        return {
          name: "Kiểm tra ngữ pháp",
          placeholder: "Nhập câu cần kiểm tra...",
          icon: "✍️",
        };
      case "roadmap":
        return {
          name: "Lộ trình học",
          placeholder: "Hỏi về lộ trình học tiếng Anh...",
          icon: "🗺️",
        };
      case "chat":
        return {
          name: "Tâm sự",
          placeholder: "Chia sẻ cảm xúc của bé...",
          icon: "💬",
        };
      default:
        return {
          name: "Trò chuyện tự do",
          placeholder: "Hãy hỏi mình về tiếng Anh nhé! 😊",
          icon: "🤖",
        };
    }
  };

  const buildConversationContext = () => {
    const recentMessages = messages
      .slice(-8)
      .filter((msg) => msg.type !== "welcome");
    if (recentMessages.length === 0) return "";

    return recentMessages
      .map((msg) => `${msg.sender === "user" ? "Bé" : "Trợ lý"}: ${msg.text}`)
      .join("\n");
  };

  const sendMessageToBot = async (newMessage: string, intent?: string) => {
    const conversationContext = buildConversationContext();
    const contextPrompt = conversationContext
      ? `Cuộc trò chuyện trước đó:\n${conversationContext}\n\n`
      : "";

    let prompt = "";

    if (intent === "synonyms") {
      prompt = `${contextPrompt}Bạn là cô giáo tiếng Anh dễ thương. Giải thích từ "${newMessage}" NGẮN GỌN cho trẻ em:

**Từ đồng nghĩa:** 
• happy 😊 = vui vẻ 
• joyful 🎉 = hạnh phúc

**Từ trái nghĩa:**  
• sad 😢 = buồn

**Ví dụ:**
🎈 I am happy! (Em vui!)

GIỮ NGẮN GỌN, không quá 5 dòng!`;
    } else if (intent === "examples") {
      prompt = `${contextPrompt}Tạo 2 ví dụ NGẮN với từ "${newMessage}" cho trẻ em:

1. 🏠 I ${newMessage} my family! (Em yêu gia đình!)
2. 🎮 I ${newMessage} to play! (Em thích chơi!)

CHỈ 2 câu thôi, đừng dài dòng!`;
    } else if (intent === "story") {
      prompt = `${contextPrompt}Kể câu chuyện NGẮN (50-80 từ) về "${newMessage}" cho trẻ em:

Once upon a time... (Ngày xưa...)
[Câu chuyện ngắn với emoji]

Hỏi: "Bé thích chuyện này không? 😊"

GIỮ NGẮN, trẻ em dễ đọc!`;
    } else if (intent === "translate") {
      prompt = `${contextPrompt}Dịch NGẮN GỌN cho trẻ em:

**Dịch:** ${newMessage} = [bản dịch]
**Ví dụ:** [1 câu đơn giản]

CHỈ 2-3 dòng thôi!`;
    } else if (intent === "grammar") {
      prompt = `${contextPrompt}Sửa ngữ pháp NGẮN cho trẻ em:

**Câu gốc:** ${newMessage}
**Câu đúng:** [sửa lại]
**Lý do:** [1 dòng giải thích]

GIỮ NGẮN GỌN!`;
    } else if (intent === "roadmap") {
      prompt = `${contextPrompt}Tư vấn học tiếng Anh NGẮN cho trẻ:

**Bước 1:** Học từ vựng cơ bản
**Bước 2:** Nghe nhạc tiếng Anh  
**Bước 3:** Nói chuyện đơn giản

**Mẹo:** Học 15 phút/ngày! 

CHỈ VÀI DÒNG NGẮN THÔI!`;
    } else if (intent === "chat") {
      prompt = `${contextPrompt}Bạn là người bạn tốt của trẻ em. Trả lời "${newMessage}" NGẮN GỌN và ấm áp:

- Thấu hiểu cảm xúc 
- 1-2 câu động viên
- Hỏi thêm (nếu cần)
- Kết thúc bằng emoji ấm áp

CHỈ 2-3 DÒNG NGẮN! Đừng viết dài như luận văn!`;
    } else {
      prompt = `${contextPrompt}Bạn là trợ lý tiếng Anh cho trẻ em. Trả lời "${newMessage}" NGẮN GỌN:

- 1-2 câu tiếng Anh đơn giản
- Dịch tiếng Việt
- 1-2 emoji vui

CHỈ 3-4 DÒNG NGẮN! Trẻ em phải đọc được!`;
    }

    try {
      setIsLoading(true);
      setShowQuickActions(false);
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
          text: "Ôi không! Có lỗi rồi! 😅\nBé thử lại nhé! 💫",
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

    // If in a specific mode, use that mode
    if (currentMode) {
      await sendMessageToBot(newMessage, currentMode);
    } else {
      // Smart intent detection with Vietnamese support for free chat
      const lowerMessage = newMessage.toLowerCase();

      if (
        lowerMessage.includes("đồng nghĩa") ||
        lowerMessage.includes("synonym") ||
        lowerMessage.startsWith("synonym ") ||
        lowerMessage.startsWith("từ đồng nghĩa ")
      ) {
        const word =
          newMessage.split(" ").slice(1).join(" ") ||
          newMessage.split("của ")[1] ||
          newMessage.split("cho ")[1];
        await sendMessageToBot(word, "synonyms");
      } else if (
        lowerMessage.includes("ví dụ") ||
        lowerMessage.includes("example") ||
        lowerMessage.startsWith("example ") ||
        lowerMessage.startsWith("ví dụ ")
      ) {
        const word =
          newMessage.split(" ").slice(1).join(" ") ||
          newMessage.split("của ")[1] ||
          newMessage.split("cho ")[1];
        await sendMessageToBot(word, "examples");
      } else if (
        lowerMessage.includes("dịch") ||
        lowerMessage.includes("translate")
      ) {
        await sendMessageToBot(
          newMessage.replace(/dịch\s*|translate\s*/gi, ""),
          "translate"
        );
      } else if (
        lowerMessage.includes("kiểm tra") ||
        lowerMessage.includes("sửa") ||
        lowerMessage.includes("grammar") ||
        lowerMessage.includes("ngữ pháp")
      ) {
        const sentence = newMessage.replace(
          /kiểm tra\s*|sửa\s*|grammar\s*|ngữ pháp\s*/gi,
          ""
        );
        await sendMessageToBot(sentence, "grammar");
      } else if (
        lowerMessage.includes("câu chuyện") ||
        lowerMessage.includes("kể chuyện") ||
        lowerMessage.includes("story")
      ) {
        await sendMessageToBot(newMessage, "story");
      } else if (
        lowerMessage.includes("lộ trình") ||
        lowerMessage.includes("học") ||
        lowerMessage.includes("roadmap") ||
        lowerMessage.includes("plan")
      ) {
        await sendMessageToBot(newMessage, "roadmap");
      } else if (
        lowerMessage.includes("buồn") ||
        lowerMessage.includes("vui") ||
        lowerMessage.includes("sợ") ||
        lowerMessage.includes("tâm sự") ||
        lowerMessage.includes("cảm thấy")
      ) {
        await sendMessageToBot(newMessage, "chat");
      } else {
        await sendMessageToBot(newMessage);
      }
    }
  };

  const handleQuickAction = (action: string, message: string) => {
    setCurrentMode(action);
    setShowQuickActions(false);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "user" },
    ]);
    sendMessageToBot(message, action);
  };

  const selectMode = (mode: string) => {
    setCurrentMode(mode);
    setShowModeMenu(false);
    setShowQuickActions(false);
  };

  const quickActions = [
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Từ đồng nghĩa",
      action: () => handleQuickAction("synonyms", "happy"),
      color: "from-blue-500 to-cyan-500",
      mode: "synonyms",
    },
    {
      icon: <Sparkles className="h-4 w-4" />,
      label: "Câu chuyện vui",
      action: () =>
        handleQuickAction("story", "Kể cho em một câu chuyện vui về động vật"),
      color: "from-purple-500 to-pink-500",
      mode: "story",
    },
    {
      icon: <Heart className="h-4 w-4" />,
      label: "Tâm sự",
      action: () => handleQuickAction("chat", "Em hôm nay cảm thấy hơi buồn"),
      color: "from-red-500 to-orange-500",
      mode: "chat",
    },
    {
      icon: <Map className="h-4 w-4" />,
      label: "Lộ trình học",
      action: () =>
        handleQuickAction("roadmap", "Tư vấn lộ trình học tiếng Anh cho em"),
      color: "from-green-500 to-teal-500",
      mode: "roadmap",
    },
  ];

  const allModes = [
    {
      key: null,
      name: "Trò chuyện tự do",
      icon: "🤖",
      description: "Hỏi bất cứ điều gì về tiếng Anh",
    },
    {
      key: "synonyms",
      name: "Từ đồng nghĩa",
      icon: "🔤",
      description: "Tìm từ đồng nghĩa và trái nghĩa",
    },
    {
      key: "examples",
      name: "Tạo ví dụ",
      icon: "📝",
      description: "Tạo câu ví dụ với từ vựng",
    },
    {
      key: "story",
      name: "Kể chuyện",
      icon: "📚",
      description: "Nghe câu chuyện vui bằng tiếng Anh",
    },
    {
      key: "translate",
      name: "Dịch thuật",
      icon: "🌐",
      description: "Dịch Việt ↔ Anh",
    },
    {
      key: "grammar",
      name: "Kiểm tra ngữ pháp",
      icon: "✍️",
      description: "Sửa lỗi ngữ pháp",
    },
    {
      key: "chat",
      name: "Tâm sự",
      icon: "💬",
      description: "Trò chuyện và chia sẻ cảm xúc",
    },
    {
      key: "roadmap",
      name: "Lộ trình học",
      icon: "🗺️",
      description: "Tư vấn cách học tiếng Anh hiệu quả",
    },
  ];

  const modeInfo = getModeInfo(currentMode || "");

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div
        className="flex-grow overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
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
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">
                {msg.icon || "🤖"}
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none shadow-md"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.sender === "user" ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.text}
                </p>
              ) : (
                <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-strong:text-blue-600 dark:prose-strong:text-blue-400 prose-strong:font-semibold prose-ul:my-2 prose-li:my-0">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        {showQuickActions && messages.length <= 1 && (
          <div className="flex flex-col space-y-3 px-2">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
              ✨ Bé muốn làm gì hôm nay?
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMode(action.mode)}
                  className={`flex items-center justify-center space-x-2 p-3 sm:p-4 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm font-medium`}
                >
                  {action.icon}
                  <span className="text-xs sm:text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start items-end space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm sm:text-base">
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

      <div className="p-3 sm:p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          {/* Mode Selector Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModeMenu(!showModeMenu)}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-lg"
              title={`Chế độ hiện tại: ${modeInfo.name}`}
            >
              {modeInfo.icon}
            </button>

            {/* Compact Mode Menu */}
            {showModeMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Chọn chế độ
                    </span>
                    <button
                      onClick={() => setShowModeMenu(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="p-1">
                  {allModes.map((mode) => (
                    <button
                      key={mode.key || "free"}
                      onClick={() => selectMode(mode.key)}
                      className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left ${
                        currentMode === mode.key
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : ""
                      }`}
                    >
                      <span className="text-base">{mode.icon}</span>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {mode.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {mode.description}
                        </p>
                      </div>
                      {currentMode === mode.key && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={modeInfo.placeholder}
            className="flex-grow px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl px-4 py-2 sm:px-5 sm:py-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
