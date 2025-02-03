import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Linkedin, Github, Twitter } from 'lucide-react';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="text-indigo-400" size={20} />
                  <a href="mailto:pendkarsaivarun@gmail.com" className="text-gray-300 hover:text-indigo-400">
                    pendkarsaivarun@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-indigo-400" size={20} />
                  <span className="text-gray-300">+91 8309732876</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-indigo-400" size={20} />
                  <span className="text-gray-300">Hyderabad, India</span>
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Follow Me</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://linkedin.com/in/sai-varun-pendkar-308186281"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="https://github.com/varunmittu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href="https://x.com/PendkarVarun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    <Twitter size={24} />
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;