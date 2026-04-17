import {
  MotionValue,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useSmoothScroll } from "../components/smooth-scroll"

// ─── Data ─────────────────────────────────────────────────────────────────────
const STAFF = [
  {
    id: 1,
    name: "Devon Colebank",
    role: "Founder & Creative Director",
    expertise: ["Creative Direction", "Brand Strategy", "Visual Identity"],
    bio: "The visionary behind Social Satisfaction. Devon built this agency from a single belief: that storytelling is the only currency that matters in the attention economy.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Maya Chen",
    role: "Senior Brand Strategist",
    expertise: ["Brand Development", "Market Research", "Campaign Planning"],
    bio: "Maya turns data into narrative. With a background in cultural anthropology, she understands not just what audiences want — but why.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "James Wu",
    role: "Lead Videographer",
    expertise: ["Cinematography", "Post Production", "Motion Graphics"],
    bio: "James frames the world differently. Every shot is a decision — light, angle, timing. His work has been described as 'cinema for the scroll.'",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Sofia Reyes",
    role: "Social Media Director",
    expertise: ["Content Strategy", "Community Management", "Analytics"],
    bio: "Sofia doesn't just grow followings — she builds communities. Her campaigns generate conversation, not just impressions.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    name: "Kai Thompson",
    role: "Motion Designer",
    expertise: ["Animation", "UI Motion", "3D Visualization"],
    bio: "Kai believes every interface is a performance. Motion is the bridge between static design and living brand experience.",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    name: "Priya Patel",
    role: "Account Director",
    expertise: ["Client Relations", "Project Management", "Growth Strategy"],
    bio: "Priya is the architect of trust. She ensures every client relationship evolves from transaction to long-term partnership.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

// ─── helpers to derive per-item opacity breakpoints ───────────────────────────
function itemOpacity(index: number, n: number, progress: MotionValue<number>) {
  const fade = 0.07
  const leftBound = index === 0 ? 0 : (2 * index - 1) / (2 * (n - 1))
  const rightBound = index === n - 1 ? 1 : (2 * index + 1) / (2 * (n - 1))

  const input =
    index === 0
      ? [0, Math.max(0, rightBound - fade), rightBound]
      : index === n - 1
        ? [leftBound, Math.min(1, leftBound + fade), 1]
        : [leftBound, leftBound + fade, rightBound - fade, rightBound]
  const output =
    index === 0 ? [1, 1, 0] : index === n - 1 ? [0, 1, 1] : [0, 1, 1, 0]

  return { input, output, opacity: useTransform(progress, input, output) } // eslint-disable-line react-hooks/rules-of-hooks
}

// ─── GhostName — large faint name behind left-panel text ─────────────────────
const GhostName = ({
  member,
  index,
  n,
  progress,
}: {
  member: (typeof STAFF)[0]
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  const { input, output } = itemOpacity(index, n, progress)
  const opacity = useTransform(progress, input, output.map((o) => o * 0.045))
  const firstName = member.name.split(" ")[0]

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <p
        className="massive-text select-none text-center font-bold uppercase text-white"
        style={{ fontSize: "clamp(5rem, 14vw, 16rem)", lineHeight: 0.85 }}
      >
        {firstName}
      </p>
    </motion.div>
  )
}

// ─── ProgressDot ─────────────────────────────────────────────────────────────
const ProgressDot = ({
  index,
  n,
  progress,
}: {
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  const center = n === 1 ? 0 : index / (n - 1)
  const dotOpacity = useTransform(
    progress,
    [Math.max(0, center - 0.3), center, Math.min(1, center + 0.3)],
    [0.2, 1, 0.2],
  )
  const dotScale = useTransform(
    progress,
    [Math.max(0, center - 0.3), center, Math.min(1, center + 0.3)],
    [0.7, 1.5, 0.7],
  )
  return (
    <motion.div
      className="h-1.5 w-1.5 rounded-full bg-white"
      style={{ opacity: dotOpacity, scale: dotScale }}
    />
  )
}

// ─── ActiveCounter — "01 / 06" ────────────────────────────────────────────────
const ActiveCounter = ({
  progress,
  n,
}: {
  progress: MotionValue<number>
  n: number
}) => {
  const [idx, setIdx] = useState(0)
  useEffect(
    () =>
      progress.on("change", (v) =>
        setIdx(Math.min(n - 1, Math.round(v * (n - 1)))),
      ),
    [progress, n],
  )
  return (
    <span className="font-mono text-xs tracking-[0.35em] text-white/30">
      <span className="text-white/60">{String(idx + 1).padStart(2, "0")}</span>
      {" / "}
      {String(n).padStart(2, "0")}
    </span>
  )
}

// ─── Ticker bar — scrolls through all names at the bottom ────────────────────
const TickerName = ({
  member,
  index,
  n,
  progress,
}: {
  member: (typeof STAFF)[0]
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  const center = n === 1 ? 0 : index / (n - 1)
  const scaleX = useTransform(
    progress,
    [Math.max(0, center - 0.25), center, Math.min(1, center + 0.25)],
    [0.85, 1, 0.85],
  )
  const op = useTransform(
    progress,
    [Math.max(0, center - 0.25), center, Math.min(1, center + 0.25)],
    [0.2, 1, 0.2],
  )
  return (
    <motion.span
      style={{ scaleX, opacity: op }}
      className="inline-block origin-left font-mono text-[10px] font-bold tracking-[0.35em] uppercase transition-colors"
    >
      {member.name}
    </motion.span>
  )
}

// ─── StaffCard ────────────────────────────────────────────────────────────────
const StaffCard = ({
  member,
  index,
  n,
  progress,
}: {
  member: (typeof STAFF)[0]
  index: number
  n: number
  progress: MotionValue<number>
}) => {
  const center = n === 1 ? 0 : index / (n - 1)
  const { input, output } = itemOpacity(index, n, progress)

  const opacity = useTransform(progress, input, output)
  const yVal = useTransform(progress, [0, 1], [center * -50, (center - 1) * -50])
  const scale = useTransform(progress, input, output.map((o) => 0.93 + o * 0.07))

  // Subtle parallax inside the photo
  const photoY = useTransform(
    progress,
    [0, 1],
    [`${center * -18}%`, `${(center - 1) * -18}%`],
  )

  return (
    <motion.div
      style={{ opacity, y: yVal, scale }}
      className="absolute inset-0 flex items-center justify-center px-8 md:px-10"
    >
      <div className="w-full max-w-[280px] md:max-w-sm">
        {/* Photo container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.img
            src={member.img}
            alt={member.name}
            loading="lazy"
            className="absolute inset-0 h-[120%] w-full object-cover will-change-transform [backface-visibility:hidden]"
            style={{ y: photoY, top: "-10%" }}
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* Scanline texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
            }}
            aria-hidden
          />

          {/* Index badge */}
          <div className="absolute top-4 right-4">
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-white/25">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Name + role */}
          <div className="absolute bottom-5 left-5 right-5">
            <p className="mb-1.5 font-mono text-[10px] font-bold tracking-[0.35em] text-white/50 uppercase">
              {member.role}
            </p>
            <h3 className="massive-text text-2xl font-bold uppercase text-white md:text-3xl">
              {member.name}
            </h3>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-xs leading-relaxed text-white/40">{member.bio}</p>

        {/* Expertise tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.expertise.map((tag) => (
            <span
              key={tag}
              className="border border-white/15 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-white/35 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Staff page ───────────────────────────────────────────────────────────────
export const Staff = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const wrapperTopRef = useRef(0)
  const pinDistRef = useRef(0)
  const [pinDist, setPinDist] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const n = STAFF.length

  useEffect(() => {
    const measure = () => {
      const dist = window.innerHeight * (n - 1)
      pinDistRef.current = dist
      setPinDist(dist)
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      }
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    const ro = new ResizeObserver(() => requestAnimationFrame(measure))
    ro.observe(document.documentElement)
    return () => {
      window.removeEventListener("resize", measure)
      ro.disconnect()
    }
  }, [smoothY, n])

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistRef.current
    if (D === 0 || y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const progress = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistRef.current
    if (D === 0 || y <= T) return 0
    if (y >= T + D) return 1
    return (y - T) / D
  })

  // Progress bar fill (bottom of left panel)
  const progressBarHeight = useTransform(progress, [0, 1], ["0%", "100%"])

  return (
    <div className="bg-bg text-fg">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[55vh] items-end px-8 pb-16 pt-32 md:px-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-4 font-mono text-xs font-bold tracking-[0.4em] text-white/30 uppercase"
          >
            Social Satisfaction — Our People
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="massive-text text-[clamp(4rem,10vw,9rem)] font-bold uppercase leading-[0.88]"
          >
            The
            <br />
            <span className="text-white/25">Minds</span>
            <br />
            Behind
            <br />
            It All
          </motion.h1>
        </div>

        {/* decorative bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="absolute right-8 bottom-6 flex items-center gap-3 md:right-16"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-white/25 uppercase">
            Scroll to meet them
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-px w-8 bg-white/25"
          />
        </motion.div>
      </section>

      {/* ── Sticky scroll section ─────────────────────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `calc(${pinDist}px + 100vh)` }}
      >
        <motion.div style={{ y: pinY }} className="relative h-screen">

          {/* ── Left panel — static text ── */}
          <div className="absolute inset-y-0 left-0 flex w-full flex-col justify-center border-r border-white/10 px-8 md:w-[45%] md:px-16">

            {/* Ghost name behind text */}
            {STAFF.map((member, i) => (
              <GhostName
                key={member.id}
                member={member}
                index={i}
                n={n}
                progress={progress}
              />
            ))}

            {/* Vertical progress bar on right border */}
            <div className="absolute top-0 right-0 h-full w-px overflow-hidden">
              <motion.div
                className="w-full bg-white/70"
                style={{ height: progressBarHeight }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-sm">
              <p className="mb-5 font-mono text-xs font-bold tracking-[0.4em] text-white/25 uppercase">
                Meet The Team
              </p>

              <h2 className="massive-text mb-8 text-[clamp(2.5rem,4.5vw,4rem)] font-bold uppercase leading-[0.88]">
                Exceptional
                <br />
                <span className="text-white/25">People.</span>
                <br />
                Unmatched
                <br />
                Craft.
              </h2>

              <p className="mb-4 text-sm leading-relaxed text-white/55">
                Every person on this team was chosen for one reason: they are
                extraordinary at what they do. We don't hire good — we hire
                obsessed. Obsessed with craft, with culture, with the relentless
                pursuit of work that actually means something.
              </p>
              <p className="mb-10 text-sm leading-relaxed text-white/35">
                Years of dedicated training, instinct sharpened through real
                experience, and a hunger that cannot be taught. This is the team
                that turns your brand into a movement.
              </p>

              {/* Counter + dots */}
              <div className="flex items-center gap-5">
                <ActiveCounter progress={progress} n={n} />
                <div className="flex gap-2">
                  {STAFF.map((_, i) => (
                    <ProgressDot key={i} index={i} n={n} progress={progress} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right panel — scrolling headshots ── */}
          <div className="absolute inset-y-0 right-0 hidden w-[55%] md:block">
            {STAFF.map((member, i) => (
              <StaffCard
                key={member.id}
                member={member}
                index={i}
                n={n}
                progress={progress}
              />
            ))}
          </div>

          {/* ── Mobile: single visible card ── */}
          <div className="absolute inset-0 flex items-end pb-8 md:hidden">
            {STAFF.map((member, i) => (
              <StaffCard
                key={member.id}
                member={member}
                index={i}
                n={n}
                progress={progress}
              />
            ))}
          </div>

          {/* ── Bottom ticker ── */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 px-8 py-3 md:px-16">
            <div className="flex items-center gap-6 overflow-hidden">
              {STAFF.map((member, i) => (
                <TickerName
                  key={member.id}
                  member={member}
                  index={i}
                  n={n}
                  progress={progress}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Outro strip ───────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 px-8 py-24 md:px-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease }}
            className="massive-text text-[clamp(3rem,6vw,6rem)] font-bold uppercase leading-[0.88]"
          >
            Want to work
            <br />
            <span className="text-white/25">with us?</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            <a href="/contact" className="btn-industrial">
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
