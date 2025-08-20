'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Github, Linkedin, Mail, Code, Palette, Rocket, Send, Download, Laugh, Globe, FileText, Star } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import Link from 'next/link';

// Register GSAP ScrollTrigger for advanced scroll animations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Portfolio() {
  // Refs for GSAP, Three.js, and scroll animations
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const timelineRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // Track visibility for Framer Motion animations
  const isHeaderInView = useInView(headerRef, { once: false, amount: 0.3 });
  const isAboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
  const isSkillsInView = useInView(skillsRef, { once: false, amount: 0.3 });
  const isTimelineInView = useInView(timelineRef, { once: false, amount: 0.3 });
  const isProjectsInView = useInView(projectsRef, { once: false, amount: 0.3 });
  const isContactInView = useInView(contactRef, { once: false, amount: 0.3 });

  // Animation variants for Framer Motion
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const iconVariants = {
    rest: { scale: 1, rotate: 0, color: '#FFFFFF' },
    hover: { scale: 1.3, rotate: 360, color: '#F472B6', transition: { duration: 0.4 } },
  };

  // Three.js Background (showcases exploration beyond React)
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particle system for stunning 3D effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 300; // Reduced for performance
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xF472B6,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // GSAP Animations (showcases advanced animation skills)
  useEffect(() => {
    // Parallax for sections
    gsap.utils.toArray(['#header', '#about', '#skills', '#timeline', '#projects', '#contact']).forEach((section, i) => {
      gsap.fromTo(
        section,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Timeline milestones animation
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.fromTo(
        item,
        { scale: 0.8, opacity: 0, x: i % 2 === 0 ? -100 : 100 },
        {
          scale: 1,
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  const skills = [
    { category: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Bootstrap', 'SCSS'] },
    { category: 'Backend', items: ['Node.js', 'Express.js'] },
    { category: 'Tools & Utilities', items: ['Git', 'NPM', 'Webpack'] },
    { category: 'Core Concepts', items: ['Data Structures & Algorithms', 'HTTPS & Networking'] },
  ];

  const projects = [
    {
      title: 'Kids Study Companion',
      description: 'A fun, gamified platform to make learning a blast for kids. Built with love and a sprinkle of magic.',
      tech: ['React', 'TypeScript', 'Chart.js'],
      github: 'https://github.com/yourusername/kids-study-companion', // Replace
      demo: 'https://kids-study-companion.demo', // Replace
      badge: 'Kid-Approved',
    },
    {
      title: 'Invisibility Cloak',
      description: 'A sneaky computer vision project that makes you disappear. Harry Potter would be jealous!',
      tech: ['JavaScript', 'OpenCV', 'Canvas API'],
      github: 'https://github.com/yourusername/invisibility-cloak', // Replace
      demo: 'https://invisibility-cloak.demo', // Replace
      badge: 'Wizardry',
    },
    {
      title: 'PDF Editor Pro',
      description: 'Edit PDFs like a pro—no more wrestling with clunky software. Smooth and intuitive.',
      tech: ['React', 'PDF-lib', 'Canvas API'],
      github: 'https://github.com/yourusername/pdf-editor-pro', // Replace
      demo: 'https://pdf-editor-pro.demo', // Replace
      badge: 'Productivity',
    },
  ];

  const timeline = [
    { year: '2020', tech: 'HTML & CSS', description: 'Kicked off with pixel-perfect layouts and stylish designs.' },
    { year: '2021', tech: 'JavaScript & React', description: 'Mastered dynamic UIs and fell for React’s magic.' },
    { year: '2022', tech: 'Node.js & Express', description: 'Conquered the backend, building APIs like a champ.' },
    { year: '2023', tech: 'Three.js & GSAP', description: 'Added 3D flair and silky-smooth animations.' },
    { year: '2024', tech: 'TypeScript & Tailwind', description: 'Embraced typed code and rapid, clean styling.' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Three.js Canvas for 3D particle background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-8 space-y-12">
        {/* Header Section */}
        <motion.div
          id="header"
          ref={headerRef}
          variants={sectionVariants}
          initial="hidden"
          animate={isHeaderInView ? 'visible' : 'hidden'}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-teal-500/30 shadow-2xl shadow-teal-500/20">
            <CardContent className="flex flex-col sm:flex-row items-center p-6 sm:p-8 space-y-6 sm:space-y-0 sm:space-x-8">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative">
                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-teal-400 shadow-lg shadow-teal-500/40">
                  <AvatarImage src="/adeiza.jpg" alt="Adeiza Onimisi" /> {/* Replace */}
                  <AvatarFallback className="bg-teal-600 text-white text-3xl">AO</AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute -bottom-3 -right-3 bg-coral-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Code Wizard!
                </motion.div>
              </motion.div>
              <div className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-coral-400">
                  Adeiza Onimisi
                </h1>
                <p className="text-xl sm:text-2xl text-gray-300 mt-3">
                  I turn coffee into <span className="font-semibold text-teal-400">epic code</span> and{' '}
                  <span className="font-semibold text-coral-400">unforgettable UIs</span>.
                </p>
                <div className="flex justify-center sm:justify-start space-x-6 mt-6">
                  <motion.a href="https://github.com/yourusername" target="_blank" variants={iconVariants} whileHover="hover">
                    <Github className="w-8 h-8 text-white" />
                  </motion.a>
                  <motion.a href="https://linkedin.com/in/yourusername" target="_blank" variants={iconVariants} whileHover="hover">
                    <Linkedin className="w-8 h-8 text-white" />
                  </motion.a>
                  <motion.a href="mailto:your.email@example.com" variants={iconVariants} whileHover="hover">
                    <Mail className="w-8 h-8 text-white" />
                  </motion.a>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} className="mt-6">
                  <Button
                    asChild
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-teal-500/40"
                  >
                    <a href="#contact">Hire This Geek!</a>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About Section (Side-by-Side) */}
        <motion.div
          id="about"
          ref={aboutRef}
          variants={sectionVariants}
          initial="hidden"
          animate={isAboutInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-teal-500/30 shadow-xl shadow-teal-500/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center text-teal-400">
                <motion.div variants={iconVariants} whileHover="hover">
                  <Code className="w-7 h-7 mr-3" />
                </motion.div>
                Who’s This Code Ninja?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-300 leading-relaxed">
                I’m Adeiza Onimisi, a developer who thrives on turning chaos into <span className="text-teal-400">sleek solutions</span>.
                From crafting buttery-smooth UIs to wrestling APIs into submission, I’ve got a knack for making tech fun and functional.
                When I’m not coding, I’m either strumming my guitar, geeking out over sci-fi, or hunting for the perfect meme.
              </p>
            </CardContent>
          </Card>
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <Star className="w-24 h-24 text-coral-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-lg text-gray-300 italic">
                “Code hard, meme harder.” — Me, probably
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Skills Section (Side-by-Side) */}
        <motion.div
          id="skills"
          ref={skillsRef}
          variants={sectionVariants}
          initial="hidden"
          animate={isSkillsInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {skills.slice(0, 2).map((skillGroup, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-lg border-teal-500/30 shadow-xl shadow-teal-500/20"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-coral-400">
                  {skillGroup.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {skillGroup.items.map((skill, i) => (
                    <motion.li
                      key={i}
                      className="text-base text-gray-300 flex items-center"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <motion.span
                        className="w-3 h-3 bg-teal-400 rounded-full mr-3"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Tech Stack Timeline */}
        <motion.div
          id="timeline"
          ref={timelineRef}
          variants={sectionVariants}
          initial="hidden"
          animate={isTimelineInView ? 'visible' : 'hidden'}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-teal-500/30 shadow-xl shadow-teal-500/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center text-teal-400">
                <motion.div variants={iconVariants} whileHover="hover">
                  <Rocket className="w-7 h-7 mr-3" />
                </motion.div>
                My Tech Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-teal-400" />
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`timeline-item flex items-center mb-8 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="w-4 h-4 bg-coral-500 rounded-full absolute left-3 md:left-[calc(50%-0.5rem)] z-10" />
                    <Card
                      className={`w-full md:w-5/12 ${
                        index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'
                      } bg-white/5 border-teal-500/20 shadow-lg shadow-teal-500/30`}
                    >
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold text-coral-400">{item.year}: {item.tech}</h3>
                        <p className="text-gray-300">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          id="projects"
          ref={projectsRef}
          variants={sectionVariants}
          initial="hidden"
          animate={isProjectsInView ? 'visible' : 'hidden'}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-teal-500/30 shadow-xl shadow-teal-500/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center text-teal-400">
                <motion.div variants={iconVariants} whileHover="hover">
                  <Rocket className="w-7 h-7 mr-3" />
                </motion.div>
                Stuff I’ve Built
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03, boxShadow: '0 15px 30px rgba(13, 148, 136, 0.3)' }}
                    className="p-5 bg-white/10 rounded-xl border border-teal-500/30 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <span className="absolute top-2 right-2 bg-coral-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {project.badge}
                    </span>
                    <h3 className="text-xl font-semibold text-teal-400">{project.title}</h3>
                    <p className="text-sm text-gray-300 mt-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tech.map((tech, i) => (
                        <motion.span
                          key={i}
                          className="text-xs bg-teal-600/20 text-teal-300 rounded-full px-3 py-1"
                          whileHover={{ backgroundColor: '#0D9488', color: '#FFFFFF' }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="text-white border-teal-500/50 hover:bg-teal-600/30"
                        >
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" /> GitHub
                          </a>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="text-white border-teal-500/50 hover:bg-teal-600/30"
                        >
                          <a href={project.demo} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-2" /> Demo
                          </a>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          id="contact"
          ref={contactRef}
          variants={sectionVariants}
          initial="hidden"
          animate={isContactInView ? 'visible' : 'hidden'}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-teal-500/30 shadow-xl shadow-teal-500/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center text-teal-400">
                <motion.div variants={iconVariants} whileHover="hover">
                  <Mail className="w-7 h-7 mr-3" />
                </motion.div>
                Let’s Build Something Epic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action="https://formspree.io/f/your-form-id" method="POST" className="space-y-6">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-gray-200">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name (or alias)"
                    className="mt-2 bg-white/10 border-teal-500/30 text-white focus:ring-teal-400 shadow-inner"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-200">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email (I don’t spam!)"
                    className="mt-2 bg-white/10 border-teal-500/30 text-white focus:ring-teal-400 shadow-inner"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-gray-200">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Got a project? A meme? Let’s hear it!"
                    className="mt-2 bg-white/10 border-teal-500/30 text-white focus:ring-teal-400 shadow-inner"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-teal-500/40"
                  >
                    <Send className="w-4 h-4 mr-2" /> Beam Me Up!
                  </Button>
                </motion.div>
              </form>
              <div className="flex space-x-4 mt-6">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="text-white border-teal-500/50 hover:bg-teal-600/30 shadow-lg"
                  >
                    <a href="/resume.pdf" download>
                      <Download className="w-4 h-4 mr-2" /> Grab My Resume
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="text-white border-teal-500/50 hover:bg-teal-600/30 shadow-lg"
                  >
                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                      <FileText className="w-4 h-4 mr-2" /> Print Resume
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer with Easter Egg */}
        <footer className="text-center text-gray-400 text-sm py-6">
          <p className="flex items-center justify-center">
            Crafted with{' '}
            <motion.span variants={iconVariants} whileHover="hover" className="mx-1">
              <Laugh className="w-5 h-5 text-coral-400" />
            </motion.span>{' '}
            by Adeiza Onimisi
          </p>
          <p className="mt-2">© 2025 Adeiza Onimisi. All rights reserved.</p>
          <motion.p
            className="mt-2 text-xs italic cursor-pointer"
            whileHover={{ color: '#F472B6' }}
            onClick={() => alert('You found the easter egg! 🎉 I code, I joke, I conquer.')}
          >
            Psst... click me for a surprise!
          </motion.p>
        </footer>
      </div>
    </div>
  );
}