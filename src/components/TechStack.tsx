import React, { useRef } from "react";
import "./styles/TechStack.css";
import {
  RiNavigationLine,
  RiMacbookLine,
  RiBookOpenLine,
  RiVidiconLine,
  RiVideoLine,
  RiRocketLine,
  RiLightbulbFlashLine,
  RiTeamLine,
} from "react-icons/ri";

const skillsList = [
  {
    title: "WalkMe",
    desc: "Digital Adoption Platform for unified user experiences.",
    Icon: RiNavigationLine,
  },
  {
    title: "SAP Enable Now",
    desc: "In-app help and learning materials for SAP ecosystems.",
    Icon: RiMacbookLine,
  },
  {
    title: "Storyline",
    desc: "Interactive e-learning courses and customized training.",
    Icon: RiBookOpenLine,
  },
  {
    title: "Captivate",
    desc: "Responsive e-learning authoring and simulations.",
    Icon: RiVidiconLine,
  },
  {
    title: "Camtasia",
    desc: "Professional video editing and screen recording.",
    Icon: RiVideoLine,
  },
  {
    title: "uPerform",
    desc: "Just-in-time training and performance support.",
    Icon: RiRocketLine,
  },
  {
    title: "L&D Strategy",
    desc: "Driving high-impact organizational learning outcomes.",
    Icon: RiLightbulbFlashLine,
  },
  {
    title: "Change Management",
    desc: "Guiding transitions and maximizing user adoption.",
    Icon: RiTeamLine,
  },
];

const TechCard = ({ skill }: { skill: typeof skillsList[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className="tech-card"
      onMouseMove={handleMouseMove}
    >
      <div className="tech-icon-wrapper">
        <skill.Icon className="tech-icon" />
      </div>
      <div className="tech-info">
        <h3 className="tech-title">{skill.title}</h3>
        <p className="tech-desc">{skill.desc}</p>
      </div>
    </div>
  );
};

const TechStack = () => {
  return (
    <div className="techstack" id="techstack">
      <h2>Core Competencies & Skills</h2>
      <div className="bento-grid">
        {skillsList.map((skill, index) => (
          <TechCard key={index} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export default TechStack;
