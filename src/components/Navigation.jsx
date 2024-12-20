import React, { useState, useEffect } from "react";
import { GoHome, GoHeart,GoStack  } from "react-icons/go";
import { NavLink } from "react-router-dom";
import Search from "./Search";

const Navigation = () => {
  return (
    <div
      className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 rounded-t-lg border border-inherit bottom-0 left-1/2 bg-black/60 backdrop-blur-lg overflow-hidden transition-transform duration-300"
    >
      <div className="grid grid-cols-4 items-center w-full h-full justify-center">
        <NavLink to="/" className="inline h-full">
          <div className="flex items-center justify-center gap-1 flex-col lg:hover:bg-zinc-700/50 h-full cursor-pointer">
            <GoHome size={25} />
            <span className="text-xs text-slate-400">Home</span>
          </div>
        </NavLink>

        <div className="flex items-center justify-center gap-1 flex-col lg:hover:bg-zinc-700/50 h-full cursor-pointer">
          <Search size={25} />
          <span className="text-xs text-slate-400">Search</span>
        </div>
        <NavLink to="/discover" className="inline h-full">
          <div className="flex items-center justify-center gap-1 flex-col lg:hover:bg-zinc-700/50 h-full cursor-pointer">
            <GoStack size={25} />
            <span className="text-xs text-slate-400">Discover</span>
          </div>
        </NavLink>
        <NavLink to="/watchlist" className="inline h-full">
          <div className="flex items-center justify-center gap-1 flex-col lg:hover:bg-zinc-700/50 h-full cursor-pointer">
            <GoHeart size={25} />
            <span className="text-xs text-slate-400">Favorite</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Navigation;
