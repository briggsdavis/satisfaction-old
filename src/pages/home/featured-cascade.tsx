import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef } from "react"
import { Link } from "react-router"
import { TextReveal } from "../../components/text-reveal"
import { useSmoothScroll } from "../../components/smooth-scroll"

const CASCADE_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
    title: "Kinetic Light",
    descriptor: "Photography",
    tags: ["Landscape", "Editorial"],
  },
  {
    src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
    title: "Frame Study",
    descriptor: "Videography",
    tags: ["Commercial", "Brand"],
  },
  {
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    title: "Signal & Form",
    descriptor: "Graphic Design",
    tags: ["Branding", "Identity"],
  },
]

const CascadeImg = ({
  item,
  index,
}: {
  item: (typeof CASCADE_ITEMS)[0]
  index: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const topRef = useRef(0)
  const heightRef = useRef(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  // Measure the element's natural layout position (visual top + current smoothY).
  // Must not use useScroll() here — it mixes browser scrollY with getBoundingClientRect
  // which introduces spring-lag error and causes the parallax to flicker.
  useEffect(() => {
    const measure = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      topRef.current = rect.top + (smoothY?.get() ?? window.scrollY)
      heightRef.current = ref.current.offsetHeight
    }
    requestAnimationFrame(() => requestAnimationFrame(measure))
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  const imgY = useTransform(activeY, (y: number) => {
    const elTop = topRef.current
    const elHeight = heightRef.current
    const vh = window.innerHeight
    const start = elTop - vh
    const end = elTop + elHeight
    const range = end - start
    if (range <= 0) return 0
    const progress = Math.max(0, Math.min(1, (y - start) / range))
    return 60 - progress * 120 // maps [0,1] → [60px, -60px]
  })

  const vertOffsets = [0, 80, 160]

  return (
    <div
      ref={ref}
      className="relative min-w-0 flex-1"
      style={{ marginTop: vertOffsets[index] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{
          duration: 0.9,
          delay: index * 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
      <Link to="/portfolio" className="group block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.img
            style={{ y: imgY, height: "calc(100% + 128px)", top: "-60px" }}
            src={item.src}
            alt={item.title}
            loading="lazy"
            className="absolute w-full object-cover will-change-transform [backface-visibility:hidden]"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            referrerPolicy="no-referrer"
          />
          {/* Gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Bottom overlay — title + tags */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
                <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-white/80" />
                {item.title}
              </span>
              <span className="bg-black/60 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white/50 uppercase backdrop-blur-sm">
                {item.descriptor}
              </span>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="hidden border border-white/20 px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-white/40 uppercase backdrop-blur-sm sm:block"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Top-right "View Work" chip — hover only */}
          <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="block bg-white px-3 py-1.5 text-xs font-bold tracking-widest text-black uppercase">
              View Work →
            </span>
          </div>
        </div>
      </Link>
      </motion.div>
    </div>
  )
}

export const FeaturedCascade = () => (
  <section className="bg-black pt-12 pb-64">
    {/* Header — px-8 matches nav padding so View All right-edge aligns with Contact */}
    <div className="mb-20 flex items-end justify-between px-8 md:px-16">
      <div>
        <p className="mb-5 text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
          Selected Work
        </p>
        <TextReveal
          text="Featured Projects"
          className="massive-text text-xl leading-none md:text-4xl lg:text-6xl"
        />
      </div>
      <Link
        to="/portfolio"
        className="btn-industrial-sm hidden items-center gap-2 md:inline-flex"
      >
        View All <span>→</span>
      </Link>
    </div>

    {/* Cascade */}
    <div className="px-8 md:px-16">
      <div className="flex items-start gap-5 md:gap-8">
        {CASCADE_ITEMS.map((item, i) => (
          <CascadeImg key={i} item={item} index={i} />
        ))}
      </div>
    </div>

    {/* Mobile CTA */}
    <div className="mt-16 flex justify-center px-8 md:hidden">
      <Link
        to="/portfolio"
        className="btn-industrial inline-flex items-center gap-3"
      >
        View All Projects <span className="text-sm">→</span>
      </Link>
    </div>
  </section>
)
