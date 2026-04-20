import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My Career <span>&</span>
          <br /> Experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Manager OCM</h4>
                <h5>Cognizant</h5>
              </div>
              <h3>2023 - NOW</h3>
            </div>
            <p>
              Led Offshore OCM Team, resulting in increased change adoption by 35% across global teams. Conducted in-depth training needs analysis and developed engaging VILT & Quick Reference Guides.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Manager HCM</h4>
                <h5>Delloite</h5>
              </div>
              <h3>2022 - 2023</h3>
            </div>
            <p>
              Led training needs assessments and change impact analysis, increasing SAP SuccessFactors adoption by 45%. Designed ILT materials and client-customized training strategies.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Manager Learning & Development</h4>
                <h5>Atos Global Solutions</h5>
              </div>
              <h3>2017 - 2022</h3>
            </div>
            <p>
              Established and managed a high-performing design team. Led integration of design, build, and validation processes. Managed training products from concept to execution.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Additional Certifications</h4>
                <h5>Professional Development</h5>
              </div>
              <h3></h3>
            </div>
            <p>
              WalkMe Builder I & II | Project Lead (2024-25)<br/>
              Certified Instructional Designer for eLearning (2017)<br/>
              FlowSpark Adaptive Learning Certification (2020)<br/>
              Certified Android Developer (2011-2012)
            </p>
          </div>
        </div>
      </div>

      {/* Rolling Company Logos Marquee */}
      <div className="career-companies-marquee">
        <Marquee speed={140} gradient={false}>
          {/* The react-fast-marquee handles infinite looping natively, so no duplicated hardcoded array is needed! added Cognizant! */}
          {["indianoil.jpg", "deloitte.jpg", "apple.png", "dell.jpg", "cognizant.svg"].map((file, i) => (
             <div key={i} style={{ margin: "0 60px", display: "flex", alignItems: "center" }}>
               <SmartLogo src={`${import.meta.env.BASE_URL}images/companies/${file}`} alt="Company Logo" />
             </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Career;

// A highly advanced dynamic CSS background stripping wrapper
const SmartLogo = ({ src, alt }: { src: string; alt: string }) => {
  const [cleanSrc, setCleanSrc] = useState(src);

  useEffect(() => {
    // If it's already an SVG, no background removal is needed!
    if (src.endsWith(".svg")) {
      setCleanSrc(src);
      return;
    }
    
    const img = new Image();
    // Use an isolated cache bypass so it loads cleanly onto the canvas
    img.src = src; 
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      
      // Draw pristine user logo to memory
      ctx.drawImage(img, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Loop over every pixel looking for the fake checkerboard
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          
          // Checkerboards are high lightness (r,g,b > 170) AND monochrome (very low color variance between rgb values)
          if (r > 170 && g > 170 && b > 170 && max - min < 25) {
            // Found a fake transparent pixel. Strip its alpha channel to 0!
            data[i + 3] = 0; 
          }
        }
        ctx.putImageData(imageData, 0, 0);
        // Regenerate and attach the newly cleaned transparent PNG
        setCleanSrc(canvas.toDataURL("image/png"));
      } catch (e) {
        // Safe fallback in case the canvas gets tainted
      }
    };
  }, [src]);

  return <img src={cleanSrc} alt={alt} className="company-logo-img" />;
};
