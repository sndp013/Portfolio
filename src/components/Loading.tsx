import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";


const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (percent >= 100 && !loaded) {
      const timer = setTimeout(() => {
        setLoaded(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [percent, loaded]);

  useEffect(() => {
    import("./utils/initialFX").then((module) => {
      if (isLoaded) {
        setClicked(true);
        setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        }, 900);
      }
    });
  }, [isLoaded]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          SJ
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className={`loading-images-bg ${clicked && "loading-images-fade"}`}>
          <div className="loading-img-column loading-img-column-1">
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample1.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample4.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample7.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample10.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample13.png`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample1.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample4.JPG`} alt="Work" />
          </div>
          <div className="loading-img-column loading-img-column-2">
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample2.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample5.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample8.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample11.png`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample14.png`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample2.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample5.JPG`} alt="Work" />
          </div>
          <div className="loading-img-column loading-img-column-3">
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample3.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample6.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample9.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample12.png`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample3.JPG`} alt="Work" />
            <img src={`${import.meta.env.BASE_URL}images/work_samples/sample6.JPG`} alt="Work" />
          </div>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
          onClick={() => {
            if (loaded && !clicked) {
              setIsLoaded(true);
            }
          }}
          style={{ cursor: loaded && !clicked ? "pointer" : "default" }}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
