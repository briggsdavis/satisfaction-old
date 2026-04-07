import { motion } from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { useBlocker } from "react-router"

const COLUMNS = 6
const DURATION = 0.52
const STAGGER = 0.07

export const ColumnWipe = ({ children }: { children: React.ReactNode }) => {
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle")
  const proceedRef = useRef<(() => void) | null>(null)

  // Block navigation while idle — let the animation handle it
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      phase === "idle" &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  // Navigation intercepted → start wipe-in, stash the proceed fn
  useEffect(() => {
    if (blocker.state === "blocked") {
      proceedRef.current = blocker.proceed
      setPhase("in")
    }
  }, [blocker.state])

  // Screen fully white → navigate, then immediately begin wipe-out
  const handleInComplete = () => {
    // flushSync ensures the 'out' columns are committed to the DOM
    // (fully covering the screen) before React Router swaps the page
    flushSync(() => setPhase("out"))
    proceedRef.current?.()
    proceedRef.current = null
  }

  return (
    <>
      {children}

      {/* Wipe IN: columns drop from top, old page visible behind them */}
      {phase === "in" && (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex">
          {Array.from({ length: COLUMNS }).map((_, i) => (
            <motion.div
              key={i}
              className="h-full origin-top bg-white"
              style={{ width: `${100 / COLUMNS}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: DURATION,
                delay: i * STAGGER,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={
                i === COLUMNS - 1 ? handleInComplete : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Wipe OUT: columns retract from bottom, new page revealed */}
      {phase === "out" && (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex">
          {Array.from({ length: COLUMNS }).map((_, i) => (
            <motion.div
              key={i}
              className="h-full origin-bottom bg-white"
              style={{ width: `${100 / COLUMNS}%` }}
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{
                duration: DURATION,
                delay: i * STAGGER,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={
                i === COLUMNS - 1 ? () => setPhase("idle") : undefined
              }
            />
          ))}
        </div>
      )}
    </>
  )
}
