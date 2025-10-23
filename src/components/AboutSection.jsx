// src/components/AboutSection.jsx
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Spline from "@splinetool/react-spline";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const introRef = useRef(null);
  const starsRef = useRef([]);
  const splineRef = useRef(null);

  const [showSpline, setShowSpline] = useState(false); // Lazy load Spline

  const addToStars = (el) => {
    if (el && !starsRef.current.includes(el)) starsRef.current.push(el);
  };

  // Show Spline after mount to prevent WebGL overload
  useEffect(() => {
    setShowSpline(true);
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Intro fade-up
      gsap.fromTo(
        introRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Stars animation
      starsRef.current.forEach((star, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const speed = 0.5 + Math.random() * 0.5;

        gsap.to(star, {
          x: direction * (100 + index * 20),
          y: direction * (-50 - index * 10),
          rotation: direction * 360,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: speed,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert(); // Cleanup GSAP animations
  }, []);

  // Cleanup Spline WebGL context
  useEffect(() => {
    return () => {
      if (splineRef.current && splineRef.current.dispose) {
        splineRef.current.dispose();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-black to-[#9a74cf50] overflow-hidden"
    >
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            ref={addToStars}
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${10 + i * 3}px`,
              height: `${10 + i * 3}px`,
              backgroundColor: "white",
              opacity: 0.2 + Math.random() * 0.4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Right-side Spline */}
      {showSpline && (
        <div className="absolute top-0 right-0 h-full w-[50%] flex justify-center items-center z-0">
          <Spline
            ref={splineRef}
            className="w-full h-full object-contain absolute xl:right-[-23%] right-0 lg:top-0"
            scene="https://prod.spline.design/KXbFdiTVJ6FjmQHw/scene.splinecode"
          />
        </div>
      )}

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-6 py-32 flex flex-col items-start justify-center h-full">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold mb-12 text-left text-white opacity-0"
        >
          About Me
        </h1>

        <div
          ref={introRef}
          className="max-w-[45%] text-left text-purple-200 tracking-wider"
        >
          <h3 className="text-sm md:text-2xl font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            error facilis numquam quasi unde suscipit fuga cupiditate iusto.
            Expedita omnis ab placeat quaerat incidunt libero. Reprehenderit at!
            Tempore quo vero.
          </h3>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
