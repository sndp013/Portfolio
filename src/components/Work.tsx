import { useState } from "react";
import "./styles/Work.css";

const basePath = import.meta.env.BASE_URL;

const workSamples = [
  `${basePath}images/work_samples/sample1.JPG`,
  `${basePath}images/work_samples/sample2.JPG`,
  `${basePath}images/work_samples/sample3.JPG`,
  `${basePath}images/work_samples/sample4.JPG`,
  `${basePath}images/work_samples/sample5.JPG`,
  `${basePath}images/work_samples/sample6.JPG`,
  `${basePath}images/work_samples/sample7.JPG`,
  `${basePath}images/work_samples/sample8.JPG`,
  `${basePath}images/work_samples/sample9.JPG`,
  `${basePath}images/work_samples/sample10.JPG`,
  `${basePath}images/work_samples/sample11.png`,
  `${basePath}images/work_samples/sample12.png`,
  `${basePath}images/work_samples/sample13.png`,
  `${basePath}images/work_samples/sample14.png`,
];

const Work = () => {
  const [hoveredImg, setHoveredImg] = useState<string | null>(null);

  // Split images into two rows
  const row1 = workSamples.slice(0, 7);
  const row2 = workSamples.slice(7, 14);

  // Double the array for seamless infinite scroll
  const loopRow1 = [...row1, ...row1];
  const loopRow2 = [...row2, ...row2];

  return (
    <div className="work-section" id="work">
      {/* Fullscreen Preview Overlay */}
      <div className={`work-full-preview ${hoveredImg ? "preview-active" : ""}`}>
        {hoveredImg && (
          <img src={hoveredImg} alt="Preview" key={hoveredImg} className="preview-img-anim" />
        )}
      </div>

      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div 
          className="work-marquee-wrapper"
          style={{ display: "flex", flexDirection: "column", gap: "40px" }}
        >
          
          {/* TRACK 1 (Moves Left to Right) */}
          <div className="work-marquee-track track-1">
            {loopRow1.map((img, index) => (
              <div
                className="clay-card-wrapper small-card"
                key={`r1-${index}`}
                onMouseEnter={() => setHoveredImg(img)}
                onMouseLeave={() => setHoveredImg(null)}
              >
                <div className="clay-card matte-glossy" data-cursor="pointer">
                  <img src={img} alt={`Work Sample`} loading="lazy" />
                </div>
              </div>
            ))}
          </div>

          {/* TRACK 2 (Moves Right to Left) */}
          <div className="work-marquee-track track-2">
            {loopRow2.map((img, index) => (
              <div
                className="clay-card-wrapper small-card"
                key={`r2-${index}`}
                onMouseEnter={() => setHoveredImg(img)}
                onMouseLeave={() => setHoveredImg(null)}
              >
                <div className="clay-card matte-glossy" data-cursor="pointer">
                  <img src={img} alt={`Work Sample`} loading="lazy" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Work;
