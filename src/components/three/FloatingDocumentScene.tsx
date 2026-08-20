"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const FloatingDocumentScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Document Meshes (Layered PDF sheets)
    const group = new THREE.Group();
    scene.add(group);

    // Materials
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x181824,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transmission: 0.3,
      opacity: 0.9,
      transparent: true,
    });

    const glowBorderMaterial = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const pageGeometry = new THREE.BoxGeometry(3.2, 4.4, 0.05);

    // Main 3D PDF Sheet
    const mainDoc = new THREE.Mesh(pageGeometry, frontMaterial);
    const borderDoc = new THREE.Mesh(
      new THREE.BoxGeometry(3.25, 4.45, 0.06),
      glowBorderMaterial
    );
    mainDoc.add(borderDoc);
    group.add(mainDoc);

    // Secondary Backing Sheets (Stack effect)
    const backDoc1 = new THREE.Mesh(
      new THREE.BoxGeometry(3.1, 4.3, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.4,
        roughness: 0.3,
      })
    );
    backDoc1.position.set(-0.3, -0.2, -0.3);
    backDoc1.rotation.z = -0.08;
    group.add(backDoc1);

    const backDoc2 = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 4.2, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.3,
        roughness: 0.3,
      })
    );
    backDoc2.position.set(0.3, -0.3, -0.6);
    backDoc2.rotation.z = 0.06;
    group.add(backDoc2);

    // Orbiting 3D Particles/Icons
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 40;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 8;
      posArray[i + 1] = (Math.random() - 0.5) * 8;
      posArray[i + 2] = (Math.random() - 0.5) * 4;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xa855f7,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xa855f7, 25, 20);
    pointLight1.position.set(4, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 20, 20);
    pointLight2.position.set(-4, -3, 4);
    scene.add(pointLight2);

    // Mouse Interaction
    let targetRotationX = 0.2;
    let targetRotationY = -0.3;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / height) * 2 - 1);
      targetRotationY = mouseX * 0.6;
      targetRotationX = -mouseY * 0.4 + 0.15;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth floating and rotation
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
      group.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = elapsedTime * 0.02;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[380px] lg:min-h-[480px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
    />
  );
};
