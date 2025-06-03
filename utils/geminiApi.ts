import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyA3o-klkke_8AiOUvCQwU-1SHoKAKQ8gTw'); 
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function generateResponse(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response?.text();
    return response || 'Không có phản hồi từ AI.';
  } catch (error: any) {
    console.error('Lỗi khi gọi Gemini API:', error);
    return 'Đã có lỗi xảy ra khi xử lý yêu cầu.';
  }
}

export { generateResponse };