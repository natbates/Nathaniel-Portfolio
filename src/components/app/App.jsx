import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../../pages/home/Home";
import Blog from "../../pages/blog/Blog";
import BlogDetail from "../../pages/blog/BlogDetail";
import Projects from "../../pages/projects/Projects";
import ProjectDetail from "../../pages/projects/ProjectDetail";
import Contact from "../../pages/contact/Contact";
import Experience from "../../pages/experience/Experience";
import ExperienceDetail from "../../pages/experience/ExperienceDetail";
import NotFound from "../../pages/notfound/NotFound";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";
import messages from "./app.messages";
import { useTheme } from "../../context/ThemeContext";
import SpotifyOverlay from "../spotify/SpotifyOverlay";
import DiscordStatus from "../discord/DiscordStatus";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";


const App = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen px-1 md:px-4">
      <header className="flex px-1 justify-between items-center py-5 flex-wrap gap-6">
        <div className="flex gap-2 items-center">
          <img src = {logo} alt="Logo" className="cursor-pointer h-8" onClick={() => {navigate("/")}}/>
          <p className="whitespace-nowrap"><a className="mr-2" target="_blank" rel="noopener noreferrer" href={process.env.REACT_APP_GITHUB_URL}>nat bates</a>/ portfolio</p>
        </div>
        <Nav />
      </header>

      <main className="flex-1 py-4 md:py-8 mx-auto w-full flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/experience/:slug" element={<ExperienceDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <div className="hidden md:flex fixed bottom-4 left-4 z-50 pointer-events-none flex-col gap-2">
        <div className="social-fly-up social-delay-1">
          <DiscordStatus />
        </div>
        <div className="social-fly-up social-delay-2">
          <SpotifyOverlay />
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default App;
