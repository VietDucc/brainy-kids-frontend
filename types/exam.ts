export interface QuestionOption {
    id: number
    answers: string
    correct: boolean
    imgSrc: string | null
    audioSrc: string | null
  }
  
  export interface Question {
    id: number
    type: string
    question: string | null
    description: string | null
    imgSrc: string | null
    questionOrder: number
    questionOptions: QuestionOption[]
  }
  
  export interface Part {
    id: number
    description: string
    partOrder: number
    partNumber: number
    type: string
    audioSrc?: string // Optional audio for the entire part
    questions: Question[]
  }
  
  export interface Exam {
    id: number
    name: string
    description: string
    voice: string
    parts: Part[]
  }
  