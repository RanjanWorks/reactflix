import React, { useEffect, useState } from "react";
import { MovieSkeleton } from "./MovieSkeletion";
import { Carousel } from "./Carousel";
import MovieCategoryName from "./MovieCategoryName";
import { toast } from "sonner";

const fetchWithTimeout = async (url, options = {}, timeout = 25000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
};

export default function MovieCarousel() {
  const [movies, setMovies] = useState({
    popular: [],
    topRated: [],
    upcoming: [],
    nowPlaying: [],
    discover: [],
    trending: [],
  });

  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
      const errorMessage =
        "API Key is missing. Ensure VITE_API_KEY is defined.";
      console.error(errorMessage);
      toast("Api Error",{
        type:"error",
        description:errorMessage,
      });
      setError(errorMessage);
      setLoading(false);
      return;
    }

    function getFormattedDate() {
      const date = new Date(); 
      const year = date.getFullYear(); 
      const month = String(date.getMonth() + 1).padStart(2, "0"); 
      const day = String(date.getDate()).padStart(2, "0");
    
      return `${year}-${month}-${day}`; 
    }

    const endpoints = [
      {
        key: "Trending Movies Today",
        url: `/trending/movie/day`,
      },
      {
        key: "Sci-Fi Movies",
        url: `/discover/movie?api_key=${apiKey}&sort_by=revenue.desc&with_genres=878`,
      },
      {
        key: "Tamil Action Movies",
        url: `/discover/movie?api_key=${apiKey}&sort_by=revenue.desc&with_original_language=te&with_genres=28}`,
      },
      {
        key: "Popular Hindi Movies",
        url: `/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_original_language=hi&region=IN`,
      },
      {
        key: "Most Popular Movies",
        url: `/movie/popular`,
      },
      {
        key: "Top Rated Movies Globally",
        url: `/movie/top_rated`,
      },
      {
        key: "Upcoming Movie Releases",
        url: `/movie/upcoming`,
      },
    ];

    try {
      const fetchPromises = endpoints.map(async ({ key, url }) => {
        try {
          const response = await fetchWithTimeout(
            `https://api.themoviedb.org/3${url}?api_key=${apiKey}`,
            {},
            10000
          );

          if (!response.ok) {
            const errorMessage = `Failed to fetch ${key} movies: ${response.statusText}`;
            console.error(errorMessage);
            toast("Network Error",{
              description:`Error fetching ${key} movies`,
              type:"error"
            });
            throw new Error(errorMessage);
          }

          const data = await response.json();
          return { key, data: data.results || [] };
        } catch (err) {
          console.error(`Error fetching ${key} movies:`, err);
          toast(`Error fetching ${key} movies.`,{
            description: err.message,
            type:"error"
          });
          return { key, data: [] };
        }
      });

      const movieData = await Promise.all(fetchPromises);
      const newMovies = movieData.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
      }, {});

      setMovies(newMovies);
    } catch (globalError) {
      const errorMessage = "Error fetching movie data. Please try again.";
      console.error(errorMessage, globalError);
      toast(errorMessage,{
        description: "Somthing went wrong with network",
        type: "error",

      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="px-4 mb-8 py-1">
          <MovieSkeleton />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-1">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 ">
          
          {Object.entries(movies).map(([key, movieList]) => (
            <div className="pb-4 " key={key}>
              <MovieCategoryName
                title={key.replace(/^\w/, (c) => c.toUpperCase())}
                linkTo={`/movies/${key}`}
              />
              
              {movieList.length > 0 ? (
                <Carousel movies={movieList} />
              ) : (
                <p>No {key} movies available.</p>
              )}
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}
