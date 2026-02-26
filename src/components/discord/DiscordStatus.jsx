import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const POLL_MS = 15000;

async function fetchLanyardPresence(discordUserId, signal) {
  const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`, { signal });
  if (!res.ok) throw new Error(`Lanyard request failed: ${res.status}`);
  const json = await res.json();
  return json?.data ?? null;
}

const statusColors = {
  online: "bg-[#3ba55d]",
  idle: "bg-[#faa81a]",
  dnd: "bg-[#ed4245]",
  offline: "bg-[#747f8d]",
  streaming: "bg-[#593695]",
};

export default function DiscordStatus() {
  const discordUserId = process.env.REACT_APP_DISCORD_USER_ID;
  const { isDark } = useTheme();
  const [presence, setPresence] = useState(null);
  const [loading, setLoading] = useState(true);

  const border = isDark ? "border-gray-500/50" : "border-gray-300";

  useEffect(() => {
    if (!discordUserId) {
      setLoading(false);
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
        if (mounted) {
          setPresence(data);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setLoading(false);
        }
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

  if (loading || !presence) return null;

  const status = presence.discord_status || "offline";
  const colorClass = statusColors[status] || statusColors.offline;

  return (
    <div
      className={`
        pointer-events-auto opacity-80 hover:opacity-100 transition-opacity
        flex items-center gap-3 px-3 py-2 border w-fit
        ${border}
        bg-[color:var(--background-colour)]
        text-[color:var(--text-colour)]
      `}
    >
      <div className={`w-3 h-3 rounded-full ${colorClass}`} title={status} />
      <span className="text-xs uppercase tracking-[0.2em] font-medium scale-90 origin-left">
        {status}
      </span>
    </div>
  );
}
