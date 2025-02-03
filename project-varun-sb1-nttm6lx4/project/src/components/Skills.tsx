import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Server, Database, Cloud, Brain, PenTool as Tool } from 'lucide-react';

const skillCategories = [
  {
    title: 'Frontend Development',
    icon: <Code className="w-8 h-8 text-indigo-400" />,
    skills: ['React.js', 'HTML/CSS', 'JavaScript', 'TypeScript']
  },
  {
    title: 'Backend Development',
    icon: <Server className="w-8 h-8 text-indigo-400" />,
    skills: ['Node.js', 'Python', 'Java', 'Express.js']
  },
  {
    title: 'Database',
    icon: <Database className="w-8 h-8 text-indigo-400" />,
    skills: ['MongoDB', 'PostgreSQL', 'MySQL']
  },
  {
    title: 'Cloud & DevOps',
    icon: <Cloud className="w-8 h-8 text-indigo-400" />,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
  },
  {
    title: 'AI & ML',
    icon: <Brain className="w-8 h-8 text-indigo-400" />,
    skills: ['Machine Learning', 'Python Libraries', 'Data Analysis']
  },
  {
    title: 'Tools & Others',
    icon: <Tool className="w-8 h-8 text-indigo-400" />,
    skills: ['Git', 'REST APIs', 'GraphQL', 'Agile']
  }
];

const certifications = [
  'Python Programming',
  'MongoDB Developers (Geeks for Geeks)',
  'Artificial Intelligence & Machine Learning (IBM)',
  'Artificial Intelligence Fundamentals (IBM)',
  'Generative AI (AWS)',
];

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="skills" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Skills & Expertise
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold text-white ml-3">
                    {category.title}
                  </h3>
                </div>
                <div className="space-y-2">
                  {category.skills.map((skill) => (
                    <div key={skill} className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                      <span className="text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-white mb-8">
              Certifications
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 text-center"
                >
                  <p className="text-gray-300">{cert}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;