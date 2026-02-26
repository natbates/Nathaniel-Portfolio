import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const POLL_MS = 15000;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(max-width: 640px)")?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return isMobile;
}

async function fetchLanyardPresence(discordUserId, signal) {
  const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`, { signal });
  if (!res.ok) throw new Error(`Lanyard request failed: ${res.status}`);
  const json = await res.json();
  return json?.data ?? null;
}

export default function SpotifyOverlay() {
  const discordUserId = process.env.REACT_APP_DISCORD_USER_ID;
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  const [status, setStatus] = useState({ state: "loading" });
  const [paused, setPaused] = useState(false);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const [marqueeDistance, setMarqueeDistance] = useState(0);

  const textViewportRef = useRef(null);
  const textLineRef = useRef(null);

  const mutedText = isDark ? "text-gray-300" : "text-gray-700";
  const border = isDark ? "border-gray-500/50" : "border-gray-300";

  const lineText = useMemo(() => {
    if (status.state !== "playing") return "";
    return `${status.song} by ${status.artist}`;
  }, [status]);

  const trackUrl = status.state === "playing" && status.trackId ? `https://open.spotify.com/track/${status.trackId}` : null;
  const artistUrl =
    status.state === "playing" && status.artist
      ? `https://open.spotify.com/search/${encodeURIComponent(status.artist)}`
      : null;

  const nowPlayingContent =
    status.state === "playing" ? (
      <span className="inline-flex items-baseline gap-2">
        <a href={trackUrl ?? "https://open.spotify.com"} target="_blank" rel="noopener noreferrer" className="font-medium">
          {status.song}
        </a>
        <span className={mutedText}>by</span>
        <a href={artistUrl ?? "https://open.spotify.com"} target="_blank" rel="noopener noreferrer" className="font-medium">
          {status.artist}
        </a>
      </span>
    ) : null;

  const statusText = useMemo(() => {
    switch (status.state) {
      case "missing-config":
        return "Set REACT_APP_DISCORD_USER_ID";
      case "loading":
        return "Loading…";
      case "error":
        return "Unavailable";
      case "not-playing":
        return "Nothing playing";
      default:
        return null;
    }
  }, [status.state]);

  useEffect(() => {
    if (!discordUserId) {
      setStatus({ state: "missing-config" });
      return;
    }

    let mounted = true;
    let timer = null;
    let abortController = null;

    const tick = async () => {
      abortController?.abort();
      abortController = new AbortController();

      try {
        const data = await fetchLanyardPresence(discordUserId, abortController.signal);
        if (!mounted) return;

        if (data?.listening_to_spotify && data?.spotify) {
          setStatus({
            state: "playing",
            song: data.spotify.song,
            artist: data.spotify.artist,
            trackId: data.spotify.track_id,
          });
        } else {
          setStatus({ state: "not-playing" });
        }
      } catch (e) {
        if (!mounted) return;
        setStatus({ state: "error" });
      }
    };

    tick();
    timer = window.setInterval(tick, POLL_MS);

    return () => {
      mounted = false;
      if (timer) window.clearInterval(timer);
      abortController?.abort();
    };
  }, [discordUserId]);

  useLayoutEffect(() => {
    if (!isMobile) {
      setShouldMarquee(false);
      setMarqueeDistance(0);
      return;
    }

    if (status.state !== "playing") {
      setShouldMarquee(false);
      setMarqueeDistance(0);
      return;
    }

    const viewport = textViewportRef.current;
    const line = textLineRef.current;
    if (!viewport || !line) return;

    const compute = () => {
      const overflowing = line.scrollWidth > viewport.clientWidth + 1;
      setShouldMarquee(overflowing);
      if (overflowing) {
        setMarqueeDistance(Math.ceil(line.scrollWidth / 2));
      } else {
        setMarqueeDistance(0);
      }
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(viewport);
    ro.observe(line);

    return () => ro.disconnect();
  }, [isMobile, status.state, lineText]);

  const stop = () => setPaused(true);
  const start = () => setPaused(false);

  const card = (
    <div
      className={[
        "pointer-events-auto",
        "max-w-[92vw] sm:max-w-md md:max-w-lg",
        "px-3 py-2 border",
        border,
        "bg-[color:var(--background-colour)]",
        "text-[color:var(--text-colour)]",
        "flex items-center gap-2",
      ].join(" ")}
      onMouseEnter={stop}
      onMouseLeave={start}
      onTouchStart={stop}
      onTouchEnd={start}
    >
      <FaSpotify className={isDark ? "text-green-400" : "text-green-600"} />

      {status.state !== "playing" ? (
        <div className={["text-sm", mutedText].join(" ")}>{statusText}</div>
      ) : !shouldMarquee ? (
        <div className="text-sm truncate">{nowPlayingContent}</div>
      ) : (
        <div ref={textViewportRef} className="overflow-hidden">
          <div
            ref={textLineRef}
            className="inline-flex whitespace-nowrap text-sm"
            style={{
              "--nb-marquee-distance": `${marqueeDistance}px`,
              animation: marqueeDistance > 0 ? "nb-marquee 10s linear infinite" : "none",
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            <span className="pr-8">{nowPlayingContent}</span>
            <span aria-hidden="true" className="pr-8">
              {nowPlayingContent}
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes nb-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-1 * var(--nb-marquee-distance))); }
        }
      `}</style>
    </div>
  );

  return card;
}
