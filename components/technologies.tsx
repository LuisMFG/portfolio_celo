
import {
    DiDotnet,
    DiNodejs,
    DiReact,
    DiAngularSimple,
    DiPostgresql,
    DiDocker,
    DiGit,
  } from "react-icons/di"
  
  import {
    SiTypescript,
    SiNextdotjs,
    SiTailwindcss,
    SiSpring,
  } from "react-icons/si"
  
  export const technologies = [
    { name: ".NET", icon: <DiDotnet size={75} /> },
    { name: "Node.js", icon: <DiNodejs size={75} /> },
    { name: "TypeScript", icon: <SiTypescript size={75} /> },
    { name: "Next.js", icon: <SiNextdotjs size={75} /> },
    { name: "React", icon: <DiReact size={75} /> },
    { name: "Angular", icon: <DiAngularSimple size={75} /> },
    { name: "Spring", icon: <SiSpring size={75} /> },
    { name: "Tailwind", icon: <SiTailwindcss size={75} /> },
    { name: "Git", icon: <DiGit size={75} /> },
    { name: "Docker", icon: <DiDocker size={75} /> },
    { name: "PostgreSQL", icon: <DiPostgresql size={75} /> },
  ]
  