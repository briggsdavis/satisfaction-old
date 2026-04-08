import { motion } from "motion/react"

const CAMPAIGN_WORDS = ["CAMPAIGNS", "BUILT", "TO", "PERFORM."]

export const CampaignStatement = () => (
  <section className="overflow-hidden border-t border-white/10 bg-black pb-8 md:pb-12">
    {CAMPAIGN_WORDS.map((word, i) => {
      const isRight = i % 2 === 1
      return (
        <motion.div
          key={word}
          className={`flex items-end px-8 md:px-16 ${isRight ? "justify-end" : "justify-start"}`}
          initial={{ opacity: 0, x: isRight ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{
            duration: 0.7,
            delay: i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span className="massive-text text-6xl leading-[0.88] select-none md:text-10xl lg:text-12xl">
            {word}
          </span>
        </motion.div>
      )
    })}

    {/* Bottom metadata row */}
    <div className="flex items-start justify-between px-8 py-4 md:px-16">
      <div className="font-mono text-xs leading-snug font-bold tracking-widest text-white/15 uppercase">
        <span>Strategy · Production · Creative</span>
        <br />
        <span>Social Satisfaction</span>
      </div>
      <div className="text-right font-mono text-xs leading-snug font-bold tracking-widest text-white/15 uppercase">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="block">
            Campaigns Built To Perform.
          </span>
        ))}
      </div>
    </div>
  </section>
)
