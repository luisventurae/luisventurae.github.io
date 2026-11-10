import type { Transition } from 'motion/react'

/** Springs from docs/design-system.md › Motion. */
export const SPRING_PLAYFUL: Transition = { type: 'spring', duration: 0.5, bounce: 0.3 }
export const SPRING_SNAPPY: Transition = { type: 'spring', duration: 0.35, bounce: 0.1 }
export const SPRING_TILT = { stiffness: 150, damping: 15 } as const
