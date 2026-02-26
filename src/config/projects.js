const projectsData = [
  {
    slug: "urf",
    title: "URF Radio Website",
    image: `${process.env.PUBLIC_URL}/images/projects/urf.png`,
    date: "15-02-2024",
    links: { website: "https://urfonline.com" },
    description: "URF is a radio show society at the University of Sussex. They approached me and commissioned me to create a designed website with a functional dashboard included. It took about 250 hours of work and a lot of client meetings, but it got completed and is fully operational."
  },
  {
    slug: "easy-trip-planner",
    title: "Easy Trip Planner",
    image: `${process.env.PUBLIC_URL}/images/projects/easytripplanner.png`,
    date: "26-04-2025",
    links: { github: "https://github.com/natbates/EventPlannerFront", website: "https://easytripplanner.uk" },
    description: "With the sole goal of making planning holidays easier with my friends and family, I set about making my own personal shared calendar website with plenty of useful features including: polls, links, to-do list, comments, and dynamic locations. I created all the drawings and set up the front end, back end, and the server."
  }
];

export default projectsData;