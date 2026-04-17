import { Link } from "react-router"
import { SectionHeader } from "../../components/misc"

const sections = [
  {
    to: "hero",
    label: "Hero Banner",
    description: "Edit the corner metadata labels on the hero section",
  },
  {
    to: "brands",
    label: "Brands Carousel",
    description: "Add, edit, or remove client brand names",
  },
  {
    to: "what-we-do",
    label: "What We Do / Why Different",
    description: "Two-panel copy blocks",
  },
  {
    to: "campaign",
    label: "Campaign Statement",
    description: "The 4-word animated tagline",
  },
  {
    to: "featured",
    label: "Featured Projects",
    description: "Choose which 3 projects appear in the homepage cascade",
  },
]

export const HomepageIndex = () => (
  <div className="max-w-2xl">
    <SectionHeader
      title="Homepage"
      description="Manage all homepage sections."
    />
    <div className="space-y-0">
      {sections.map(({ to, label, description }) => (
        <Link
          key={to}
          to={to}
          className="-mx-2 flex items-center justify-between border-b border-white/10 px-2 py-5 transition-colors hover:bg-white/5"
        >
          <div>
            <p className="text-sm font-bold tracking-wide text-white">
              {label}
            </p>
            <p className="mt-0.5 text-xs text-white/40">{description}</p>
          </div>
          <span className="text-white/30">→</span>
        </Link>
      ))}
    </div>
  </div>
)
