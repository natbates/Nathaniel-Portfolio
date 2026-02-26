import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ASCIIText from "../../components/text/ascitext";
import blogData from "../../config/blog";
import projectsData from "../../config/projects";
import experienceData from "../../config/experience";
import { getMostRecentItem } from "../../utils/content";
import catBody from "../../assets/cat-body.svg";
import catHand from "../../assets/cat-hand.svg";

const latestItems = [
  { label: "Blog", item: getMostRecentItem(blogData), to: "/blog", detailBase: "/blog" },
  { label: "Projects", item: getMostRecentItem(projectsData), to: "/projects", detailBase: "/projects" },
  { label: "Experience", item: getMostRecentItem(experienceData), to: "/experience", detailBase: "/experience" },
];

export default function Home() {
  const navigate = useNavigate();
  const [wavesEnabled, setWavesEnabled] = useState(false);

  const triggerWaves = () => {
    setWavesEnabled((current) => !current);
  };

  return (
    <section className="relative flex flex-col flex-1 p-4 gap-12">
      <div className="md:hidden w-full relative">
        <div className="home-catbody-wrap relative w-full overflow-hidden border-b-2">
          <img src={catBody} alt="Nat Bates hero" className="home-catbody-pop w-full h-auto object-cover" />
        </div>
        <img src={catHand} alt="" className="w-[90px] h-auto object-contain absolute left-1 bottom-[-32px] z-10" />
        <img src={catHand} alt="" className="w-[90px] h-auto object-contain absolute right-1 bottom-[-32px] z-10" />
      </div>

      <div
        className="home-ascii-wrap hidden md:block relative h-[170px] sm:h-[210px] md:h-[240px] cursor-pointer"
        onClick={triggerWaves}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            triggerWaves();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Toggle ASCII wave animation"
      >
        <ASCIIText
          enableWaves={wavesEnabled}
          maxRotation={0.02}
          asciiFontSize={9}
          text="nat bates"
        />
      </div>

      <p className="home-tagline-anim text-center text-sm sm:text-base opacity-80 mt-2">
        Web developer specialising in React and Next.js. I build fast, accessible, and user-friendly websites and applications.
      </p>

      <div className="home-cta-mobile-anim md:hidden w-full flex justify-center mb-6" style={{ animationDelay: '400ms' }}>
        <button
          type="button"
          className="primary"
          onClick={() => navigate("/contact")}
        >
          Contact Me
        </button>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-4 pt-8 max-w-[1400px] mx-auto">
        {latestItems.map(({ label, item, to, detailBase }, index) => (
          <article
            key={label}
            className="home-preview-card relative border p-3 min-h-[124px]"
            style={{ animationDelay: `${620 + index * 180}ms` }}
          >
            {item ? (
              <Link to={`${detailBase}/${item.slug}`} className="flex items-center gap-3 !no-underline h-full">
                <span className="absolute tracking-[5px] !text-[color:var(--text-colour)] italic opacity-60 text-sm left-0 top-[-28px]">{label}</span>
                <div className="min-w-0 h-full flex flex-col flex-1">
                  <h3 className="text-lg leading-tight mt-auto break-words md:truncate">{item.title}</h3>
                  <p className="mt-auto text-[10px] opacity-100 !text-[color:var(--text-colour)]">{item.date}</p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center h-full">
                <p>No entries yet.</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="home-cta-anim hidden md:flex w-full justify-center">
        <button
          type="button"
          className="primary"
          onClick={() => navigate("/contact")}
        >
          Contact Me
        </button>
      </div>
    </section>
  );
}
