// components/Tooltip.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 300
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()

        const positions = {
          top: { x: rect.left + rect.width / 2, y: rect.top - 8 },
          bottom: { x: rect.left + rect.width / 2, y: rect.bottom + 8 },
          left: { x: rect.left - 8, y: rect.top + rect.height / 2 },
          right: { x: rect.right + 8, y: rect.top + rect.height / 2 }
        }

        setCoords(positions[position])
        setIsVisible(true)
      }
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible && createPortal(
        <div
          className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg pointer-events-none animate-in fade-in zoom-in-95"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            transform: position === 'top' || position === 'bottom'
              ? 'translateX(-50%)'
              : 'translateY(-50%)'
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}