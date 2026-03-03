import {
  motion,
  MotionValue,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { useSmoothScroll } from "../components/smooth-scroll"
import { TextReveal } from "../components/text-reveal"

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const Hero = () => {
  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY
  const y = useTransform(activeY, [0, 1000], [0, 150])
  const bgY = useTransform(activeY, [0, 1000], [0, 200])

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          style={{ y: bgY }}
          className="h-full w-full bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-4 text-center text-white">
        <motion.div style={{ y }}>
          <h1 className="massive-text flex flex-col items-center text-[15vw] leading-none md:text-[12vw]">
            <TextReveal text="DEVON" className="text-white" />
            <TextReveal
              text="COLEBANK"
              className="text-neon-pink"
              delay={0.5}
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 text-xs font-medium tracking-[0.5em] text-white/60 uppercase"
          >
            Creative Director & Brand Strategist
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4">
        <div className="h-24 w-[1px] bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        <span className="text-[10px] tracking-widest text-white uppercase opacity-40">
          Scroll
        </span>
      </div>
    </section>
  )
}

// ─── Word-by-word scroll reveal ───────────────────────────────────────────────
// whileInView lives on the parent <motion.p> so IntersectionObserver targets
// the full paragraph (which IS in the layout flow and never clipped).
// Child variants animate from within their overflow-hidden mask once the
// parent enters the viewport.
const wordVariant = {
  hidden: { y: "115%" },
  visible: {
    y: "0%",
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const WordReveal = ({
  text,
  className,
  startDelay = 0,
}: {
  text: string
  className?: string
  startDelay?: number
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.028, delayChildren: startDelay },
    },
  }

  return (
    <motion.p
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="mr-[0.3em] inline-block overflow-hidden">
          <motion.span className="inline-block" variants={wordVariant}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  )
}

// ─── Intro Text ───────────────────────────────────────────────────────────────
export const IntroText = () => {
  const para1 =
    "Creative direction, brand identity, and commercial production for the brands and people that shape culture. Seven years of building visual systems that command attention and drive results."
  const para2 =
    "Based in Pittsburgh, Pennsylvania, I work at the intersection of videography, photography, and graphic design. From Coors Light to Red Bull to Maker's Mark, every project starts with one question: what do you want people to feel?"

  return (
    <section className="border-t border-current/10 px-8 py-48 md:px-24">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Label — single line clip reveal */}
        <div className="overflow-hidden">
          <motion.span
            className="text-neon-pink block text-xs font-bold tracking-[0.4em] uppercase"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            The Philosophy
          </motion.span>
        </div>

        {/* Large paragraph — word by word */}
        <WordReveal
          text={para1}
          className="text-3xl leading-[1.35] font-light md:text-4xl lg:text-[2.6rem]"
          startDelay={0.05}
        />

        {/* Smaller paragraph — word by word, slightly offset start */}
        <WordReveal
          text={para2}
          className="max-w-3xl text-lg leading-relaxed font-light text-white/60"
          startDelay={0.12}
        />
      </div>
    </section>
  )
}

// ─── Featured Projects ────────────────────────────────────────────────────────
const FEATURED = [
  {
    title: "Kinetic Light",
    tags: ["Photography", "Landscape"],
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
    align: "left" as const,
    widthClass: "md:w-3/5",
  },
  {
    title: "Frame Study",
    tags: ["Videography", "Commercial"],
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
    align: "right" as const,
    widthClass: "md:w-[58%]",
  },
  {
    title: "Signal & Form",
    tags: ["Graphic Design", "Branding"],
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    align: "left" as const,
    widthClass: "md:w-1/2",
  },
]

const FeaturedProjectCard = ({
  project,
}: {
  project: (typeof FEATURED)[0]
}) => {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const wrapY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const imgY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const isRight = project.align === "right"

  return (
    <section
      ref={ref}
      className="border-t border-current/10 px-8 py-32 md:px-16"
    >
      <motion.div
        style={{ y: wrapY }}
        className={`mx-auto flex max-w-7xl flex-col items-center gap-12 ${
          isRight ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        {/* Image with parallax */}
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden ${project.widthClass}`}
        >
          <motion.img
            style={{ y: imgY, height: "calc(100% + 160px)", top: "-80px" }}
            src={project.img}
            alt={project.title}
            loading="lazy"
            className="absolute w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Text */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border-neon-pink/50 text-neon-pink border px-3 py-1 text-[10px] font-bold tracking-[0.35em] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
          <TextReveal
            text={project.title}
            className="massive-text text-5xl md:text-7xl"
          />
          <p className="max-w-xs text-base leading-relaxed text-white/60">
            A focused exploration of form, light, and intention. Crafted with
            precision and purpose.
          </p>
        </div>
      </motion.div>
    </section>
  )
}

export const FeaturedProjects = () => {
  return (
    <section>
      <div className="border-t border-current/10 px-8 pt-32 pb-12 md:px-16">
        <TextReveal text="Featured" className="massive-text text-[9vw]" />
        <TextReveal
          text="Projects"
          className="massive-text text-neon-pink text-[9vw]"
          delay={0.15}
        />
      </div>

      {FEATURED.map((project) => (
        <FeaturedProjectCard key={project.title} project={project} />
      ))}

      <div className="flex justify-center border-t border-current/10 py-24">
        <Link to="/portfolio" className="btn-industrial">
          See Portfolio
        </Link>
      </div>
    </section>
  )
}

// ─── Value Propositions (Pinned Scroll) ───────────────────────────────────────
const UVP_DATA = [
  {
    title: "Storytelling Through Light",
    text: "Every frame is a deliberate act. From music videos for local artists to national campaigns for Coors Light and Red Bull, Devon turns moments into cinematic statements.",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Brand, Built to Last",
    text: "Great design outlives trends. Devon builds visual identities rooted in strategy, executed with craft, and designed to grow alongside the brands that wear them.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Motion That Moves People",
    text: "Video is connection. From concept to color grade, Devon directs and produces film that carries the full weight of a story worth telling.",
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
  },
]

const UVPPanel = ({
  uvp,
  index,
  total,
  progress,
}: {
  uvp: (typeof UVP_DATA)[0]
  index: number
  total: number
  progress: MotionValue<number>
}) => {
  const crossWidth = 0.13

  // Build keyframe arrays without conditionals so hook call order is always stable
  const fadeInStart = index === 0 ? 0 : index / total - crossWidth + 0.01
  const fadeInEnd = index === 0 ? 0.01 : index / total
  const fadeOutStart =
    index === total - 1 ? 0.99 : (index + 1) / total - crossWidth
  const fadeOutEnd = index === total - 1 ? 1 : (index + 1) / total

  const opProgress = [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]
  const opValues =
    index === 0
      ? [1, 1, 1, 0]
      : index === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0]

  const opacity = useTransform(progress, opProgress, opValues)

  const imgStartX = index === 0 ? "0%" : index % 2 === 0 ? "-5%" : "5%"
  const imgX = useTransform(
    progress,
    [fadeInStart, fadeInEnd],
    [imgStartX, "0%"],
  )
  const textStartY = index === 0 ? "0px" : "28px"
  const textY = useTransform(
    progress,
    [fadeInStart, fadeInEnd],
    [textStartY, "0px"],
  )

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex h-full flex-col md:flex-row">
      {/* Image */}
      <div className="relative h-1/2 w-full overflow-hidden md:h-full md:w-1/2">
        <motion.img
          style={{ x: imgX }}
          src={uvp.img}
          alt={uvp.title}
          className="h-full w-full scale-105 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Text */}
      <motion.div
        style={{ y: textY }}
        className="flex h-1/2 w-full flex-col justify-center space-y-4 px-6 md:h-full md:w-1/2 md:space-y-6 md:px-16"
      >
        <span className="text-neon-pink text-xs font-bold tracking-[0.4em] uppercase">
          0{index + 1} / 0{total}
        </span>
        <TextReveal
          text={uvp.title}
          className="massive-text text-4xl md:text-5xl lg:text-6xl"
        />
        <p className="max-w-md text-lg leading-relaxed text-white/60">
          {uvp.text}
        </p>
      </motion.div>
    </motion.div>
  )
}

export const ValuePropositions = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [pinDistance, setPinDistance] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const wrapperTopRef = useRef(0)
  const pinDistanceRef = useRef(0)

  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      const dist = (UVP_DATA.length - 1) * window.innerHeight
      pinDistanceRef.current = dist
      setPinDistance(dist)
    }
    requestAnimationFrame(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const progress = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = pinDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return 1
    return (y - T) / D
  })

  return (
    <div
      ref={wrapperRef}
      style={{ height: `calc(${pinDistance}px + 100vh)` }}
      className="relative border-t border-current/10"
    >
      <motion.div
        style={{ y: pinY }}
        className="relative h-screen overflow-hidden"
      >
        {UVP_DATA.map((uvp, i) => (
          <UVPPanel
            key={uvp.title}
            uvp={uvp}
            index={i}
            total={UVP_DATA.length}
            progress={progress}
          />
        ))}
      </motion.div>
    </div>
  )
}

// ─── Service Trinity (Redesigned) ─────────────────────────────────────────────
const SERVICE_CARDS = [
  {
    title: "Videography",
    description: "Brand films, event coverage, and commercial production.",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    offsetClass: "",
  },
  {
    title: "Photography",
    description: "Editorial, commercial, and event photography.",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    offsetClass: "md:mt-32",
  },
  {
    title: "Graphic Design",
    description: "Brand identity systems and creative direction.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    offsetClass: "md:mt-64",
  },
]

const ServiceCard = ({
  service,
  index,
}: {
  service: (typeof SERVICE_CARDS)[0]
  index: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <motion.div
      ref={ref}
      className={`group min-w-0 flex-1 ${service.offsetClass}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
    >
      <div className="relative mb-8 aspect-[3/4] overflow-hidden">
        <motion.img
          style={{ y: imgY, height: "calc(100% + 60px)", top: "-30px" }}
          src={service.img}
          alt={service.title}
          loading="lazy"
          className="absolute w-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />
      </div>
      <TextReveal
        text={service.title}
        className="massive-text mb-3 text-4xl md:text-5xl"
      />
      <p className="text-sm leading-relaxed text-white/60">
        {service.description}
      </p>
    </motion.div>
  )
}

export const ServiceTrinity = () => {
  return (
    <section className="border-t border-current/10 px-8 py-32 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20">
          <TextReveal text="Services" className="massive-text text-[13vw]" />
        </div>

        <div className="flex flex-col items-start gap-10 md:flex-row md:gap-12">
          {SERVICE_CARDS.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        <div className="mt-32 flex justify-center md:mt-56">
          <Link to="/services" className="btn-industrial">
            Discover More
          </Link>
        </div>
      </div>
    </section>
  )
}
