import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;
      let glasses: THREE.Group | null = null;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          if (headBone) {
            glasses = new THREE.Group();
            glasses.name = "spectacles";

            const frameMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.8 });
            const lensMat = new THREE.MeshPhysicalMaterial({
              color: 0x222222,
              transmission: 0.5,
              opacity: 1,
              transparent: true,
              roughness: 0.1,
              ior: 1.5,
              thickness: 0.01,
            });

            // Adjust dimensions suitable for a character where camera Y=13. 
            // If camera is at 13, head is probably around Y=11-13.
            // A typical face width at that scale would be ~1.5 units.
            const S = 10; // Scale multiplier (if 1 unit = 10cm, human is 18 units)
            const eyeRadius = 0.035 * S; // 0.35
            const bridgeWidth = 0.02 * S; // 0.2

            const leftFrame = new THREE.Mesh(new THREE.TorusGeometry(eyeRadius, 0.003 * S, 16, 64), frameMat);
            leftFrame.position.set(-eyeRadius - bridgeWidth / 2, 0, 0);
            const leftLens = new THREE.Mesh(new THREE.CylinderGeometry(eyeRadius, eyeRadius, 0.002 * S, 32), lensMat);
            leftLens.rotation.x = Math.PI / 2;
            leftFrame.add(leftLens);

            const rightFrame = new THREE.Mesh(new THREE.TorusGeometry(eyeRadius, 0.003 * S, 16, 64), frameMat);
            rightFrame.position.set(eyeRadius + bridgeWidth / 2, 0, 0);
            const rightLens = new THREE.Mesh(new THREE.CylinderGeometry(eyeRadius, eyeRadius, 0.002 * S, 32), lensMat);
            rightLens.rotation.x = Math.PI / 2;
            rightFrame.add(rightLens);

            const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.002 * S, 0.002 * S, bridgeWidth), frameMat);
            bridge.rotation.z = Math.PI / 2;

            const armLen = 0.12 * S;
            const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.002 * S, 0.002 * S, armLen), frameMat);
            leftArm.position.set(-eyeRadius * 2 - bridgeWidth / 2, 0, -armLen / 2);
            leftArm.rotation.x = Math.PI / 2;

            const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.002 * S, 0.002 * S, armLen), frameMat);
            rightArm.position.set(eyeRadius * 2 + bridgeWidth / 2, 0, -armLen / 2);
            rightArm.rotation.x = Math.PI / 2;

            glasses.add(leftFrame, rightFrame, bridge, leftArm, rightArm);
            scene.add(glasses); // Add to scene, not bone!
            (window as any).glasses = glasses;
          }
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );

          if (glasses) {
            headBone.getWorldPosition(glasses.position);
            headBone.getWorldQuaternion(glasses.quaternion);

            // Re-apply local offset (up and forwards)
            glasses.translateY(0.12 * 10);
            glasses.translateZ(0.15 * 10);
          }

          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character!)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
