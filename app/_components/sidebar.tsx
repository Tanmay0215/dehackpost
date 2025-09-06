"use client";

import Link from "next/link";
import {
  Menu,
  Compass,
  Folder,
  PlusSquare,
  Gavel,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";

const Sidebar = ({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useAuth();

  // Base navigation items available to all users
  const baseNav = [
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/projects", label: "Projects", icon: Folder },
    { href: "/create", label: "Create", icon: PlusSquare },
  ];

  // Additional items based on user authentication
  const authNav = [];
  
  if (user) {
    authNav.push({ href: "/dashboard", label: "Dashboard", icon: User });
    authNav.push({ href: "/judge", label: "Judge", icon: Gavel });
  }

  const nav = [...baseNav, ...authNav];

  return (
    <aside
      className={`z-50 min-h-max min-w-[100vw] absolute sm:static sm:translate-x-0 ${
        !expanded && "-translate-x-full"
      } sm:min-w-min transition-all`}
    >
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <h2
            className={`font-bold text-xl text-blue-950 transition-all overflow-hidden ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            HackX
          </h2>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50"
          >
            <Menu />
          </button>
        </div>
        <ul className="flex-1 px-3">
          {nav.map((item) => (
            <SideBarItems
              key={item.label}
              expanded={expanded}
              text={item.label}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </ul>
        
        {user && (
          <div className="border-t border-gray-200 p-3">
            <div className={`text-xs text-gray-600 transition-all overflow-hidden ${expanded ? "w-full" : "w-0"}`}>
              <div>Connected as:</div>
              <div className="font-mono text-xs truncate">{user.address}</div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

function SideBarItems({
  text,
  expanded,
  href,
  icon,
}: {
  text: string;
  expanded: boolean;
  href: string;
  icon: React.ElementType;
}) {
  const Icon = icon;
  return (
    <li className="flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-slate-300">
      <Link href={href} className="flex items-center w-full">
        <Icon className="size-5" />
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-36 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
      </Link>
    </li>
  );
}
