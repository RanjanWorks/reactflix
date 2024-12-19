import React from "react";
import { FiExternalLink } from "react-icons/fi";

const ExtraDetails = ({ movie, Bg, textColor1, movieKeywords }) => {
  function redirectServer1() {
    const formattedTitle = movie.title.replace(/ /g, "+");
    const url = `https://www.jalshamoviez.er.in/mobile/search?find=${formattedTitle}&per_page=1`;
    window.open(url, "_blank");
  }

  function redirectServer2() {
    const formattedTitle = movie.title.replace(/ /g, "+");
    const url = `https://www.filmyfly.durban/site-1.html?to-search=${formattedTitle}`;
    window.open(url, "_blank");
  }
  function redirectServer3() {
    let searchSuffix = "site:filmyzilla.com.by";
    const searchQuery = `${movie.title} ${searchSuffix}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}`;
    window.open(url, "_blank");

  }

  // function redirectServer3() {
  //   const formattedTitle = movie.title.replace(/ /g, "+");
  //   const url = `https://bollyflix.meme/search/${formattedTitle}`;
  //   window.open(url, "_blank");
  // }

  return (
    <div
      style={{ background: `${Bg}`, color: `${textColor1}` }}
      className="p-5 flex items-start gap-3 flex-col mt-10"
    >
      <div className="flex flex-col">
        <h1 className="text-3xl lg:text-5xl font-bold text">
          {movie.title === movie.original_title
            ? movie.title
            : `${movie.title} (${movie.original_title})`}
        </h1>

        <p className="text-xs">{movie.release_date}</p>
      </div>
      <div>
        <p className="font-semibold text-md">Production Country</p>
        {movie.production_countries.map((i) => (
          <p className="text-xs" key={i.iso_3166_1}>
            {i.name}
          </p>
        ))}
      </div>

      <div>
        <p className="font-semibold text-md">Origin Country</p>
        <p className="text-xs">{movie.origin_country}</p>
      </div>

      <div>
        <p className="font-semibold text-md">Status</p>
        <p className="text-xs">{movie.status}</p>
      </div>

      {movie.budget ? (
        <div>
          <p className="font-semibold text-md">Budget</p>
          <p className="text-xs">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(movie.budget)}
          </p>
        </div>
      ) : (
        ""
      )}

      {movie.revenue ? (
        <div>
          <p className="font-semibold text-md">Revenue</p>
          <p className="text-xs">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(movie.revenue)}
          </p>
        </div>
      ) : (
        ""
      )}
      <div>
        <p className="font-semibold text-md">Download</p>
        <div className="flex  mt-2">
          <button
            onClick={redirectServer1}
            className="bg-black bg-opacity-10 px-2 py-1 rounded-l-md text-xs flex items-center gap-2"
          >
            Jalshamoviez <FiExternalLink />
          </button>
          <button
            onClick={redirectServer2}
            className="bg-black bg-opacity-10 px-2 py-1  text-xs flex items-center gap-2"
          >
            Filmyfly <FiExternalLink />
          </button>
          <button
            onClick={redirectServer3}
            className="bg-black bg-opacity-10 px-2 py-1 rounded-r-md text-xs flex items-center gap-2"
          >
            FilmyZilla <FiExternalLink />
          </button>
        </div>
      </div>
      {movieKeywords.length > 0 ? (
        <div className="flex flex-col">
          <p className="font-semibold text-md mb-2">Keywords</p>
          <div className="flex items-start gap-1 flex-wrap">
            {movieKeywords.map((item) => (
              <p
                className=" bg-black bg-opacity-10 px-2 py-1 text-xs rounded-sm"
                key={item.id}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ExtraDetails;
