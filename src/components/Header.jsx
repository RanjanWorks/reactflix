"use client";
import React from "react";
import Search from "./Search";
import { GoHeart } from "react-icons/go";
;

import { NavLink } from "react-router-dom";
import logo from "../assets/logoflix.svg";

const Header = () => {
  return (
    <div className="  justify-normal lg:justify-between gap-4 fixed z-50 top-0 left-0 w-full bg-zinc-950/40 backdrop-blur-lg  px-5  py-1 flex items-center h-[50px]">
      <NavLink to={`/`}>
        <div>
          <img className="h-8 py-1" src={logo} alt="Rflix" />
        </div>
      </NavLink>

      <div className="flex items-center gap-4 justify-end w-full">
        <Search size={20} />
        <NavLink to={`/watchlist`}>
          <div className="text-white transition-colors px-5 py-1 border border-zinc-500 rounded-full hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:border-none ">
            <GoHeart size={20} />
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
