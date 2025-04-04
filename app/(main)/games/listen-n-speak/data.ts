export interface Word {
  text: string;
  difficulty: "easy" | "medium" | "hard";
  translation?: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  words: Word[];
}

export const categories: Category[] = [
  {
    id: "basic-greetings",
    title: "Basic Greetings",
    description: "Learn common greetings and basic expressions",
    icon: "👋",
    color: "from-pink-500 to-rose-500",
    words: [
      { text: "Hello", difficulty: "easy", translation: "Xin chào" },
      { text: "Good morning", difficulty: "easy", translation: "Chào buổi sáng" },
      { text: "Good afternoon", difficulty: "easy", translation: "Chào buổi chiều" },
      { text: "Good evening", difficulty: "easy", translation: "Chào buổi tối" },
      { text: "How are you", difficulty: "easy", translation: "Bạn khỏe không" },
      { text: "Nice to meet you", difficulty: "medium", translation: "Rất vui được gặp bạn" },
      { text: "See you later", difficulty: "medium", translation: "Hẹn gặp lại" },
      { text: "Have a nice day", difficulty: "medium", translation: "Chúc một ngày tốt lành" },
      { text: "Thank you very much", difficulty: "medium", translation: "Cảm ơn rất nhiều" },
      { text: "You're welcome", difficulty: "medium", translation: "Không có gì" },
    ]
  },
  {
    id: "animals",
    title: "Animals",
    description: "Learn animal names and sounds",
    icon: "🐘",
    color: "from-green-500 to-emerald-500",
    words: [
      { text: "Cat", difficulty: "easy", translation: "Con mèo" },
      { text: "Dog", difficulty: "easy", translation: "Con chó" },
      { text: "Elephant", difficulty: "medium", translation: "Con voi" },
      { text: "Lion", difficulty: "easy", translation: "Con sư tử" },
      { text: "Monkey", difficulty: "easy", translation: "Con khỉ" },
      { text: "Giraffe", difficulty: "medium", translation: "Con hươu cao cổ" },
      { text: "Penguin", difficulty: "medium", translation: "Chim cánh cụt" },
      { text: "Butterfly", difficulty: "medium", translation: "Con bướm" },
      { text: "Kangaroo", difficulty: "hard", translation: "Con kangaroo" },
      { text: "Hippopotamus", difficulty: "hard", translation: "Con hà mã" },
    ]
  },
  {
    id: "fruits",
    title: "Fruits",
    description: "Learn names of delicious fruits",
    icon: "🍎",
    color: "from-orange-500 to-amber-500",
    words: [
      { text: "Apple", difficulty: "easy", translation: "Quả táo" },
      { text: "Banana", difficulty: "easy", translation: "Quả chuối" },
      { text: "Orange", difficulty: "easy", translation: "Quả cam" },
      { text: "Grape", difficulty: "easy", translation: "Quả nho" },
      { text: "Strawberry", difficulty: "medium", translation: "Quả dâu tây" },
      { text: "Watermelon", difficulty: "medium", translation: "Quả dưa hấu" },
      { text: "Pineapple", difficulty: "medium", translation: "Quả dứa" },
      { text: "Mango", difficulty: "easy", translation: "Quả xoài" },
      { text: "Pomegranate", difficulty: "hard", translation: "Quả lựu" },
      { text: "Dragon fruit", difficulty: "medium", translation: "Quả thanh long" },
    ]
  },
  {
    id: "colors",
    title: "Colors",
    description: "Learn beautiful color names",
    icon: "🌈",
    color: "from-blue-500 to-cyan-500",
    words: [
      { text: "Red", difficulty: "easy", translation: "Màu đỏ" },
      { text: "Blue", difficulty: "easy", translation: "Màu xanh dương" },
      { text: "Green", difficulty: "easy", translation: "Màu xanh lá" },
      { text: "Yellow", difficulty: "easy", translation: "Màu vàng" },
      { text: "Purple", difficulty: "easy", translation: "Màu tím" },
      { text: "Orange", difficulty: "easy", translation: "Màu cam" },
      { text: "Brown", difficulty: "easy", translation: "Màu nâu" },
      { text: "Pink", difficulty: "easy", translation: "Màu hồng" },
      { text: "Gray", difficulty: "easy", translation: "Màu xám" },
      { text: "White", difficulty: "easy", translation: "Màu trắng" },
    ]
  },
  {
    id: "family",
    title: "Family Members",
    description: "Learn family relationship words",
    icon: "👨‍👩‍👧‍👦",
    color: "from-purple-500 to-violet-500",
    words: [
      { text: "Mother", difficulty: "easy", translation: "Mẹ" },
      { text: "Father", difficulty: "easy", translation: "Bố" },
      { text: "Sister", difficulty: "easy", translation: "Chị/Em gái" },
      { text: "Brother", difficulty: "easy", translation: "Anh/Em trai" },
      { text: "Grandmother", difficulty: "medium", translation: "Bà" },
      { text: "Grandfather", difficulty: "medium", translation: "Ông" },
      { text: "Uncle", difficulty: "easy", translation: "Chú/Bác" },
      { text: "Aunt", difficulty: "easy", translation: "Cô/Dì" },
      { text: "Cousin", difficulty: "medium", translation: "Anh/Chị/Em họ" },
      { text: "Baby", difficulty: "easy", translation: "Em bé" },
    ]
  }
]; 