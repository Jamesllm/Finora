// components/AnimatedCard.tsx
'use client'

import { motion } from 'framer-motion'
import { animations, transitions } from '@/lib/animations'

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  animation?: keyof typeof animations
}

export function AnimatedCard({ 
  children, 
  delay = 0,
  animation = 'slideUp'
}: AnimatedCardProps) {
  return (
    <motion.div
      {...animations[animation]}
      transition={{ ...transitions.normal, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}