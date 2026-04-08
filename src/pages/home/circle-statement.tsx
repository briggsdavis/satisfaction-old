import { motion } from "motion/react"
import { TextReveal } from "../../components/text-reveal"

const CIRCLE_RING_TEXT =
  "Creative Direction · Brand Strategy · Videography · Photography · Graphic Design · "

export const CircleStatement = () => (
  <section className="flex items-center justify-center border-t border-white/10 bg-black px-8 py-32 md:px-16">
    <div
      className="relative"
      style={{ width: "min(640px, 92vw)", height: "min(640px, 92vw)" }}
    >
      {/* Rotating ring text via SVG */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 640 640"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="ring-path"
            d="M 320 320 m -275 0 a 275 275 0 1 1 550 0 a 275 275 0 1 1 -550 0"
          />
        </defs>
        <text
          fill="white"
          fontSize="11.5"
          letterSpacing="4"
          fontFamily="Inter Variable, Inter, sans-serif"
          fontWeight="700"
          style={{ textTransform: "uppercase" }}
        >
          <textPath href="#ring-path">{CIRCLE_RING_TEXT.repeat(4)}</textPath>
        </text>
      </motion.svg>

      {/* Static circle border */}
      <div className="absolute inset-[6%] rounded-full border border-white/10" />

      {/* Top + bottom cross markers */}
      <span className="absolute top-[8%] left-1/2 -translate-x-1/2 text-xs text-white/30 select-none">
        +
      </span>
      <span className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-xs text-white/30 select-none">
        +
      </span>

      {/* Small satellite labels */}
      <div className="pointer-events-none absolute top-[22%] left-1/2 -translate-x-1/2 text-center">
        <span className="font-mono text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Social Satisfaction
        </span>
        <span className="massive-text mt-1 block text-sm leading-none">
          FEEL?
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-[22%] left-1/2 -translate-x-1/2 text-center">
        <span className="massive-text mb-1 block text-sm leading-none">
          FEEL?
        </span>
        <span className="font-mono text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          Marketing Agency
        </span>
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-16 text-center">
        <span className="text-xs leading-none text-white/15">◆</span>
        <TextReveal
          text="WHAT DO YOU WANT PEOPLE TO FEEL?"
          className="massive-text justify-center text-sm leading-[0.95] md:text-xl"
        />
        <span className="text-xs leading-none text-white/15">◆</span>
      </div>
    </div>
  </section>
)
