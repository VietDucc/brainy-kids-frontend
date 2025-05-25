export const GA_TRACKING_ID = 'G-8QN6TXH5QG' // Thay bằng ID của bạn

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

export const trackEvents = {
  lessonComplete: (lessonId: string, score: number) => {
    event({
      action: 'lesson_complete',
      category: 'Learning',
      label: lessonId,
      value: score
    })
  },
  
  gameStart: (gameId: string) => {
    event({
      action: 'game_start',
      category: 'Gaming',
      label: gameId
    })
  },

  quizComplete: (quizId: string, score: number) => {
    event({
      action: 'quiz_complete', 
      category: 'Assessment',
      label: quizId,
      value: score
    })
  },

  articleRead: (articleId: string) => {
    event({
      action: 'article_read',
      category: 'Content',
      label: articleId
    })
  }
} 