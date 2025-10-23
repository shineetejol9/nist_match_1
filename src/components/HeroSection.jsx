// src/components/HeroSection.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { gsap } from "gsap";

const HeroSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // GSAP context for future animations and cleanup
    const ctx = gsap.context(() => {
      // Example: can add floating/parallax effects here if needed
    }, sectionRef);

    // Cleanup GSAP context on unmount
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen bg-gradient-to-b from-violet-900 to-black flex xl:flex-row flex-col-reverse items-center justify-between lg:px-24 px-10 relative overflow-hidden"
    >
      {/* Left Section */}
      <div className="z-40 xl:mb-5 mt-[10%]">
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 25,
            delay: 1.3,
            duration: 1.5,
          }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold z-10 mb-6"
        >
          Nist_Match <br /> Find your match
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 25,
            delay: 1.8,
            duration: 1.5,
          }}
          className="text-xl md:text-1xl lg:text-2xl text-purple-200 max-w-2xl"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae eaque
          aliquam libero fugiat, facere, exercitationem sit inventore dolorem,
          commodi esse provident eum delectus? Adipisci ducimus quis expedita
          maiores tenetur nisi?
        </motion.p>
      </div>

      {/* Right Section */}
      <Spline
        className="absolute xl:right-[-28%] right-0 top-[-20%] lg:top-0 w-full h-full"
        scene="https://prod.spline.design/hY3AoVW53uzZIcs8/scene.splinecode"
      />
    </section>
  );
};

export default HeroSection;
