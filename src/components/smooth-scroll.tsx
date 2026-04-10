import {
  motion,
  MotionValue,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
} from "react"

const SmoothScrollContext = createContext<MotionValue<number> | null>(null)

export const useSmoothScroll = () => useContext(SmoothScrollContext)

export const SmoothScrollProvider = ({
  children,
}: {
  children: React.ReactNode
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

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState(0)
  const smoothY = useSmoothScroll()

  // useLayoutEffect so the spacer height is committed synchronously before the
  // first browser paint. Without this the page starts with height 0, which can
  // let browser scroll-restoration fire a scroll jump before the spacer is
  // ready — causing the spring to chase a non-zero target from a 0 start and
  // the content to visually disappear for a moment.
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const observer = new ResizeObserver(() => {
      setContentHeight(el.scrollHeight)
    })
    observer.observe(el)
    setContentHeight(el.scrollHeight)

    return () => observer.disconnect()
  }, [])

  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY
  const transform = useTransform(activeY, (y) => -y)

  return (
    <>
      <div style={{ height: contentHeight }} />
      <motion.div
        ref={scrollRef}
        style={{ y: transform }}
        className="fixed top-0 left-0 z-[2] w-full will-change-transform"
      >
        {children}
      </motion.div>
    </>
  )
}
