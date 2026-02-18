/* eslint-disable react/no-unknown-property */
"use client";

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Float,
  OrbitControls,
  Environment,
  Html,
  Sparkles,
  useGLTF,
} from '@react-three/drei';
import { usePageVisibility } from '@/hooks/usePageVisibility';

type OpenBookProps = JSX.IntrinsicElements['group'];

function OpenBook(props: OpenBookProps) {
  const { scene } = useGLTF('/models/open_book_-_sun_tzus_art_of_war.glb');
  return <primitive object={scene} {...props} />;
}

useGLTF.preload('/models/open_book_-_sun_tzus_art_of_war.glb');

export function OpenBookModel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rot, setRot] = useState<[number, number]>([0, 0]);
  const pageVisible = usePageVisibility();
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let raf = 0;
    const el = containerRef.current;
    if (!el) return;

    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setRot([y * 0.08, x * 0.12]);
      });
    };

    el.addEventListener('mousemove', handle, { passive: true });
    el.addEventListener('mouseleave', () => setRot([0, 0]));

    return () => {
      el.removeEventListener('mousemove', handle as any);
      cancelAnimationFrame(raf);
    };
  }, []);

  const sparklesCount = reduceMotion ? 20 : 80;
  const autoRotate = pageVisible && !reduceMotion;
  const frameLoop = pageVisible && !reduceMotion ? 'always' : 'demand';

  return (
    <div ref={containerRef} className="w-full max-w-xl mx-auto h-[320px] sm:h-[360px] md:h-[420px] lg:h-[480px]">
      <Canvas
        camera={{ position: [0, 1.1, 4.8], fov: 34 }}
        className="w-full h-full"
        frameloop={frameLoop as any}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 2]} intensity={1.1} />
        <directionalLight position={[-3, -1, -2]} intensity={0.35} />
        <Sparkles
          count={sparklesCount}
          speed={0.5}
          opacity={0.55}
          size={3}
          color="#ffffff"
          position={[0, 1, 0]}
          scale={[2.6, 1.8, 2.6]}
        />
        <Suspense
          fallback={
            <Html center>
              <div className="rounded-full border border-border bg-background/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                Preparing reading view...
              </div>
            </Html>
          }
        >
          <Float
            speed={reduceMotion ? 0.2 : 1.4}
            rotationIntensity={0.35}
            floatIntensity={reduceMotion ? 0.15 : 1}
            floatingRange={reduceMotion ? [0, 0] : [-0.1, 0.1]}
          >
            <group rotation={[rot[0], rot[1] - Math.PI / 10, 0]}>
              <OpenBook rotation={[0.02, 0, 0]} scale={0.5} />
            </group>
          </Float>
          <Environment preset="studio" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.7}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotate ? 1 : 0}
            target={[0, 0.9, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

