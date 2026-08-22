"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  varying vec2 vUv;

  // Simple smooth pseudo-random function.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Soft grain so the background feels less digitally flat.
  float grain(vec2 uv, float time) {
    return hash(
      uv * u_resolution.xy +
      fract(time * 0.15)
    );
  }

  void main() {
    vec2 uv = vUv;

    // Correct the aspect ratio so circles/waves do not stretch.
    vec2 centered = uv - 0.5;
    centered.x *= u_resolution.x / u_resolution.y;

    // Convert mouse from 0-1 coordinates to centered coordinates.
    vec2 mouse = u_mouse - 0.5;
    mouse.x *= u_resolution.x / u_resolution.y;

    // Mouse gently bends the flow instead of aggressively following it.
    float mouseDistance = length(centered - mouse);
    float mouseInfluence =
      0.08 / (mouseDistance + 0.22);

    // Build several moving sine waves.
    float waveA =
      sin(centered.x * 3.4 +
          centered.y * 2.1 +
          u_time * 0.32);

    float waveB =
      sin(centered.x * -2.4 +
          centered.y * 4.2 -
          u_time * 0.24);

    float waveC =
      sin(
        length(centered + vec2(0.2, -0.1)) * 6.0
        - u_time * 0.18
      );

    // Combine the waves into one smooth aurora field.
    float field =
      waveA * 0.42 +
      waveB * 0.34 +
      waveC * 0.24;

    field += mouseInfluence;

    // Normalize roughly into the 0-1 range.
    field = field * 0.5 + 0.5;

    // Custom palette.
    vec3 midnight = vec3(0.025, 0.035, 0.09);
    vec3 violet   = vec3(0.28, 0.10, 0.62);
    vec3 cyan     = vec3(0.08, 0.72, 0.82);
    vec3 blue     = vec3(0.08, 0.22, 0.55);

    // Blend dark blue into violet first.
    vec3 color =
      mix(midnight, violet, smoothstep(0.05, 0.62, field));

    // Add cyan into brighter sections.
    color =
      mix(color, cyan, smoothstep(0.55, 0.95, field));

    // Add a blue glow near the cursor.
    float glow =
      smoothstep(0.6, 0.0, mouseDistance);

    color += blue * glow * 0.28;

    // Dark vignette keeps hero text readable.
    float vignette =
      smoothstep(1.05, 0.2, length(centered));

    color *= 0.62 + vignette * 0.55;

    // Very subtle grain.
    float noise = grain(uv, u_time);
    color += (noise - 0.5) * 0.025;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderPlane({
  paused,
}: {
  paused: boolean;
}) {
  const materialRef =
    useRef<THREE.ShaderMaterial>(null);

  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: {
        value: new THREE.Vector2(
          size.width,
          size.height
        ),
      },
      u_mouse: {
        value: new THREE.Vector2(0.5, 0.5),
      },
    }),
    [size.width, size.height]
  );

  useEffect(() => {
    uniforms.u_resolution.value.set(
      size.width,
      size.height
    );
  }, [size, uniforms]);

  useEffect(() => {
    const handlePointerMove = (
      event: PointerEvent
    ) => {
      uniforms.u_mouse.value.set(
        event.clientX / window.innerWidth,
        1 -
          event.clientY /
            window.innerHeight
      );
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, [uniforms]);

  useFrame((state) => {
    if (
      paused ||
      !materialRef.current
    ) {
      return;
    }

    materialRef.current.uniforms.u_time.value =
      state.clock.elapsedTime;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function AuroraShader() {
  const [reducedMotion, setReducedMotion] =
    useState(false);

  const [tabHidden, setTabHidden] =
    useState(false);

  useEffect(() => {
    const motionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const updateMotionPreference = () => {
      setReducedMotion(
        motionQuery.matches
      );
    };

    const handleVisibility = () => {
      setTabHidden(document.hidden);
    };

    updateMotionPreference();
    handleVisibility();

    motionQuery.addEventListener(
      "change",
      updateMotionPreference
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      motionQuery.removeEventListener(
        "change",
        updateMotionPreference
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  if (reducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_75%_30%,rgba(139,92,246,0.35),transparent_35%),linear-gradient(135deg,#071126,#11103d_55%,#041725)]"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          powerPreference:
            "high-performance",
        }}
        camera={{
          position: [0, 0, 1],
        }}
      >
        <ShaderPlane
          paused={tabHidden}
        />
      </Canvas>
    </div>
  );
}