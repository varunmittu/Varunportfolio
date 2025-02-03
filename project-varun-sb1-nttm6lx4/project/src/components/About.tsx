import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 leading-relaxed">
                Dynamic and results-driven Software Developer with expertise in MERN stack, Python, and Java. 
                Skilled in designing, developing, and deploying scalable web and mobile applications. 
                Proficient in cloud services, DevOps processes, and container orchestration tools like Docker and Kubernetes.
                Passionate about solving complex problems, driving innovation, and delivering impactful solutions across diverse industries.
              </p>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Facts</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>🎓 B.Tech in Electronics and Communication Engineering</li>
                  <li>💼 Full Stack Developer at Qtenet Technologies Pvt.Ltd</li>
                  <li>🌍 Based in Hyderabad, India</li>
                  <li>📞 +91 8309732876</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Education</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-300 font-medium">Bachelor of Technology in ECE</p>
                    <p className="text-gray-400">Priest University (70%)</p>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Intermediate</p>
                    <p className="text-gray-400">Sri Chaitanya Jr College (86%)</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Experience</h3>
                <p className="text-gray-300">Full Stack Developer</p>
                <p className="text-gray-400">EX-Qtenet Technologies Pvt.Ltd, April 2023 – May 2024</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
