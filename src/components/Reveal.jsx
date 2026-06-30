import { motion, useReducedMotion } from 'framer-motion'

export default function Reveal({ children, delay = 0, className = '', clip = true }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  const initial = { opacity: 0, scale: 1.08 }
  const animate = { opacity: 1, scale: 1 }
  if (clip) {
    initial.clipPath = 'inset(10% 10% 10% 10%)'
    animate.clipPath = 'inset(0% 0% 0% 0%)'
  }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
