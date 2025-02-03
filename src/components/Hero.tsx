import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Hi, I'm <span className="text-indigo-400">Varun Pendkar</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Full Stack Developer specializing in creating beautiful and functional web applications
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/varunmittu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 hover:text-indigo-400 transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com/in/sai-varun-pendkar-308186281"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 hover:text-indigo-400 transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://x.com/PendkarVarun"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 hover:text-indigo-400 transition-colors"
              >
                <Twitter size={24} />
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex justify-center"
          >
            <img
              src="src/components/WhatsApp Image 2024-05-19 at 21.01.10_09511a3d.jpg"
              alt="VARUN PENDKAR"
              className="w-64 h-64 rounded-full object-cover shadow-xl border-4 border-indigo-400"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
