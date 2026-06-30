import { motion, useReducedMotion } from 'framer-motion'

export default function FloatingBlob({ className = '', size = 400, duration = 10, opacity = 0.3 }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none blur-3xl bg-bronze ${className}`}
      style={{ width: size, height: size, opacity }}
      animate={reduceMotion ? undefined : { y: [0, -24, 0], x: [0, 12, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
