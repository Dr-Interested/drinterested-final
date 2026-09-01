"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import type { Webinar } from "@/data/webinars";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  Forward
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface WatchPageClientProps {
  webinar: Webinar;
}

/** Pulls a plain video ID out of any common YouTube URL shape (watch?v=, youtu.be/, embed/, playlist-only links return null). */
function extractYoutubeVideoId(url: string | undefined): string | null {
  if (!url) return null
  const patterns = [/[?&]v=([\w-]{11})/, /youtu\.be\/([\w-]{11})/, /youtube\.com\/embed\/([\w-]{11})/]
  for (const re of patterns) {
    const match = url.match(re)
    if (match) return match[1]
  }
  return null
}

export default function WatchPageClient({ webinar }: WatchPageClientProps) {
  // Defensive defaults — a Supabase-sourced row won't have every field this component expects.
  const tags = webinar.tags ?? []
  const hasHostedVideo = Boolean(webinar.videoPath)
  const youtubeVideoId = extractYoutubeVideoId(webinar.youtubeUrl)
  const useYoutubeEmbed = !hasHostedVideo && Boolean(youtubeVideoId)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [copyUrl, setCopyUrl] = useState("");

  useEffect(() => {
    setCopyUrl(window.location.href);
  }, []);

  const query = useSearchParams();

  const toggleUseTimestamp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const useTimestamp = e.target.checked;
    let url = window.location.href.split("?")[0];
    if (useTimestamp && videoRef.current) {
      const time = Math.floor(videoRef.current.currentTime);
      url += `?t=${time}`;
    }
    setCopyUrl(url);
  }

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(console.warn);
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else videoRef.current.requestFullscreen();
  };

  const copyLinkClicked = () => {
    setLinkModalOpen(true);
  }

  useEffect(() => {
    const timeoutRef = { current: null as ReturnType<typeof setTimeout> | null };

    const hide = () => setShowControls(false);

    const activity = () => {
      console.log("activity detected");
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(hide, 3000);
    }

    const leaveVideo = () => hide();

    window.addEventListener("mousemove", activity);
    window.addEventListener("mouseleave", leaveVideo);

    return () => {
      window.removeEventListener("mousemove", activity);
      window.removeEventListener("mouseleave", leaveVideo);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setMetadata = () => {
      if (!isNaN(video.duration) && video.duration !== Infinity && video.duration > 0) {
        setDuration(video.duration);
      }

      const startTime = query.get('t') || localStorage.getItem(`webinar-${webinar.slug}-time`);
      if (startTime) {
        const time = parseFloat(startTime);
        if (!isNaN(time) && time < video.duration) {
          video.currentTime = time;
          setCurrentTime(time);
        }
      }

      const savedPlaybackRate = localStorage.getItem(`webinar-playbackRate`);
      if (savedPlaybackRate) {
        const rate = parseFloat(savedPlaybackRate);
        if (!isNaN(rate)) {
          video.playbackRate = rate;
          setPlaybackRate(rate);
        }
      }
    }

    setMetadata();
    video.addEventListener("loadedmetadata", setMetadata);

    const leavePage = () => {
      if (videoRef.current) {
        const time = videoRef.current.currentTime;
        localStorage.setItem(`webinar-${webinar.slug}-time`, time.toString());
      }
    }
    window.addEventListener("beforeunload", leavePage);

    return () => {
      window.removeEventListener("beforeunload", leavePage);
      video.removeEventListener("loadedmetadata", setMetadata);
    };
  }, [webinar.slug, query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }

      if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      }

      if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

    }
  }, [togglePlay, toggleMute])

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      localStorage.setItem(`webinar-playbackRate`, rate.toString());
    }
  }

  // --- Handlers ---
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // --- Structured data for SEO ---
  const absolute = (path: string) =>
    path.startsWith("http") ? path : `https://www.drinterested.org${path.startsWith("/") ? "" : "/"}${path}`;

  // "mm:ss" -> ISO 8601 duration; anything else (e.g. an unset Supabase row) is omitted.
  const durationMatch = /^(\d+):([0-5]?\d)$/.exec(webinar.duration || "");
  const parsedUploadDate = webinar.date ? new Date(webinar.date) : null;

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: webinar.title,
    description: webinar.description,
    thumbnailUrl: absolute(webinar.thumbnailPath),
    embedUrl: `https://www.drinterested.org/watch/${webinar.slug}`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: webinar.views,
    },
    publisher: {
      "@type": "Organization",
      name: "Dr. Interested",
      logo: {
        "@type": "ImageObject",
        url: "https://www.drinterested.org/logo.png",
      },
    },
  };
  if (parsedUploadDate && !isNaN(parsedUploadDate.getTime())) {
    structuredData.uploadDate = parsedUploadDate.toISOString();
  }
  if (durationMatch) {
    structuredData.duration = `PT${Number(durationMatch[1])}M${Number(durationMatch[2])}S`;
  }
  if (webinar.videoPath) {
    structuredData.contentUrl = absolute(webinar.videoPath);
  }
  if (webinar.youtubeUrl) {
    structuredData.url = webinar.youtubeUrl;
  }

  return (
    <>
      {/* Hydration-safe structured data */}
      <Script
        id="video-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      <div className="min-h-screen bg-white">
        {/* Video Player */}
        <div className="relative w-full bg-[#f5f1eb]">
          <div className="container mx-auto max-w-7xl">
            <div
              className="relative aspect-video bg-[#f5f1eb] group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(isPlaying ? false : true)}
            >
              {useYoutubeEmbed ? (
                // No self-hosted file for this episode — embed the YouTube player directly
                // rather than pointing a custom player at a link that may not exist.
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
                  title={webinar.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full peer"
                    poster={webinar.thumbnailPath}
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    playsInline
                    preload="auto"
                    muted={isMuted}
                  >
                    <source src={webinar.videoPath.startsWith("") ? webinar.videoPath : `/${webinar.videoPath}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Overlay Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity duration-300 ${showControls ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"
                      }`}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-16 h-16 text-teal-400 opacity-50 fill-teal-400" />
                    ) : (
                      <Play className="w-16 h-16 text-teal-400 opacity-50 fill-teal-400" />
                    )}
                  </button>

                  {/* Bottom Controls */}
                  <div
                    className={`absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
                  >
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      disabled={duration === 0}
                      step="any"
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 mb-3 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#4ecdc4]"
                    />
                    <div className="flex items-center justify-between text-white text-sm">
                      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                      <div className="flex flex-row items-center space-x-2">
                        <div className="bg-black/50 rounded-md px-2 py-1 text-white text-sm">
                          <label htmlFor="playbackRate" className="mr-2">Speed:</label>
                          <select
                            id="playbackRate"
                            value={playbackRate}
                            onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                            className="bg-transparent text-white focus:outline-none"
                          >
                            <option value="0.5">0.5x</option>
                            <option value="0.75">0.75x</option>
                            <option value="1">1x</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                          </select>
                        </div>
                        <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="hover:text-[#4ecdc4] transition-colors">
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <input type="range" min={0} max={1} step={0.05} value={volume} onChange={handleVolumeChange} className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#4ecdc4]" />
                        <button onClick={toggleFullscreen} aria-label="Fullscreen" className="hover:text-[#4ecdc4] transition-colors">
                          <Maximize className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyLinkClicked}
              >
                Share
                <Forward className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/*Copy link modal*/}
        {linkModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
              <h2 className="text-lg font-semibold mb-4">Share Webinar Link</h2>
              <input
                type="text"
                readOnly
                value={copyUrl}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div>
                <input type="checkbox" id="startAtCheckbox" className="mr-2" onChange={toggleUseTimestamp} />
                <label htmlFor="startAtCheckbox" className="text-sm">
                  Include current time in link <span className="text-gray-500 text-sm">({formatTime(currentTime)})</span>
                </label>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setLinkModalOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(copyUrl);
                    setLinkModalOpen(false);
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="mt-8 p-6 bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 rounded-lg text-left">
          <div className="container mx-auto max-w-7xl py-8 px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-[#405862] mb-2 text-balance">{webinar.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-[#405862] mb-6">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {webinar.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {webinar.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {webinar.duration}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs bg-[#4ecdc4]/20 text-[#4ecdc4] px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <Card className="mt-8 p-6 bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 rounded-lg text-left">
                  <CardContent className="p-6">
                    <p className="text-[#405862]/80 mb-4">{webinar.description}</p>
                    <p className="text-[#405862]/60 text-sm leading-relaxed">{webinar.longDescription}</p>
                    {webinar.speaker && (
                      <p className="text-[#405862]/60 text-sm mt-4">
                        <span className="text-[#4ecdc4] font-semibold">Speaker:</span> {webinar.speaker}
                      </p>
                    )}
                    {webinar.host && (
                      <p className="text-[#405862]/60 text-sm">
                        <span className="text-[#4ecdc4] font-semibold">Hosted by:</span> {webinar.host}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Watch on Other Platforms */}
                <Card className="mt-8 p-6 bg-[#405862]/10 border border-[#405862]/30 rounded-lg text-left">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Watch on Other Platforms</h3>
                    <div className="space-y-3">
                      <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white justify-start" size="lg">
                        <a href={webinar.youtubeUrl} target="_blank" rel="noopener noreferrer">
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          Watch on YouTube
                        </a>
                      </Button>
                      {webinar.spotifyUrl && (
                        <Button
                          asChild
                          className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                          size="lg"
                        >
                          <a href={webinar.spotifyUrl} target="_blank" rel="noopener noreferrer">
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            Listen on Spotify
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Back to Main Site */}
                <Card className="mt-8 p-6 bg-[#405862]/10 border border-[#405862]/30 rounded-lg text-left">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Explore More</h3>
                    <div className="space-y-3">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start border-gray-700 bg-transparent"
                        size="lg"
                      >
                        <Link href="/">
                          <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
                          Dr. Interested Home
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start border-gray-700 bg-transparent"
                        size="lg"
                      >
                        <Link href="/publications">
                          <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
                          Read Our Publications
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start border-gray-700 bg-transparent"
                        size="lg"
                      >
                        <Link href="/events">
                          <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
                          View Events
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
