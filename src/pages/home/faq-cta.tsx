import { Link } from "react-router"
import { TextReveal } from "../../components/text-reveal"

export const FaqCta = () => (
  <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
    {/* Left */}
    <div className="border-b border-white/10 px-8 py-16 md:px-16 lg:border-r lg:border-b-0 lg:py-20">
      <span className="mb-4 block text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
        Got Questions
      </span>
      <TextReveal
        text="FAQ"
        className="massive-text text-5xl leading-none md:text-7xl lg:text-8xl"
      />
    </div>

    {/* Right */}
    <div className="flex flex-col justify-center gap-6 px-8 py-16 md:px-16 lg:py-20">
      <p className="max-w-lg text-base leading-relaxed text-white/60">
        Wondering what's included, how pricing works, or how we run shoot days?
        We've answered the most common questions so you can hit the ground
        running.
      </p>
      <div>
        <Link to="/contact#faq" className="btn-industrial">
          View FAQ →
        </Link>
      </div>
    </div>
  </section>
)
