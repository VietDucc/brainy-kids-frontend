import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format seconds to mm:ss or hh:mm:ss format
export function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "00:00"
  
  const date = new Date(seconds * 1000)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const secs = date.getUTCSeconds()
  
  if (hours) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

export const themes = [
  { 
    name: "animals", 
    words: ["dog", "cat", "bird", "fish", "elephant", "lion", "tiger", "bear", "rabbit", "snake"],
    icon: "🦁",
  },
  { 
    name: "colors", 
    words: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "black", "white", "brown"],
    icon: "🎨",
  },
  { 
    name: "fruits", 
    words: ["apple", "banana", "orange", "grape", "strawberry", "watermelon", "pineapple", "mango", "peach", "pear"],
    icon: "🍎",
  },
  { 
    name: "numbers", 
    words: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
    icon: "🔢",
  },
  { 
    name: "family", 
    words: ["mother", "father", "sister", "brother", "grandmother", "grandfather", "aunt", "uncle", "cousin", "baby"],
    icon: "👪",
  },
  { 
    name: "body", 
    words: ["head", "eye", "nose", "mouth", "ear", "hand", "foot", "leg", "arm", "hair"],
    icon: "👤",
  },
  { 
    name: "clothes", 
    words: ["shirt", "pants", "dress", "hat", "shoe", "sock", "jacket", "skirt", "coat", "scarf"],
    icon: "👕",
  },
  { 
    name: "food", 
    words: ["bread", "rice", "egg", "meat", "cheese", "soup", "cake", "pizza", "sandwich", "chicken"],
    icon: "🍲",
  },
]
