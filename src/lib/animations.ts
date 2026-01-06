// lib/animations.ts
export const animations = {
  // Fade
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  // Slide
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  
  // Scale
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },
  
  // Bounce
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  }
}

export const transitions = {
  fast: { duration: 0.2 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: { type: 'spring', stiffness: 300, damping: 30 }
}