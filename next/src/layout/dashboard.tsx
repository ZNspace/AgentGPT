import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useAspect, useVideoTexture, useTexture } from "@react-three/drei";

import AppHead from "../components/AppHead";
import DottedGridBackground from "../components/DottedGridBackground";
import { useTheme } from "../hooks/useTheme";

const DashboardLayout = (props: PropsWithChildren) => {
  //add event listener to detect OS theme changes
  useTheme();

  return (
    <>
      <AppHead />
      <main className={clsx("bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F] duration-300")}>
        <DottedGridBackground className="min-w-screen min-h-screen">
          {props.children}
        </DottedGridBackground>
      </main>

      <Canvas orthographic>
        <Scene />
      </Canvas>
    </>
  );
};

function Scene() {
  const size = useAspect(1800, 1000);
  return (
    <mesh scale={size}>
      <planeGeometry />
      <Suspense fallback={<FallbackMaterial url="10.jpg" />}>
        <VideoMaterial url="10.mp4" />
      </Suspense>
    </mesh>
  );
}

function VideoMaterial({ url }) {
  const texture = useVideoTexture(url);
  return <meshBasicMaterial map={texture} toneMapped={false} />;
}

function FallbackMaterial({ url }) {
  const texture = useTexture(url);
  return <meshBasicMaterial map={texture} toneMapped={false} />;
}

export default DashboardLayout;
