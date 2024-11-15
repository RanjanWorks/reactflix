import React from "react";
import StarRating from "./StarRating";
import { MdOutlineCancel } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
const Card = ({ movie, onRemoveFromWatchlist, cancel }) => {
  if (!movie || !movie.poster_path) return null; 

  const {
    title = "No Title",
    poster_path,
    release_date = "N/A",
    vote_average = 2,
    id,
    first_air_date = "",
    name = "No Name",
  } = movie;

  return (
    <div className=" rounded-md p-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-teal-900/20 backdrop-blur-10 backdrop-blur-md shadow-md hover:bg-teal-900/70 ">
      <div className="relative">
      {cancel == true ? (
          <button
            onClick={() => onRemoveFromWatchlist(id)} // Call the remove function
            className=" absolute top-2 right-2 bg-zinc-900/50 p-2 rounded-full text-white hover:bg-zinc-950 z-50 "
          >
            <MdOutlineCancel />
          </button>
        ) : (
          ""
        )}
        <NavLink to={`/movie/${id}`}>
          <LazyLoadImage
            className="h-auto w-full rounded-md cursor-pointer"
            src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
            alt={title}
            effect="blur"
          />
        </NavLink>

     
      </div>
      <div className="text-white my-2">
        <h1
          className="text-base sm:text-lg lg:text-xl overflow-hidden text-ellipsis whitespace-nowrap"
          title={title}
        >
          {title === "No Title" ? name : title}
        </h1>
        <p className="text-xs text-slate-300">
          {release_date !== "N/A" ? release_date.split("-")[0] : first_air_date}
        </p>
        <StarRating rating={vote_average} /> {/* Use StarRating component */}
      </div>
    </div>
  );
};

export default Card;