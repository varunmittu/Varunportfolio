import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Rentera',
    description: 'E-commerce Renting Platform built with React, Node.js, Express.js, and MongoDB. Features secure authentication, payment integration, and AWS services integration.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop',
    link: 'https://rentera.in/',
    tech: ['React', 'Node.js', 'MongoDB', 'AWS'],
  },
  {
    title: 'Creativals',
    description: 'Comprehensive business platform developed using React, Node.js, and PostgreSQL. Features API-driven solutions and optimized backend architecture.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=300&fit=crop',
    link: 'https://creativals.com/',
    tech: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'Xverse Meta',
    description: 'Innovative metaverse technology solutions platform focusing on immersive digital experiences and virtual reality applications.',
    image: 'https://images.app.goo.gl/ULt2phHgURDbvqBQ8',
    link: 'https://xversemeta.tech/',
    tech: ['React', 'Three.js', 'WebGL', 'VR'],
  },
  {
    title: 'Blockchain Farmers Portal',
    description: 'Secure blockchain-based portal using Python, SQL, and Ethereum smart contracts. Features responsive frontend and API integration.',
    image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=500&h=300&fit=crop',
    tech: ['Python', 'Blockchain', 'SQL', 'HTML/CSS/JS'],
  },
];

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-indigo-900 text-indigo-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <div className="flex justify-end space-x-4">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <ExternalLink size={20} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
