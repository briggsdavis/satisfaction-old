import { MotionValue, useScroll, useSpring } from "motion/react"
import { createContext, useContext, type ReactNode } from "react"

const SmoothScrollContext = createContext<MotionValue<number> | null>(null)

export const useSmoothScroll = () => useContext(SmoothScrollContext)

export const SmoothScrollProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { scrollY } = useScroll()
  const smoothY = useSpring(scrollY, {
    damping: 38,
    stiffness: 280,
    mass: 0.7,
    restDelta: 0.001,
  })

  return (
    <SmoothScrollContext.Provider value={smoothY}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

// Passthrough wrapper. Previously this rendered a fixed, transformed content
// div with a dynamic spacer to fake-scroll the page — but that caused content
// to flash and disappear on first load (transform stacking-context + ResizeObserver
// race between initial 0 height and the real measurement). Native scroll is
// simpler and reliable. The smoothY spring in SmoothScrollProvider still drives
// parallax effects downstream (useSmoothScroll).
export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}
