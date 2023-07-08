// import { useAspect, useTexture, useVideoTexture } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";
import type { PropsWithChildren } from "react";

import AppHead from "../components/AppHead";
import { useTheme } from "../hooks/useTheme";

const DashboardLayout = (props: PropsWithChildren) => {
  //add event listener to detect OS theme changes
  useTheme();

  return (
    <>
      <AppHead />
      <main className="h-screen" style={{overflow: 'hidden'}}>
        {props.children}
      </main>

      {/* <Canvas
        orthographic
        style={{ position: "fixed", height: "50vh", bottom: 0, right: 0, zIndex: -1 }}
      >
        <Scene />
      </Canvas> */}
    </>
  );
};

// function Scene() {
//   const size = useAspect(1800, 1000);
//   return (
//     <mesh scale={size}>
//       <planeGeometry />
//       <Suspense fallback={<FallbackMaterial url="/10.jpg" />}>
//         <VideoMaterial url="/10.mp4" />
//       </Suspense>
//     </mesh>
//   );
// }

// function VideoMaterial({ url }) {
//   const texture = useVideoTexture(url);
//   return <meshBasicMaterial map={texture} toneMapped={false} />;
// }

// function FallbackMaterial({ url }) {
//   const texture = useTexture(url);
//   return <meshBasicMaterial map={texture} toneMapped={false} />;
// }

export default DashboardLayout;
