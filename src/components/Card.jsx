import React from "react";
import { GoXCircle } from "react-icons/go";

import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const Card = ({ movie, onRemoveFromWatchlist, cancel }) => {
  if (!movie || !movie.poster_path) return null;

  const {
    title = "No Title",
    poster_path,
    release_date = "N/A",
    vote_average = 2,
    id,
    name = "No Name",
  } = movie;

  return (
    <div className=" rounded-xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      <div className="relative">
        {cancel == true ? (
          <button
            onClick={() => onRemoveFromWatchlist(id)} // Call the remove function
            className=" absolute top-2 right-2 bg-zinc-900/50 p-2 rounded-full text-white hover:bg-zinc-950 z-20 "
          >
            <GoXCircle />
          </button>
        ) : (
          ""
        )}
        <NavLink to={`/movie/${id}`}>
          <LazyLoadImage
            className="h-auto w-full rounded-lg cursor-pointer"
            src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
            alt={title}
            effect="blur"
          />
        </NavLink>
      </div>
      {/* <div className="text-zinc-50 my-2">
        <h1
          className="text-base sm:text-md lg:text-md overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
          title={title}
        >
          {title === "No Title" ? name : title}
        </h1>
        <p className="text-xs text-zinc-500">
          {release_date !== "N/A" ? release_date.split("-")[0] : first_air_date}
        </p>
      </div> */}
    </div>
  );
};

export default Card;
