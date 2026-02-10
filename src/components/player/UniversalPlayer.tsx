import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface UniversalPlayerProps {
  url: string;
  title?: string;
  autoPlay?: boolean;
  thumbnailUrl?: string; // Optional cover image for audio
}

type PlayerType = "native" | "embed" | "youtube" | "vimeo" | "spotify" | "soundcloud" | "dailymotion" | "wistia" | "facebook" | "audio" | "raw_iframe";

export default function UniversalPlayer({
  url,
  title,
  autoPlay = false,
  thumbnailUrl,
}: UniversalPlayerProps) {
  const [playerType, setPlayerType] = useState<PlayerType>("native");
  const [embedUrl, setEmbedUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const { type, processedUrl, originalUrl } = detectPlayerType(url);
    setPlayerType(type);
    setEmbedUrl(processedUrl);
    setExternalUrl(originalUrl || url);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [url]);

  // SoundCloud: resolve to a valid widget src via oEmbed (SoundCloud prefers api.soundcloud.com URLs)
  useEffect(() => {
    if (playerType !== "soundcloud") return;

    let cancelled = false;

    const resolve = async () => {
      try {
        // SoundCloud oEmbed returns an iframe HTML snippet with a valid widget src
        const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(externalUrl)}&auto_play=${autoPlay ? "true" : "false"}`;
        const res = await fetch(oembedUrl);
        if (!res.ok) throw new Error(`SoundCloud oEmbed failed: ${res.status}`);
        const json = (await res.json()) as { html?: string };
        const html = json.html || "";
        const srcMatch = html.match(/src=["']([^"']+)["']/);
        const resolvedSrc = srcMatch?.[1];

        if (!cancelled && resolvedSrc) {
          setEmbedUrl(resolvedSrc);
        }
      } catch (e) {
        // Keep the fallback widget URL created in detectPlayerType
        console.warn("SoundCloud oEmbed resolve failed", e);
      }
    };

    resolve();

    return () => {
      cancelled = true;
    };
  }, [playerType, externalUrl, autoPlay]);

  const detectPlayerType = (inputUrl: string): { type: PlayerType; processedUrl: string; originalUrl?: string } => {
    const trimmedUrl = inputUrl.trim();

    // YouTube
    const youtubeMatch = trimmedUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (youtubeMatch) {
      return {
        type: "youtube",
        processedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=${autoPlay ? 1 : 0}&rel=0`,
      };
    }

    // Vimeo
    const vimeoMatch = trimmedUrl.match(
      /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
    );
    if (vimeoMatch) {
      return {
        type: "vimeo",
        processedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoPlay ? 1 : 0}`,
      };
    }

    // Audio files - use enhanced audio player
    const audioExtensions = /\.(mp3|wav|m4a|aac|flac|ogg|wma|opus|webm)(\?|$)/i;
    if (audioExtensions.test(trimmedUrl)) {
      return { type: "audio", processedUrl: trimmedUrl };
    }

    // SoundCloud - convert to widget embed URL
    if (trimmedUrl.includes("soundcloud.com")) {
      // SoundCloud widget requires URL-encoded track URL
      const encodedUrl = encodeURIComponent(trimmedUrl);
      return {
        type: "soundcloud",
        processedUrl: `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%2306b6d4&auto_play=${autoPlay}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`,
        originalUrl: trimmedUrl,
      };
    }

    // Spotify
    if (trimmedUrl.includes("spotify.com")) {
      const spotifyMatch = trimmedUrl.match(/spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
      if (spotifyMatch) {
        return {
          type: "spotify",
          processedUrl: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?utm_source=generator&theme=0`,
        };
      }
    }

    // Dailymotion
    const dailymotionMatch = trimmedUrl.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
    if (dailymotionMatch) {
      return {
        type: "dailymotion",
        processedUrl: `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}?autoplay=${autoPlay ? 1 : 0}`,
      };
    }

    // Wistia (supports home.wistia.com and wistia.com)
    const wistiaMatch = trimmedUrl.match(/(?:home\.)?wistia\.com\/medias\/([a-zA-Z0-9]+)/);
    if (wistiaMatch) {
      return {
        type: "wistia",
        processedUrl: `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}?autoplay=${autoPlay}`,
      };
    }

    // Facebook Video
    const fbVideoMatch = trimmedUrl.match(/facebook\.com\/(?:watch\/?\?v=|.*\/videos\/)(\d+)/);
    if (fbVideoMatch) {
      const encodedUrl = encodeURIComponent(trimmedUrl);
      return {
        type: "facebook",
        processedUrl: `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=560`,
        originalUrl: trimmedUrl,
      };
    }

    // Facebook Post with video
    if (trimmedUrl.includes("facebook.com") && (trimmedUrl.includes("/posts/") || trimmedUrl.includes("/reel/"))) {
      const encodedUrl = encodeURIComponent(trimmedUrl);
      return {
        type: "facebook",
        processedUrl: `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=false&width=560`,
        originalUrl: trimmedUrl,
      };
    }

    // TED Talks
    const tedMatch = trimmedUrl.match(/ted\.com\/talks\/([a-zA-Z0-9_]+)/);
    if (tedMatch) {
      return {
        type: "embed",
        processedUrl: `https://embed.ted.com/talks/${tedMatch[1]}`,
      };
    }

    // Streamable
    const streamableMatch = trimmedUrl.match(/streamable\.com\/([a-zA-Z0-9]+)/);
    if (streamableMatch) {
      return {
        type: "embed",
        processedUrl: `https://streamable.com/e/${streamableMatch[1]}`,
      };
    }

    // Raw iframe embed code - keep as-is for direct rendering
    if (trimmedUrl.toLowerCase().startsWith("<iframe")) {
      return {
        type: "raw_iframe",
        processedUrl: trimmedUrl, // Store raw iframe HTML
      };
    }

    // Already an embed URL (Gumlet, Adilo, etc.)
    if (
      trimmedUrl.includes("embed") ||
      trimmedUrl.includes("player.") ||
      trimmedUrl.includes("gumlet.io") ||
      trimmedUrl.includes("adilo.") ||
      trimmedUrl.includes("cdn.") ||
      trimmedUrl.includes("killerplayer")
    ) {
      return {
        type: "embed",
        processedUrl: trimmedUrl,
      };
    }

    // Direct media files (MP4, WebM, HLS, etc.)
    const mediaExtensions = /\.(mp4|webm|ogg|m3u8|mp3|wav|m4a|aac|flac|mov)(\?|$)/i;
    if (mediaExtensions.test(trimmedUrl)) {
      return { type: "native", processedUrl: trimmedUrl };
    }

    // HLS streams
    if (trimmedUrl.includes(".m3u8") || trimmedUrl.includes("manifest")) {
      return { type: "native", processedUrl: trimmedUrl };
    }

    // Default to embed for unknown URLs
    return { type: "embed", processedUrl: trimmedUrl };
  };

  const isAudioFile = (inputUrl: string) => {
    return /\.(mp3|wav|m4a|aac|flac|ogg)(\?|$)/i.test(inputUrl);
  };

  const mediaElement = isAudioFile(url) ? audioRef.current : videoRef.current;

  const handlePlayPause = () => {
    if (mediaElement) {
      if (isPlaying) {
        mediaElement.pause();
      } else {
        mediaElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (mediaElement) {
      mediaElement.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleMuteToggle = () => {
    if (mediaElement) {
      mediaElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    if (mediaElement) {
      mediaElement.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaElement) {
      setCurrentTime(mediaElement.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaElement) {
      setDuration(mediaElement.duration);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleSkip = (seconds: number) => {
    if (mediaElement) {
      mediaElement.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Facebook player
  if (playerType === "facebook") {
    return (
      <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-blue-900/20 to-blue-600/10 flex items-center justify-center">
        <iframe
          src={embedUrl}
          className="w-full h-full min-h-[400px]"
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          title={title || "Facebook Video"}
        />
      </div>
    );
  }

  // Spotify player
  if (playerType === "spotify") {
    return (
      <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-green-900/20 to-green-600/10 flex items-center justify-center">
        <iframe
          src={embedUrl}
          className="w-full h-full min-h-[352px]"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={title || "Spotify Player"}
          style={{ borderRadius: "12px" }}
        />
      </div>
    );
  }

  // SoundCloud player
  if (playerType === "soundcloud") {
    return (
      <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-orange-900/20 to-orange-600/10 flex items-center justify-center">
        <iframe
          src={embedUrl}
          className="w-full h-full min-h-[300px]"
          allow="autoplay"
          loading="lazy"
          title={title || "SoundCloud Player"}
          style={{ border: "none" }}
        />
      </div>
    );
  }

  // Render raw iframe embeds (user-provided iframe code)
  if (playerType === "raw_iframe") {
    // Sanitize the iframe to only allow safe attributes
    const sanitizeIframe = (html: string): string => {
      // Basic sanitization: only allow iframe tags with safe attributes
      const match = html.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/i);
      if (!match) return html;
      
      // Extract key attributes from the original iframe
      const srcMatch = html.match(/src=["']([^"']+)["']/i);
      const styleMatch = html.match(/style=["']([^"']+)["']/i);
      const allowMatch = html.match(/allow=["']([^"']+)["']/i);
      
      const src = srcMatch?.[1] || "";
      const style = styleMatch?.[1] || "width:100%;height:100%;";
      const allow = allowMatch?.[1] || "autoplay; gyroscope; picture-in-picture; fullscreen";
      
      return `<iframe src="${src}" style="${style};position:absolute;inset:0;width:100%;height:100%;" allow="${allow}" allowfullscreen frameborder="0"></iframe>`;
    };
    
    return (
      <div 
        ref={containerRef} 
        className="relative w-full h-full bg-black"
        style={{ aspectRatio: "16/9" }}
        dangerouslySetInnerHTML={{ __html: sanitizeIframe(embedUrl) }}
      />
    );
  }

  // Render embed player (YouTube, Vimeo, Dailymotion, Wistia, Gumlet, Adilo, etc.)
  if (playerType === "youtube" || playerType === "vimeo" || playerType === "embed" || playerType === "dailymotion" || playerType === "wistia") {
    return (
      <div ref={containerRef} className="relative w-full h-full bg-black">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title={title || "Video Player"}
        />
      </div>
    );
  }

  // Enhanced Audio Player with optional cover image
  if (playerType === "audio" || isAudioFile(url)) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-900/30 to-purple-900/30 p-6 min-h-[300px]">
        {/* Album Art / Thumbnail */}
        <div className="relative mb-6">
          {thumbnailUrl ? (
            <div className="w-40 h-40 rounded-xl overflow-hidden shadow-2xl ring-4 ring-white/10">
              <img 
                src={thumbnailUrl} 
                alt={title || "Audio cover"} 
                className="w-full h-full object-cover"
              />
              {/* Play overlay on image */}
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1" />
                  )}
                </div>
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center shadow-2xl ring-4 ring-white/10">
              <Volume2 className="h-14 w-14 text-violet-400" />
            </div>
          )}
        </div>
        
        {/* Title */}
        {title && (
          <h3 className="text-lg font-semibold text-foreground mb-2 text-center max-w-md line-clamp-2">
            {title}
          </h3>
        )}
        
        {/* Audio Format Badge */}
        <Badge variant="secondary" className="mb-4 text-xs">
          {url.match(/\.(mp3|wav|m4a|aac|flac|ogg|wma|opus)(\?|$)/i)?.[1]?.toUpperCase() || "AUDIO"}
        </Badge>

        <audio
          ref={audioRef}
          src={embedUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          autoPlay={autoPlay}
        />

        <div className="w-full max-w-md space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSkip(-10)}
              className="text-foreground hover:text-violet-400"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={handlePlayPause}
              className={`h-14 w-14 rounded-full transition-all ${isPlaying ? 'bg-violet-500 hover:bg-violet-600' : 'bg-primary hover:bg-primary/90'}`}
            >
              {isPlaying ? (
                <Pause className="h-7 w-7" />
              ) : (
                <Play className="h-7 w-7 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSkip(10)}
              className="text-foreground hover:text-violet-400"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMuteToggle}
              className="text-foreground"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-28"
            />
          </div>
        </div>
      </div>
    );
  }

  // Render native video player
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={embedUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        autoPlay={autoPlay}
        onClick={handlePlayPause}
      />

      {/* Video Controls Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full mb-3"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSkip(-10)}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSkip(10)}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>

            <span className="text-white text-sm ml-3">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Center Play Button (when paused) */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handlePlayPause}
        >
          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="h-8 w-8 text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
