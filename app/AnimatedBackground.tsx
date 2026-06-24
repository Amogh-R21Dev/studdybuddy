"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Props = {
  intensity?: "vivid" | "calm";
};

export default function AnimatedBackground({ intensity = "vivid" }: Props) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  const settings =
    intensity === "calm"
      ? { points: 5.0, maxDistance: 16.0, spacing: 24.0 }
      : { points: 8.0, maxDistance: 22.0, spacing: 18.0 };

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      import("vanta/dist/vanta.net.min").then((VANTA) => {
        setVantaEffect(
          VANTA.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xe8a33d,
            backgroundColor: 0x0f1419,
            ...settings,
          })
        );
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: intensity === "calm" ? 0.5 : 1,
      }}
    />
  );
}