import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Zap } from 'lucide-react';

const HeroScene3D = () => {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all rotating elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Core: Glowing Futuristic Polyhedron
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366F1,
      emissive: 0x1E1B4B,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x06B6D4,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. Surrounding Floating Satellite Nodes
    const satelliteCount = 5;
    const satellites = [];
    const satelliteGeos = [
      new THREE.OctahedronGeometry(0.35),
      new THREE.TetrahedronGeometry(0.4),
      new THREE.DodecahedronGeometry(0.3),
      new THREE.TorusGeometry(0.3, 0.1, 8, 20),
      new THREE.BoxGeometry(0.45, 0.45, 0.45)
    ];

    const satMaterial = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x0C4A6E
    });

    for (let i = 0; i < satelliteCount; i++) {
      const satMesh = new THREE.Mesh(satelliteGeos[i % satelliteGeos.length], satMaterial);
      const angle = (i / satelliteCount) * Math.PI * 2;
      const radius = 3.2;
      satMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * 1.5, Math.sin(angle) * radius * 0.5);
      mainGroup.add(satMesh);
      satellites.push({ mesh: satMesh, angle, speed: 0.008 + i * 0.003, radius });
    }

    // 3. Particle Starfield / Dust Field
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;

      // Color variation between cyan and indigo
      if (Math.random() > 0.5) {
        particleColors[i] = 0.38; // R
        particleColors[i + 1] = 0.74; // G
        particleColors[i + 2] = 0.97; // B (cyan)
      } else {
        particleColors[i] = 0.65;
        particleColors[i + 1] = 0.33;
        particleColors[i + 2] = 0.96; // (purple)
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366F1, 2, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06B6D4, 2, 50);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetX = x * 0.6;
      targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainGroup.rotation.y += 0.005;
      mainGroup.rotation.x = mouseY * 0.8;
      mainGroup.rotation.z = mouseX * 0.5;

      coreMesh.rotation.x += 0.003;
      coreMesh.rotation.y -= 0.004;

      innerMesh.rotation.x -= 0.006;
      innerMesh.rotation.z += 0.004;

      // Orbit satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.y = Math.sin(sat.angle) * 1.5;
        sat.mesh.position.z = Math.sin(sat.angle * 1.5) * 1.8;
        sat.mesh.rotation.x += 0.01;
        sat.mesh.rotation.y += 0.02;
      });

      particleSystem.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div className="relative w-full h-[450px] lg:h-[560px] flex items-center justify-center overflow-hidden rounded-2xl">
      {reducedMotion ? (
        // Accessible 2D Fallback
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-950/40 via-dark-800 to-cyan-950/30 border border-primary-500/20 rounded-2xl">
          <div className="w-24 h-24 rounded-full bg-primary-600/20 border-2 border-primary-400 flex items-center justify-center shadow-glow mb-4 animate-pulse">
            <Zap className="w-12 h-12 text-primary-400" />
          </div>
          <p className="text-sm font-medium text-slate-400 text-center max-w-xs">
            Reduced Motion Mode Active. Full 3D particle simulation paused for accessibility.
          </p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      )}

      {/* Floating Interactive 3D Skill Badges */}
      <div className="absolute top-6 left-6 glass-panel px-3.5 py-2 rounded-xl text-xs font-semibold text-accent-cyan flex items-center gap-2 shadow-lg border border-accent-cyan/20 animate-bounce">
        <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
        WebGL 3D Rendering Active
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          className="glass-panel px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-dark-700 transition flex items-center gap-1.5 border border-white/10"
          title="Toggle 3D visual animation effects"
        >
          <Eye className="w-3.5 h-3.5" />
          {reducedMotion ? "Enable 3D Visuals" : "Reduce Motion"}
        </button>
      </div>
    </div>
  );
};

export default HeroScene3D;
