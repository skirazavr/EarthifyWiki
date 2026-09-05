import { useLocation } from "react-router-dom";

const BASE = import.meta.env.BASE_URL;

type SidebarLink = {
  path: string;
  label: string;
  icon?: string;
  alt?: string;
};

const links: SidebarLink[] = [
  {
    path: "/mobs",
    label: "Mobs",
    icon: "/assets/images/spawn_eggs/fancy_chicken.svg",
    alt: "Mobs"
  },
  {
    path: "/biomes",
    label: "Biomes",
    icon: "/assets/images/biomes/rosewood_grove.svg",
    alt: "Rosewood Grove"
  },
  {
    path: "/structures",
    label: "Structures"
  },
  {
    path: "/items",
    label: "Items",
    icon: "/assets/images/items/bestiary.svg",
    alt: "Bestiary"
  },
  {
    path: "/blocks",
    label: "Blocks",
    icon: "/assets/images/blocks/extractor.svg",
    alt: "Extractor"
  }
];

export default function Sidebar() {
  const location = useLocation();

  return (
      <nav className="sidebar">
        <h3>Navigation</h3>

        {links.map((link) => {
          const active =
              location.pathname === link.path ||
              location.pathname.startsWith(`${link.path}/`);

          return (
              <a
                  key={link.path}
                  href={`${BASE}${link.path.replace(/^\//, "")}`}
                  className={active ? "active" : ""}
              >
                {link.icon && (
                    <img
                        src={`${BASE}${link.icon.replace(/^\//, "")}`}
                        alt={link.alt ?? link.label}
                    />
                )}

                <span>{link.label}</span>
              </a>
          );
        })}
      </nav>
  );
}