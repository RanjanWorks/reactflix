import React, { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { GoPlay } from "react-icons/go";

import { FaRightFromBracket } from "react-icons/fa6";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { toast } from "sonner";

const Landing = () => {
  const [movies, setMovies] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;
  const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1&region=IN`;
  const navigate = useNavigate();
  const redirect = (id) => {
    navigate(`/movie/${id}`);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovies();
  }, [apiUrl]);

  const fetchTrailer = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
      );
      const data = await response.json();
      const trailer = data.results.find((video) => video.type === "Trailer");
      if (trailer) {
        setSelectedTrailer(trailer.key);
        setIsDrawerOpen(true);
      } else {
        toast("Trailer Not found", {
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  return (
    <section className="relative ">
      <Swiper
        pagination={{
          dynamicBullets: true,
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        slidesPerView={1}
        className="mySwiper"
        effect={"fade"}
        modules={[Pagination, EffectFade, Autoplay]}
      >
        {movies.map((movie, i) =>
          movie.backdrop_path ? (
            <SwiperSlide key={i} className="relative">
              <div className="relative w-full h-[50vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] rounded-b-lg overflow-hidden">
                <div className="absolute inset-0 gr"></div>
                <img
                  className="w-full h-full object-cover "
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt={movie.title}
                />
                <div className="absolute z-50 top-3/4 left-4 sm:left-6 md:left-8 lg:left-12 transform -translate-y-1/2 ">
                  <div>
                    <p className="text-xs">
                      {movie.original_language.toUpperCase()} |{" "}
                      {movie.release_date.split("-")[0]} |{" "}
                      {movie.original_title}
                    </p>
                    <h1 className="title text-3xl text-white lg:text-6xl font-bold">
                      {movie.title}
                    </h1>
                    <p className="w-full text-sm text-gray-400 mt-1 sm:mt-2 lg:w-1/2 truncate-lines">
                      {movie.overview}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-6 md:mt-5 flex gap-2 ">
                    <button
                      onClick={() => fetchTrailer(movie.id)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center gap-1 px-3 py-2 rounded-sm"
                    >
                      <GoPlay />{" "}
                      <span className="hidden sm:inline">Watch Trailer</span>
                    </button>
                    <button
                      onClick={() => redirect(movie.id)}
                      className="backdrop-blur-lg bg-black/10 flex items-center gap-1 border border-white px-3 py-2 rounded-sm hover:bg-white hover:text-black transition"
                    >
                      <span className="">More</span>
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ) : null
        )}
      </Swiper>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Trailer</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <DrawerDescription>
            {selectedTrailer && (
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </DrawerDescription>
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default Landing;
