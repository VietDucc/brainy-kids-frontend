export interface Voice {
    id: number
    voiceUrl: string
    pageIndex: number
  }
  
  export interface Book {
    id: number
    title: string
    pdfUrl: string
    voices: Voice[]
  }
  
  