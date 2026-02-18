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

type BookProps = JSX.IntrinsicElements['group'];

function Book(props: BookProps) {
  const { scene } = useGLTF('/models/paladins_book.glb');
  return <primitive object={scene} {...props} />;
}

useGLTF.preload('/models/paladins_book.glb');

export function BookModel() {
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
        setRot([y * 0.12, x * 0.16]);
      });
    };

    el.addEventListener('mousemove', handle, { passive: true });
    el.addEventListener('mouseleave', () => setRot([0, 0]));

    return () => {
      el.removeEventListener('mousemove', handle as any);
      cancelAnimationFrame(raf);
    };
  }, []);

  const sparklesCount = reduceMotion ? 24 : 90;
  const autoRotate = pageVisible && !reduceMotion;
  const frameLoop = pageVisible && !reduceMotion ? 'always' : 'demand';

  return (
    <div ref={containerRef} className="w-full h-[520px] sm:h-[640px] md:h-[760px]">
      <Canvas camera={{ position: [0, 1, 1.8], fov: 42 }} frameloop={frameLoop as any}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[4, 6, 2]}
          intensity={1.1}
          castShadow
        />
        <directionalLight
          position={[-4, -2, -2]}
          intensity={0.4}
          castShadow
        />
        <directionalLight
          position={[0, 3, -4]}
          intensity={0.9}
          color="#ffffff"
        />
        <Suspense
          fallback={
            <Html center>
              <div className="rounded-full border border-border bg-background/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                Loading book...
              </div>
            </Html>
          }
        >
          <Float
            speed={reduceMotion ? 0.2 : 1.6}
            rotationIntensity={0.45}
            floatIntensity={reduceMotion ? 0.2 : 1.1}
            floatingRange={reduceMotion ? [0, 0] : [-0.12, 0.12]}
          >
            <group rotation={[rot[0], rot[1] + Math.PI / 8, 0]}>
              <Book rotation={[0.06, 0, 0]} scale={2.4} />
            </group>
          </Float>

          <Sparkles
            count={sparklesCount}
            speed={0.7}
            opacity={0.6}
            size={4}
            color="#ffffff"
            position={[0, 1, 0]}
            scale={[3, 2, 3]}
          />
          <Environment preset="studio" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.7}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotate ? 0.9 : 0}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

