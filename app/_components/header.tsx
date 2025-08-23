import { Menu, Search, Bell, Users, Network } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Header({ setExpanded }: { setExpanded: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <header className="bg-white min-w-full h-16 flex items-center justify-between px-2 sm:px-4 border-b border-border shadow-sm">
      <div className="flex items-center gap-2">
        <button onClick={() => setExpanded((curr) => !curr)} className="sm:hidden p-2 rounded-lg bg-slate-100">
          <Menu className="text-gray-700" size={22} />
        </button>
        <span className="font-bold text-lg sm:text-xl text-primary">Dehackpost</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden sm:block">
          <input className="border border-gray-300 rounded-full py-1 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32 sm:w-48" placeholder="Search..." type="search" />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <button className="sm:hidden p-2 rounded-full bg-slate-100">
          <Search className="text-gray-700" size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <Bell className="text-gray-500 hover:text-primary cursor-pointer" size={20} />
          <Users className="text-gray-500 hover:text-primary cursor-pointer" size={20} />
          <Network className="text-gray-500 hover:text-primary cursor-pointer" size={20} />
        </div>
        <div className="">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}

export default Header;