import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Database,
  Globe,
  Shield,
  Sparkles,
  ArrowRight,
  Terminal,
  Code,
  Cpu,
} from "lucide-react";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Stars from "../components/Stars";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      disable: window.innerWidth < 768,
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".feature-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 60,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
          });
        },
        onLeave: (elements) => {
          gsap.to(elements, {
            y: -60,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
          });
        },
        onEnterBack: (elements) => {
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 1,
          });
        },
        start: "top 80%",
        end: "bottom 20%",
        once: false,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Database className="h-8 w-8" />,
      title: "Mock Database",
      description: "Generate realistic data instantly",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: <Terminal className="h-8 w-8" />,
      title: "API Endpoints",
      description: "RESTful API access to your data",
      color: "from-green-600 to-emerald-600",
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Custom Schema",
      description: "Define your own data structure",
      color: "from-purple-600 to-pink-600",
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Real-time Updates",
      description: "Instant data synchronization",
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden"
    >
      <Navbar isLanding={true} />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        style={{ y, opacity }}
      >
        {/* Universe Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Universe Scene */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Stars */}
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-gray-400 dark:bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Solar System Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative w-[800px] h-[800px]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 200,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Orbital Rings */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`orbit-${i}`}
                    className="absolute rounded-full border dark:border-white/10 border-gray-900/10"
                    style={{
                      width: `${(i + 1) * 300}px`,
                      height: `${(i + 1) * 300}px`,
                      left: `${400 - ((i + 1) * 300) / 2}px`,
                      top: `${400 - ((i + 1) * 300) / 2}px`,
                    }}
                  />
                ))}

                {/* Planets */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`planet-${i}`}
                    className="absolute"
                    animate={{
                      rotate: -360,
                    }}
                    transition={{
                      duration: 20 + i * 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      width: `${(i + 1) * 300}px`,
                      height: `${(i + 1) * 300}px`,
                      left: `${400 - ((i + 1) * 300) / 2}px`,
                      top: `${400 - ((i + 1) * 300) / 2}px`,
                    }}
                  >
                    <motion.div
                      className="absolute rounded-full"
                      style={{
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: `${24 - i * 6}px`,
                        height: `${24 - i * 6}px`,
                        background:
                          i === 0 ? "#60a5fa" : i === 1 ? "#a855f7" : "#818cf8",
                        position: "absolute",
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          `0 0 20px ${
                            i === 0
                              ? "#60a5fa"
                              : i === 1
                              ? "#a855f7"
                              : "#818cf8"
                          }80`,
                          `0 0 40px ${
                            i === 0
                              ? "#60a5fa"
                              : i === 1
                              ? "#a855f7"
                              : "#818cf8"
                          }b0`,
                          `0 0 20px ${
                            i === 0
                              ? "#60a5fa"
                              : i === 1
                              ? "#a855f7"
                              : "#818cf8"
                          }80`,
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                ))}

                {/* Central Sun */}
                <motion.div
                  className="absolute"
                  style={{
                    left: "400px",
                    top: "400px",
                    transform: "translate(-50%, -50%)",
                    width: "120px",
                    height: "120px",
                  }}
                >
                  {/* Sun Glow */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      inset: "-150%",
                      background:
                        "radial-gradient(circle, rgba(255,190,152,0.2) 0%, rgba(255,183,77,0) 70%)",
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Sun Core */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 35% 35%, #ffd700 0%, #ffb700 30%, #ff8c00 60%, #ff6b00 100%)",
                        boxShadow: `
                          0 0 40px rgba(255, 160, 0, 0.6),
                          0 0 70px rgba(255, 140, 0, 0.4),
                          0 0 120px rgba(255, 120, 0, 0.2)
                        `,
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Shooting Stars */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`shooting-star-${i}`}
                className="absolute w-1 h-1 bg-white"
                style={{
                  left: "-10px",
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: ["0vw", "100vw"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-8 h-[1px] bg-gradient-to-r from-white to-transparent" />
              </motion.div>
            ))}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/80 dark:from-gray-900/50 dark:via-transparent dark:to-gray-900/80" />
          </motion.div>
        </div>

        {/* Content - Adjusted for better contrast */}
        <div className="relative pt-32 z-10">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="max-w-7xl mx-auto px-4"
            >
              <div className="text-center mb-16 relative z-20">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block mb-4 px-6 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 text-sm font-medium backdrop-blur-sm"
                >
                  Introducing MockAPI 1.0
                </motion.div>
                <h1 className="text-6xl md:text-7xl font-bold mb-8">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-300 dark:via-blue-400 dark:to-indigo-400">
                    Build APIs That
                  </span>
                  <br />
                  <motion.span
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent bg-300% animate-gradient"
                  >
                    Power Innovation
                  </motion.span>
                </h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12"
                >
                  Create, test, and mock REST APIs instantly. No coding
                  required.
                  <br />
                  Built for developers, by developers.
                </motion.p>

                {/* CTA Buttons - Enhanced for visibility */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <button
                    onClick={() => navigate("/register")}
                    className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl overflow-hidden hover:bg-blue-700 transition-colors"
                  >
                    <span className="relative flex items-center font-medium">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                  <button
                    onClick={() => navigate("/docs")}
                    className="group px-8 py-4 border border-gray-300 dark:border-gray-400/30 hover:border-gray-400 dark:hover:border-gray-400/50 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
                  >
                    <span className="flex items-center font-medium">
                      View Documentation
                      <Terminal className="ml-2 h-5 w-5" />
                    </span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-gray-400 rounded-full mt-2"
              animate={{
                y: [0, 15, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Second Section - How it Works */}
      <section id="features" className="relative py-24 overflow-hidden">
        {/* Stars Background */}
        <Stars />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Content */}
          <div className="relative">
            {/* Section Header */}
            <div className="text-center mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                How It Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              >
                Create and manage your mock APIs in three simple steps
              </motion.p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "Define Schema",
                  description:
                    "Design your data structure with our intuitive schema builder",
                  icon: (
                    <Database className="h-8 w-8 text-gray-900 dark:text-white" />
                  ),
                  color: "from-blue-600 to-blue-400",
                },
                {
                  title: "Generate Data",
                  description:
                    "Automatically generate realistic mock data based on your schema",
                  icon: (
                    <Sparkles className="h-8 w-8 text-gray-900 dark:text-white" />
                  ),
                  color: "from-purple-600 to-purple-400",
                },
                {
                  title: "Use API",
                  description:
                    "Access your mock API endpoints with full CRUD operations",
                  icon: (
                    <Globe className="h-8 w-8 text-gray-900 dark:text-white" />
                  ),
                  color: "from-green-600 to-green-400",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="relative backdrop-blur-sm bg-transparent dark:bg-transparent rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className={` p-4 rounded-xl w-fit mb-6`}>
                      <div className="dark:text-white">{step.icon}</div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="relative py-24">
        {/* Stars Background */}
        <Stars />

        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            className="relative rounded-3xl overflow-hidden p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-600/80 dark:to-indigo-600/80"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <div className="relative">
              <motion.h2
                className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5 }}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p
                className="text-xl text-gray-700 dark:text-white/80 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Join thousands of developers using MockAPI today.
              </motion.p>
              <motion.button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-blue-600 text-white dark:bg-white dark:text-blue-600 rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-gray-100 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Free Account
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
