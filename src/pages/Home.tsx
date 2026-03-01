import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { DeBlurText } from '../components/DeBlurText';
import { TextReveal } from '../components/TextReveal';
import { AsymmetricalSection } from '../components/AsymmetricalSection';
import { useDynamicText } from '../components/DynamicBackground';

export const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 250]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          style={{ y: useTransform(scrollY, [0, 1000], [0, 200]) }}
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
      </div>

      {/* Hero is always at scroll=0 (dark background) — keep explicit white */}
      <div className="relative z-10 text-center px-4 text-white">
        <motion.div style={{ y }}>
          <h1 className="text-[15vw] md:text-[12vw] massive-text leading-none flex flex-col items-center">
            <TextReveal text="DEVON COLEB" className="text-white" />
            <TextReveal text="ANK" className="text-neon-pink" delay={0.5} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 text-xs uppercase tracking-[0.5em] font-medium text-white/60"
          >
            Industrial Design & Visual Engineering
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        <span className="text-[10px] uppercase tracking-widest text-white opacity-40">Scroll</span>
      </div>
    </section>
  );
};

export const ProjectShowcase = () => {
  const projects = [
    { title: 'Kinetic Void', subtitle: 'Visual Engineering', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200', align: 'left' as const, width: 'md:w-2/5' },
    { title: 'Digital Pulse', subtitle: 'Motion Design', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200', align: 'right' as const, width: 'md:w-4/5' },
    { title: 'Spatial Logic', subtitle: 'Branding', img: 'https://images.unsplash.com/photo-1518005020250-675f0f0fd13b?auto=format&fit=crop&q=80&w=1200', align: 'left' as const, width: 'md:w-3/5' },
  ];

  return (
    <div className="space-y-0">
      {projects.map((project) => (
        <AsymmetricalSection
          key={project.title}
          img={project.img}
          title={project.title}
          subtitle={project.subtitle}
          align={project.align}
          imageWidth={project.width}
        />
      ))}
    </div>
  );
};

export const BrandMarquee = () => {
  const logos = ['NIKE', 'APPLE', 'TESLA', 'SONY', 'ADIDAS', 'BMW', 'AUDI', 'NASA'];
  const { textColor } = useDynamicText();

  return (
    <div className="py-24 border-y border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-24 whitespace-nowrap"
      >
        {[...logos, ...logos].map((logo, i) => (
          <motion.span
            key={i}
            style={{ color: textColor }}
            className="text-6xl font-black massive-text opacity-10 hover:opacity-100 transition-opacity"
          >
            {logo}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export const ServiceTrinity = () => {
  const services = [
    { title: 'Videography', video: 'https://assets.mixkit.co/videos/preview/mixkit-industrial-facility-at-night-4043-large.mp4' },
    { title: 'Photography', video: 'https://assets.mixkit.co/videos/preview/mixkit-welding-worker-in-a-factory-4039-large.mp4' },
    { title: 'Graphic Design', video: 'https://assets.mixkit.co/videos/preview/mixkit-mechanical-parts-of-a-clock-4041-large.mp4' },
  ];

  const { textColor } = useDynamicText();

  return (
    <section className="flex flex-col md:flex-row h-[150vh] md:h-screen border-t border-white/10">
      {services.map((service) => (
        <motion.div
          key={service.title}
          className="relative flex-1 group overflow-hidden border-r border-white/10 last:border-r-0"
        >
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src={service.video}
            />
          </div>
          <div className="relative z-10 h-full flex items-center justify-center p-6">
            {/* nowrap + clamp font-size ensures "Graphic Design" stays on one line */}
            <motion.div style={{ color: textColor }} className="group-hover:scale-110 transition-transform duration-700">
              <TextReveal
                text={service.title}
                nowrap
                className="text-[clamp(2rem,_4vw,_4.5rem)] massive-text text-center"
              />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </section>
  );
};
