"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function AnimatedBackground() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

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
            points: 8.0,
            maxDistance: 22.0,
            spacing: 18.0,
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
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}