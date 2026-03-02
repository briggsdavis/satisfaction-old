import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DeBlurText } from '../components/DeBlurText';
import { TextReveal } from '../components/TextReveal';
import { useDynamicText } from '../components/DynamicBackground';

const SERVICE_DATA = [
  {
    id: 'service-a',
    title: 'VIDEOGRAPHY',
    desc: "Cinematic storytelling from documentary portraits to brand films — crafted with a director's eye and a photographer's instinct for light.",
    expertise:
      "Over a decade of motion work across Europe and beyond. Devon brings a director's precision and a documentarian's patience to every brief — whether it's a high-concept brand film or an intimate character portrait shot in a single afternoon.",
    capabilities: [
      { label: 'Brand & Commercial Films', note: 'Full-production narratives for forward-thinking brands' },
      { label: 'Documentary & Long-Form', note: 'Authentic stories told with patience and craft' },
      { label: 'Event & Live Coverage', note: 'Cultural, corporate, and live performance capture' },
      { label: 'Short-Form & Social Content', note: 'Scroll-stopping content built for modern platforms' },
    ],
    stats: [
      { value: '200+', label: 'Films Produced' },
      { value: '12', label: 'Countries Shot In' },
    ],
  },
  {
    id: 'service-b',
    title: 'PHOTOGRAPHY',
    desc: "Editorial, commercial, and fine-art photography that captures the decisive moment — authentic, precise, and deeply considered.",
    expertise:
      "Devon's photographic practice spans editorial portraiture, commercial campaigns, and personal fine-art projects. The approach never changes: get close, stay patient, and trust the light to do what it always does.",
    capabilities: [
      { label: 'Editorial & Portrait', note: 'Magazine, press, and talent portraiture' },
      { label: 'Commercial & Product', note: 'Campaign photography for global brands' },
      { label: 'Landscape & Fine Art', note: 'Personal and collectible works' },
      { label: 'Event & Documentary', note: 'Cultural moments preserved with intention' },
    ],
    stats: [
      { value: '500+', label: 'Shoots Completed' },
      { value: '30+', label: 'Publications Featured' },
    ],
  },
  {
    id: 'service-c',
    title: 'GRAPHIC DESIGN',
    desc: "Visual identity systems, art direction, and typographic design that give brands a distinctive, lasting presence.",
    expertise:
      "From startup identity builds to established brand resets, Devon designs with both strategy and soul. Every mark, typeface, and colour decision is rooted in the brand's truth — not the trend of the moment.",
    capabilities: [
      { label: 'Brand Identity Systems', note: 'Logo, type, colour, and usage guidelines' },
      { label: 'Art Direction', note: 'Creative direction across print and digital' },
      { label: 'Typographic Design', note: 'Custom lettering and type-led layouts' },
      { label: 'Print & Collateral', note: 'Books, packaging, and physical brand assets' },
    ],
    stats: [
      { value: '80+', label: 'Brands Designed' },
      { value: '15+', label: 'Awards' },
    ],
  },
];

// Individual capability row — text rises from behind a clip mask
const CapabilityRow = ({
  cap,
  index,
}: {
  cap: { label: string; note: string };
  index: number;
}) => (
  <div className="border-b border-current/10">
    <div className="py-5 flex items-center justify-between gap-8">
      {/* Label: slides up from below the overflow-hidden mask */}
      <div className="overflow-hidden">
        <motion.span
          className="block text-xl md:text-2xl massive-text"
          initial={{ y: '115%' }}
          animate={{ y: '0%' }}
          transition={{
            duration: 0.55,
            delay: 0.08 + index * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {cap.label}
        </motion.span>
      </div>

      {/* Note: fades in after the label appears */}
      <motion.span
        className="text-[10px] uppercase tracking-[0.25em] opacity-50 text-right shrink-0 max-w-[38%] hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.45, delay: 0.22 + index * 0.07 }}
      >
        {cap.note}
      </motion.span>
    </div>
  </div>
);

// Animated +/× toggle icon
const ToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
  <motion.span
    className="w-4 h-4 relative flex items-center justify-center flex-shrink-0"
    animate={{ rotate: isOpen ? 45 : 0 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
  >
    <span className="absolute w-full h-[1px] bg-neon-pink" />
    <span className="absolute w-[1px] h-full bg-neon-pink" />
  </motion.span>
);

export const Services = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const { textColor, textColorMuted } = useDynamicText();

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <motion.div className="pt-40" style={{ color: textColor }}>
      <div className="px-8 mb-32">
        <DeBlurText className="text-[12vw] leading-none">
          Our<br /><span className="text-neon-pink">Services</span>
        </DeBlurText>
      </div>

      <div className="space-y-0">
        {SERVICE_DATA.map((service, i) => {
          const isOpen = openId === service.id;

          return (
            <section
              key={service.id}
              id={service.id}
              className="relative border-t border-current/10"
            >
              {/* Ambient neon glow on hover */}
              <div className="absolute inset-0 z-0 bg-neon-pink opacity-0 hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none" />

              <div className="px-8 py-24 md:py-32 relative z-10">
                <TextReveal
                  text={service.title}
                  className="text-[15vw] massive-text leading-none"
                />

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  style={{ color: textColorMuted }}
                  className="max-w-xl text-xl mt-8"
                >
                  {service.desc}
                </motion.p>

                {/* ── Toggle trigger ── */}
                <button
                  onClick={() => toggle(service.id)}
                  aria-expanded={isOpen}
                  className="mt-12 flex items-center gap-5 group cursor-pointer"
                >
                  <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-neon-pink">
                    {isOpen ? 'Close' : 'Capabilities'}
                  </span>

                  {/* Animated connector line */}
                  <motion.span
                    className="h-[1px] bg-neon-pink block"
                    animate={{ width: isOpen ? '72px' : '32px' }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <ToggleIcon isOpen={isOpen} />
                </button>

                {/* ── Expandable detail panel ── */}
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pt-12 pb-8"
                      >
                        {/* Animated divider line — draws left to right */}
                        <motion.div
                          className="h-[1px] bg-neon-pink/30 mb-10"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />

                        {/* Expertise paragraph */}
                        <motion.p
                          style={{ color: textColorMuted }}
                          className="max-w-2xl text-lg leading-relaxed mb-10"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.08 }}
                        >
                          {service.expertise}
                        </motion.p>

                        {/* Capability rows — each line reveals with a clip-mask slide-up */}
                        <div className="border-t border-current/10">
                          {service.capabilities.map((cap, j) => (
                            <CapabilityRow key={cap.label} cap={cap} index={j} />
                          ))}
                        </div>

                        {/* Stats */}
                        <motion.div
                          className="flex gap-16 pt-12 mt-2"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.48, duration: 0.5 }}
                        >
                          {service.stats.map((stat) => (
                            <div key={stat.label}>
                              <div className="text-5xl md:text-6xl massive-text text-neon-pink leading-none">
                                {stat.value}
                              </div>
                              <div
                                className="text-[10px] uppercase tracking-widest mt-3"
                                style={{ color: textColorMuted as any }}
                              >
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Section number watermark */}
              <div className="absolute right-8 bottom-8 text-[20vw] font-black massive-text opacity-5 pointer-events-none select-none">
                0{i + 1}
              </div>
            </section>
          );
        })}
      </div>
    </motion.div>
  );
};
