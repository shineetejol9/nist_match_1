import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ContactSection = () => {
  const sectionRef = useRef(null);
  const circleRef = useRef(null);
  const initialTextRef = useRef(null);
  const finalTextRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Clean old triggers
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.current) st.kill(true);
    });

    // Initial states
    gsap.set(circleRef.current, { scale: 1, backgroundColor: "white" });
    gsap.set(initialTextRef.current, { opacity: 1 });
    gsap.set(finalTextRef.current, { opacity: 0 });

    // Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.5,
      },
    });

    // Circle expands and changes color
    tl.to(
      circleRef.current,
      {
        scale: 25, // large enough to fill entire page
        backgroundColor: "#E9D5FF",
        boxShadow: "0 0 80px 30px rgba(233,213,255,0.3)",
        ease: "power2.inOut",
        duration: 1.2,
      },
      0
    );

    // Initial text fades out
    tl.to(
      initialTextRef.current,
      {
        opacity: 0,
        ease: "power1.out",
        duration: 0.3,
      },
      0.1
    );

    // Final text fades in
    tl.to(
      finalTextRef.current,
      {
        opacity: 1,
        ease: "power2.in",
        duration: 0.5,
      },
      0.8
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center h-screen bg-black overflow-hidden"
      style={{ overscrollBehavior: "none" }}
    >
      {/* Expanding Circle Background */}
      <div
        ref={circleRef}
        className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-violet-400 to-pink-100 shadow-violet-300/50 shadow-lg"
      ></div>

      {/* Content Layer */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center px-4">
        {/* Initial Text */}
        <p
          ref={initialTextRef}
          className="text-white font-bold text-xl sm:text-2xl md:text-3xl"
        >
          SCROLL DOWN
        </p>

        {/* Final Text */}
        <div ref={finalTextRef} className="opacity-0 max-w-lg">
          <h1 className="text-black font-bold text-xl sm:text-2xl md:text-3xl mb-4">
            Step into new life with your partner
          </h1>
          <p className="text-black mb-6 text-sm sm:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            dolorem sapiente animi sunt accusamus pariatur dolores eaque,
            eveniet provident soluta mollitia nulla quis illo hic magnam eum
            similique harum error.
          </p>
          <button className="px-8 py-2 rounded-xl bg-black text-white hover:bg-white hover:text-black transition-all duration-300">
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
