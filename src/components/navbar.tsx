import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link, useLocation } from "react-router"
import { Menu, X } from "lucide-react"

const NAV_ITEMS = ["About", "Services", "Portfolio", "Contact"]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close menu on navigation
  const handleLinkClick = () => setOpen(false)

  // Close menu when route changes
  useState(() => setOpen(false))

  return (
    <>
      <nav className="fixed top-0 left-0 z-1000 grid w-full grid-cols-2 items-center px-4 py-6 md:grid-cols-3 md:px-8">
        <Link
          to="/"
          className="massive-text group text-xl font-black tracking-tighter text-white md:text-2xl"
          onClick={handleLinkClick}
        >
          DEVON{" "}
          <span className="text-neon-pink transition-colors group-hover:text-white">
            COLEBANK
          </span>
        </Link>

        <div className="hidden items-center justify-center gap-6 md:flex">
          {["About", "Services", "Portfolio"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="w-24 text-center text-xs font-medium tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>

        <Link
          to="/contact"
          className="btn-industrial justify-self-end hidden md:inline-flex"
        >
          Contact
        </Link>

        <button
          onClick={() => setOpen((o) => !o)}
          className="justify-self-end text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-bg"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease, delay: 0.05 + i * 0.06 }}
                >
                  <Link
                    to={`/${item.toLowerCase()}`}
                    onClick={handleLinkClick}
                    className="massive-text text-5xl text-white transition-colors hover:text-neon-pink"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
