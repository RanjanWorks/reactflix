"use client";
import { useEffect, useState } from "react";
import Card from "./Card";
import {
  GoHeart,
  GoHeartFill,
  GoShare,
  GoDownload,
  GoPlay,
} from "react-icons/go";
import "react-lazy-load-image-component/src/effects/blur.css";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";
import { getDominantColor } from "@/lib/Color";
import { getTextColorForBackground } from "@/lib/TextColor";
import MovieCategoryName from "./MovieCategoryName";
import { CastCarousel } from "./CastCarousel";
import { BackdropCarousel } from "./BackdropCarousel";
import ExtraDetails from "./ExtraDetails";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import movieRatings from "@/lib/Rating";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [credits, setCredits] = useState([]);
  const [crew, setCrew] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [movieKeywords, setKeywords] = useState([]);
  const [rating, setRating] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [Bg, setBgColor] = useState("");
  const [bgOpacity, setBgOpacity] = useState("");
  const [textColor1, setTextColor] = useState("white");
  const [hasMovie, setHasMovie] = useState(false);
  const [error, setError] = useState(null);
  const [percentage, setPercentage] = useState(100);
  const apiKey = import.meta.env.VITE_API_KEY;
  const searchSuffix = "site:filmyzilla.com.by";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const playlist = JSON.parse(localStorage.getItem("playlist")) || [];
    setHasMovie(playlist.includes(Number(id)));
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setPercentage(30);
      } else {
        setPercentage(100);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);

        const urls = [
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`,
        ];

        const [
          movieRes,
          relatedRes,
          creditRes,
          trailerRes,
          backdropRes,
          keywordsRes,
          ratingRes,
        ] = await Promise.all(urls.map(fetchWithErrorHandling));

        if (movieRes.status_code === 34) {
          throw new Error("Movie not found");
        }

        const combineJobsById = (creditRes) => {
          // Define the important jobs
          const importantJobs = [
            "Director",
            "Screenplay",
            "Producer",
            "Writer",
            "Editor",
            "Story",
          ]; // Add more important jobs as needed

          return creditRes.reduce((acc, member) => {
            // Only process crew members with important jobs
            if (importantJobs.includes(member.job)) {
              if (acc[member.id]) {
                acc[member.id].jobs.push(member.job);
              } else {
                acc[member.id] = {
                  name: member.name,
                  jobs: [member.job],
                };
              }
            }
            return acc;
          }, {});
        };

        const combinedCrewData = combineJobsById(creditRes.crew);
        setCrew(combinedCrewData);
        setMovie(movieRes);
        setRelatedMovies(relatedRes.results || []);
        setCredits(creditRes.cast || []);
        setBackdrops(backdropRes || []);
        setKeywords(keywordsRes.keywords || []);

        const usRating = ratingRes.results.find(
          (entry) => entry.iso_3166_1 === movieRes.origin_country[0]
        );
        if (usRating) {
          const certification = usRating.release_dates.find(
            (release) => release.certification
          );
          setRating(certification ? certification.certification : "NR");
        } else {
          setRating("NR");
        }

        const imageUrl = `https://image.tmdb.org/t/p/w500/${movieRes.poster_path}?not-from-cache-please`;
        try {
          const rgb = await getDominantColor(imageUrl);
          const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          const opacityColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.7)`;

          setBgColor(color);
          setBgOpacity(opacityColor);
          setTextColor(getTextColorForBackground(rgb));
        } catch (colorError) {
          console.error("Error fetching dominant color:", colorError);
        }

        const trailers = trailerRes.results.filter(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (trailers.length > 0) {
          setTrailer(`https://www.youtube.com/embed/${trailers[0].key}`);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie data:", error);
        toast.error(error.message || "An error occurred while fetching data");
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, apiKey]);

  const fetchWithErrorHandling = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  };

  const handleConfirm = () => {
    if (movie?.title) {
      setDialogOpen(false);
      window.open(
        `https://bollyflix.meme/search/${movie.title.replace(/ /g, "+")}`,
        "_blank"
      );
    }
  };
  const handleCancel = () => {
    setDialogOpen(false);
  };
  const handleShare = async () => {
    if (!movie) {
      toast.warn("No movie data available to share.");
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          text: `${movie.title} (${movie.release_date}): ${movie.overview}\nBy Ranjan`,
          url: window.location.href,
        });
        toast.success("Movie shared successfully!");
      } else {
        const details = `${movie.title} (${movie.release_date}): ${movie.overview}\nURL: ${window.location.href}\nBy Ranjan`;
        await navigator.clipboard.writeText(details);
        toast.info("Details copied to clipboard!");
      }
    } catch (error) {
      toast.error(`Failed to share: ${error.message}`);
    }
  };

  const handleAddPlayList = (id) => {
    const playlist = JSON.parse(localStorage.getItem("playlist")) || [];
    if (playlist.includes(id)) {
      toast("Movie already in favorite.", {
        type: "warning",
        action: {
          label: "View",
          onClick: () => navigate("/watchlist"),
        },
      });
      return;
    }

    playlist.push(id);
    localStorage.setItem("playlist", JSON.stringify(playlist));
    toast.success(`${movie.title} added to favorite!`, {
      action: {
        label: "View",
        onClick: () => navigate("/watchlist"),
      },
    });
    setHasMovie(true);
  };

  const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours > 0 ? `${hours}h` : ""} ${
      remainingMinutes > 0 ? `${remainingMinutes}m` : ""
    }`.trim();
  };

  if (loading) return <Loader color={Bg || "gray"} loading={true} size={20} />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-orange-500">
        {" "}
        {error}{" "}
      </div>
    );

  return (
    <>
      <div
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: `${textColor1}`,
        }}
        className="relative flex items-center justify-start w-full p-4 aspect-video z-20 lg:hidden"
      >
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(to right, ${Bg} 30%, transparent)`,
          }}
        ></div>

        <img
          className="w-1/3 z-20 relative rounded-md"
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={movie.title}
        />
      </div>

      <div
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          backgroundSize: "cover",
          color: `${textColor1}`,
        }}
        className="relative grid grid-cols-1 lg:grid-cols-[300px_auto] gap-5 p-5  lg:py-8 "
      >
        <div className=" relative flex justify-start items-start rounded-lg bg-cover bg-center shadow-md ">
          <img
            className=" hidden lg:block relative z-10 lg:w-full h-auto w-full md:max-w-md lg:max-w-lg rounded-lg"
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              {movie.title} ({movie.release_date.split("-")[0]})
            </h1>
            <p className="text-sm lg:text-base ">
              <span className="px-1 border-black border border-opacity-10 bg-black bg-opacity-5 mr-1">
                <Popover>
                  <PopoverTrigger>
                    {rating} 
                  </PopoverTrigger>
                  <PopoverContent>{movieRatings[rating]}</PopoverContent>
            
                </Popover>
              </span>
              {movie.original_language.toUpperCase()} |{" "}
              {movie.genres.map((genre) => genre.name).join(", ")} |{" "}
              {convertMinutesToTime(movie.runtime)}
            </p>
          </div>
          <div className="my-1 flex items-center gap-2">
            <div>
              <div
                style={{ background: textColor1, color: Bg }}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setDialogOpen(true)} // Open the dialog when this div is clicked
              >
                <GoDownload />
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Redirect</DialogTitle>
                    <DialogDescription>
                      You are about to leave this website and be redirected to a
                      different site. Do you wish to proceed?
                      <br />
                      <div className="flex items-center justify-end mt-5 gap-2">
                        <Button onClick={handleCancel} variant="outline">
                          Cancel
                        </Button>
                        <Button onClick={handleConfirm}>Confirm</Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div
              onClick={() => {
                handleAddPlayList(movie.id);
              }}
              style={{ background: textColor1, color: Bg }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            >
              {hasMovie ? <GoHeartFill /> : <GoHeart />}
            </div>
            <div
              style={{ background: textColor1, color: Bg }}
              onClick={handleShare}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            >
              <GoShare />
            </div>
            <div
              style={{ background: textColor1, color: Bg }}
              className=" h-10 px-4 gap-2 rounded-full flex items-center justify-center cursor-pointer"
            >
              <Drawer>
                <DrawerTrigger
                  className="flex items-center gap-2"
                  onClick={() => setIsDrawerOpen(true)} // Set drawer state when triggered
                >
                  {" "}
                  <GoPlay />
                  Play Trailer
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Watch Trailer</DrawerTitle>
                    <DrawerDescription>
                      Watch the trailer for {movie.title}
                    </DrawerDescription>
                    {isDrawerOpen && trailer ? ( // Only load iframe when drawer is open
                      <iframe
                        width="100%"
                        height="315"
                        src={`${trailer}?autoplay=1`} // Autoplay parameter added
                        title="Movie Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <p>Trailer not available.</p>
                    )}
                  </DrawerHeader>
                  <DrawerFooter>
                    <DrawerClose onClick={() => setIsDrawerOpen(false)} />
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <div>
            <p className="text-sm lg:text-base  italic">{movie.tagline}</p>

            <p className="font-semibold text-xl">Overview</p>
            <p className="text-base lg:text-lg  leading-relaxed">
              {movie.overview}
            </p>
          </div>

          <div>
            <span
              style={{ background: textColor1, color: Bg }}
              className="py-2 px-5  rounded-r-full text-sm"
            >
              Score | {Math.round(movie.vote_average * 10)}%
            </span>
          </div>
          <div className="flex flex-wrap items-start gap-y-1 py-4 px-2  mt-2 rounded-lg backdrop-blur-lg bg-black bg-opacity-5">
            {Object.entries(crew).map(([id, { name, jobs }]) => (
              <div
                key={id}
                className="flex flex-col items-start text-start w-1/2 lg:w-1/3 xl:w-1/4"
              >
                <NavLink to={`/person/${id}`}>
                  {" "}
                  <span className="text-md font-semibold">{name}</span>
                </NavLink>
                <span className="text-xs">{jobs.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: `linear-gradient(to right, ${Bg} ${percentage}%, ${bgOpacity})`,
          }}
          className="bgOpacity absolute inset-0 w-full h-full -z-5"
        ></div>
      </div>

      <div className="px-5 ">
        <MovieCategoryName title={"Backdrops"} />
        <BackdropCarousel backdrops={backdrops} />
      </div>

      <div className="px-5">
        {credits.length > 0 && <MovieCategoryName title={"Top Billed Cast"} />}
        <CastCarousel persons={credits} />
      </div>

      <div className="px-5 ">
        {relatedMovies.length > 0 && (
          <MovieCategoryName title={"Recommendations"} />
        )}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 text-white  ">
          {relatedMovies.map((relatedMovie) => (
            <Card key={relatedMovie.id} movie={relatedMovie} />
          ))}
        </div>
      </div>

      <ExtraDetails
        movie={movie}
        Bg={Bg}
        textColor1={textColor1}
        movieKeywords={movieKeywords}
      />
    </>
  );
}
