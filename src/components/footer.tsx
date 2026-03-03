import { Link } from "react-router"

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/devoncolebank/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/devoncolebank/" },
  { label: "YouTube", href: "https://www.youtube.com/@devoncolebank" },
  { label: "Facebook", href: "https://www.facebook.com/devoncolebankmedia" },
]

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black px-8 pt-32 pb-12">
      <div className="via-neon-pink/30 absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent" />

      <div className="relative z-10 grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-2 lg:gap-16 lg:grid-cols-4">
        <div className="space-y-8">
          <h2 className="massive-text text-4xl md:text-6xl leading-none">
            Devon
            <br />
            Colebank
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-white/40">
            Creative director and brand strategist based in Pittsburgh, PA.
            Building visual identities that command attention.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-neon-pink text-[10px] font-bold tracking-[0.3em] uppercase">
            Navigation
          </h4>
          <ul className="space-y-4">
            {["Home", "About", "Services", "Portfolio", "Contact"].map(
              (item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="hover:text-neon-pink text-xl font-medium transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-neon-pink text-[10px] font-bold tracking-[0.3em] uppercase">
            Social
          </h4>
          <ul className="space-y-4">
            {SOCIAL_LINKS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neon-pink text-xl font-medium transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-neon-pink text-[10px] font-bold tracking-[0.3em] uppercase">
            Contact
          </h4>
          <p className="text-xl font-medium">devon@devoncolebank.com</p>
          <p className="text-sm text-white/40">Pittsburgh, PA</p>
          <Link to="/contact" className="btn-industrial mt-4 inline-block">
            Start a Project
          </Link>
        </div>
      </div>

      <div className="mt-32 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
        <p className="text-[10px] tracking-widest text-white/20 uppercase">
          © {new Date().getFullYear()} Devon Colebank. All Rights Reserved
        </p>
        <div className="flex gap-8">
          <span className="text-[10px] tracking-widest text-white/20 uppercase">
            Privacy Policy
          </span>
          <span className="text-[10px] tracking-widest text-white/20 uppercase">
            Terms of Service
          </span>
        </div>
      </div>

      {/* Large background text */}
      <div className="massive-text pointer-events-none absolute -right-20 -bottom-20 text-[30vw] font-black text-white/[0.02] select-none">
        COLEBANK
      </div>
    </footer>
  )
}
