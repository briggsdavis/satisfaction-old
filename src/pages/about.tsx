import { motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { AsymmetricalSection } from "../components/asymmetrical-section"
import { DeBlurText } from "../components/de-blur-text"
import { useSmoothScroll } from "../components/smooth-scroll"
import { TextReveal } from "../components/text-reveal"

export const About = () => {
  const timeline = [
    {
      year: "2015",
      event:
        "Launched Social Satisfaction, starting with music videos for Pittsburgh artists.",
      img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000",
    },
    {
      year: "2017",
      event: "Co-founded Vandals Clothing Co. and Endangered Youth.",
      img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000",
    },
    {
      year: "2019",
      event: "Began producing campaigns for Coors Light and Red Bull.",
      img: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=1000",
    },
    {
      year: "2020",
      event:
        "Produced brand activations for Beam Suntory including Maker's Mark and Basil Hayden.",
      img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000",
    },
    {
      year: "2021",
      event:
        "Launched House of Balloons, an immersive annual event experience in Pittsburgh.",
      img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000",
    },
    {
      year: "2022",
      event: "Joined Richard DeShantz Restaurant Group as Marketing Director.",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1000",
    },
    {
      year: "2024",
      event:
        "Continued expanding RDRG's brand presence and digital marketing reach.",
      img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=1000",
    },
  ]

  const wrapperRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  const smoothY = useSmoothScroll()
  const fallbackY = useMotionValue(0)
  const activeY = smoothY ?? fallbackY

  const wrapperTopRef = useRef(0)
  const scrollDistanceRef = useRef(0)

  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        wrapperTopRef.current = rect.top + (smoothY?.get() ?? 0)
      }
      if (horizontalRef.current) {
        const dist = Math.max(
          0,
          horizontalRef.current.scrollWidth - window.innerWidth,
        )
        scrollDistanceRef.current = dist
        setScrollDistance(dist)
      }
    }

    requestAnimationFrame(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [smoothY])

  const pinY = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = scrollDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return D
    return y - T
  })

  const x = useTransform(activeY, (y: number) => {
    const T = wrapperTopRef.current
    const D = scrollDistanceRef.current
    if (D === 0) return 0
    if (y <= T) return 0
    if (y >= T + D) return -D
    return -(y - T)
  })

  return (
    <div className="pt-40">
      <div className="mb-32 px-8">
        <DeBlurText className="mb-8 text-[12vw] leading-none">
          Devon
          <br />
          <span className="text-neon-pink">Colebank</span>
        </DeBlurText>

        <div className="mt-24 grid grid-cols-1 gap-8 md:gap-16 md:grid-cols-2">
          <div className="space-y-8">
            {/* stagger={0.003} makes the character animation significantly faster */}
            <TextReveal
              as="p"
              text="Devon Colebank is a Pittsburgh-based creative director and brand strategist with seven years of experience in commercial production, digital marketing, and brand identity development. His work spans videography, photography, and graphic design for brands like Coors Light, Red Bull, Maker's Mark, and Truly Hard Seltzer."
              className="text-2xl leading-relaxed font-light"
              stagger={0.003}
              immediate
            />
          </div>
          <div className="space-y-8 leading-relaxed">
            <p className="text-white/60">
              Born and raised in Pittsburgh and Uniontown, PA, Devon joined the
              Army at 17 and spent six years on deployments overseas, including
              time at Camp David. That discipline carries through every project
              he touches today.
            </p>
            <p className="text-white/60">
              After the military, Devon launched Social Satisfaction and quickly
              became recognized as a top creative professional in Pittsburgh's
              scene. He currently serves as Marketing Director at Richard
              DeShantz Restaurant Group, helping foster the growth of Pittsburgh
              as a culinary hub.
            </p>
            <div className="flex gap-12 pt-8">
              <div>
                <h4 className="text-neon-pink mb-2 text-[10px] font-bold tracking-widest uppercase">
                  Location
                </h4>
                <p>Pittsburgh, PA</p>
              </div>
              <div>
                <h4 className="text-neon-pink mb-2 text-[10px] font-bold tracking-widest uppercase">
                  Focus
                </h4>
                <p>Creative Direction & Brand Strategy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline Section */}
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `calc(${scrollDistance}px + 100vh)` }}
      >
        <motion.div
          style={{ y: pinY }}
          className="flex h-screen items-center overflow-hidden"
        >
          <motion.div
            ref={horizontalRef}
            style={{ x }}
            className="flex gap-24 px-8"
          >
            {timeline.map((item) => (
              <div
                key={item.year}
                className="w-[85vw] flex-shrink-0 md:w-[45vw]"
              >
                <div className="group relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.year}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <span className="massive-text text-neon-pink text-5xl md:text-8xl font-black drop-shadow-2xl">
                      {item.year}
                    </span>
                  </div>
                </div>
                <div className="mt-12 pr-12">
                  <TextReveal
                    text={item.event}
                    className="text-4xl font-bold tracking-tight uppercase"
                  />
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
                    Each milestone represents a new chapter in the ongoing
                    pursuit of authentic visual storytelling, pushing craft and
                    expanding vision.
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200"
        title="Portrait Mastery"
        subtitle="Editorial Photography"
        align="right"
      />

      <AsymmetricalSection
        img="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200"
        title="Cinematic Vision"
        subtitle="Documentary Film"
        align="left"
      />
    </div>
  )
}
