import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const POLL_MS = 15000;


async function fetchLanyardPresence(discordUserId, signal) {
  const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`, { signal });
  if (!res.ok) throw new Error(`Lanyard request failed: ${res.status}`);
  const json = await res.json();
  return json?.data ?? null;
}

export default function SpotifyOverlay() {
  const discordUserId = process.env.REACT_APP_DISCORD_USER_ID;
  const { isDark } = useTheme();

  const [status, setStatus] = useState({ state: "loading" });
  const [paused, setPaused] = useState(false);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  // distance we can scroll (scrollWidth - viewportWidth)
  const [maxScroll, setMaxScroll] = useState(0);
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  // 1 forward, -1 backward
  const directionRef = useRef(1);
  const [edgePause, setEdgePause] = useState(false);
  const edgePauseRef = useRef(edgePause);

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

  // reset offset/direction when scrolling is no longer needed or max changes
  // reset offset/direction when scrolling is no longer needed or max changes
  useEffect(() => {
    if (!shouldMarquee || maxScroll === 0) {
      offsetRef.current = 0;
      setOffset(0);
      directionRef.current = 1;
    }
  }, [shouldMarquee, maxScroll]);

  useLayoutEffect(() => {
    if (status.state !== "playing") {
      setShouldMarquee(false);
      setMaxScroll(0);
      return;
    }

    const viewport = textViewportRef.current;
    const line = textLineRef.current;
    if (!viewport || !line) return;

    const compute = () => {
      const overflowing = line.scrollWidth > viewport.clientWidth + 1;
      console.debug("SpotifyOverlay compute", {overflowing, scrollWidth: line.scrollWidth, viewportWidth: viewport.clientWidth});
      setShouldMarquee(overflowing);
      const newMax = overflowing ? line.scrollWidth - viewport.clientWidth : 0;
      console.debug("SpotifyOverlay setMaxScroll", {newMax});
      setMaxScroll(newMax);
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(viewport);
    ro.observe(line);

    return () => ro.disconnect();
  }, [status.state, lineText]);

  const stop = () => setPaused(true);
  const start = () => setPaused(false);

  // animation effect for scrolling
  useEffect(() => {
    edgePauseRef.current = edgePause;
  }, [edgePause]);

  useEffect(() => {

    if (!shouldMarquee || paused || maxScroll <= 0) return;

    let rafId;
    let lastTime = null;

    const speed = 0.05; // pixels per ms (~50px/sec)

    const step = (time) => {
      if (lastTime === null) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      if (!edgePauseRef.current) {
        let next = offsetRef.current + directionRef.current * speed * delta;
        console.debug("SpotifyOverlay step", {prev: offsetRef.current, next, maxScroll, direction: directionRef.current});
        if (next >= maxScroll) {
          next = maxScroll;
          console.debug("SpotifyOverlay reached end", {next});
          directionRef.current = -1;
          setEdgePause(true);
          edgePauseRef.current = true;
          setTimeout(() => {
            setEdgePause(false);
            edgePauseRef.current = false;
          }, 1500);
        } else if (next <= 0) {
          next = 0;
          console.debug("SpotifyOverlay reached start", {next});
          directionRef.current = 1;
          setEdgePause(true);
          edgePauseRef.current = true;
          setTimeout(() => {
            setEdgePause(false);
            edgePauseRef.current = false;
          }, 1500);
        }
        offsetRef.current = next;
        setOffset(next);
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [shouldMarquee, paused, maxScroll]);

  const card = (
    <div
      className={[
        "pointer-events-auto opacity-80 hover:opacity-100 transition-opacity",
        "max-w-[92vw] sm:max-w-md md:max-w-[450px]",
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
      <FaSpotify
        size={12}
        className={[isDark ? "text-green-400" : "text-green-600", "flex-shrink-0"].join(" ")}
      />

      {status.state !== "playing" ? (
        <div className={["text-sm", mutedText].join(" ")}>{statusText}</div>
      ) : (
        <div ref={textViewportRef} className="overflow-hidden">
          <div
            ref={textLineRef}
            className="inline-flex whitespace-nowrap text-sm"
            style={{
              transform: shouldMarquee ? `translateX(-${offset}px)` : 'none',
              transition: edgePause ? 'none' : 'transform 0.1s linear',
            }}
          >
            <span className={shouldMarquee ? 'pr-1' : 'truncate'}>{nowPlayingContent}</span>
          </div>
        </div>
      )}

    </div>
  );

  return card;
}
